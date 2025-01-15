from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import uuid
import os
from datetime import datetime

app = FastAPI(title="CardNote API")

# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)

# Mount static files directory
app.mount("/static", StaticFiles(directory="uploads"), name="static")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mock database (will be replaced with PostgreSQL)
users = {}
cards = {}
token_transactions = {}
swipe_counts = {}  # Track daily swipe counts per user

class User(BaseModel):
    email: str
    username: str
    password: str  # In production, this would be hashed

class UserResponse(BaseModel):
    id: str
    email: str
    username: str
    token_balance: int
    created_at: datetime

class KnowledgeCard(BaseModel):
    title: str
    content: str
    media_urls: Optional[List[str]] = None
    tags: Optional[List[str]] = None

class CardResponse(BaseModel):
    id: str
    title: str
    content: str
    author_id: str
    media_urls: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    correct_count: int
    created_at: datetime

@app.post("/api/auth/signup", response_model=UserResponse)
async def signup(user: User):
    user_id = str(uuid.uuid4())
    users[user_id] = {
        "id": user_id,
        "email": user.email,
        "username": user.username,
        "password": user.password,  # Would be hashed in production
        "token_balance": 15,  # Initial balance
        "created_at": datetime.now()
    }
    return users[user_id]

@app.post("/api/cards", response_model=CardResponse)
async def create_card(card: KnowledgeCard):
    card_id = str(uuid.uuid4())
    cards[card_id] = {
        "id": card_id,
        "title": card.title,
        "content": card.content,
        "author_id": "mock_user_id",  # Would come from auth in production
        "media_urls": card.media_urls or [],
        "tags": card.tags or [],
        "correct_count": 0,
        "created_at": datetime.now()
    }
    return cards[card_id]

@app.get("/api/cards/feed", response_model=List[CardResponse])
async def get_card_feed():
    return list(cards.values())

class CardInteraction(BaseModel):
    interaction_type: str

@app.post("/api/cards/{card_id}/interact")
async def interact_with_card(
    card_id: str,
    interaction: CardInteraction
):
    # In production, user_id would come from auth
    user_id = "mock_user_id"
    today = datetime.now().date().isoformat()
    
    # Initialize or get today's swipe count
    if user_id not in swipe_counts:
        swipe_counts[user_id] = {}
    if today not in swipe_counts[user_id]:
        swipe_counts[user_id][today] = 0
        
    # Check swipe limit
    if swipe_counts[user_id][today] >= 20:
        raise HTTPException(
            status_code=429,
            detail="Daily swipe limit (20) reached. Please try again tomorrow."
        )
    
    if card_id not in cards:
        raise HTTPException(status_code=404, detail="Card not found")
    
    # Increment swipe count before processing
    swipe_counts[user_id][today] += 1
    
    if interaction.interaction_type == "correct":
        # Deduct 2 tokens for marking a card as correct
        cards[card_id]["correct_count"] += 1
        return {
            "message": "Card marked as correct",
            "token_change": -2,
            "swipes_remaining": 20 - swipe_counts[user_id][today]
        }
    raise HTTPException(status_code=400, detail="Invalid interaction type")

@app.get("/api/tokens/balance")
async def get_token_balance():
    return {"balance": 15}  # Mock balance

@app.post("/api/upload")
async def upload_media(file: UploadFile = File(...)):
    # Validate file type
    allowed_image_types = ["image/jpeg", "image/png", "image/gif", "image/webp"]
    allowed_video_types = ["video/mp4", "video/webm", "video/quicktime"]
    content_type = file.content_type
    
    if content_type not in allowed_image_types + allowed_video_types:
        raise HTTPException(
            status_code=400,
            detail="File type not allowed. Supported types: JPG, PNG, GIF, WEBP, MP4, WEBM, MOV"
        )
    
    # Read file content
    contents = await file.read()
    
    # Validate file size (10MB limit)
    if len(contents) > 10 * 1024 * 1024:  # 10MB in bytes
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum size is 10MB"
        )
    
    # Generate unique filename
    file_id = str(uuid.uuid4())
    filename = file.filename or "unnamed_file"
    original_extension = os.path.splitext(filename)[1] or ".bin"  # Default extension if none provided
    new_filename = f"{file_id}{original_extension}"
    file_location = f"uploads/{new_filename}"
    
    # Save file
    with open(file_location, "wb") as buffer:
        buffer.write(contents)
    
    # Return URL
    return {"url": f"/static/{new_filename}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
