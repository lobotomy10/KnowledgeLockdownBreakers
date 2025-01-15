from fastapi import FastAPI, HTTPException, Depends, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import uuid
import os
from datetime import datetime
from web3 import Web3
from eth_account import Account
from eth_utils import to_checksum_address
import json

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
nft_cards = {}  # Track NFT status of cards

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
    nft_status: Optional[dict] = None

class NFTMintRequest(BaseModel):
    card_id: str
    user_address: str

class CardInteraction(BaseModel):
    interaction_type: str

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

@app.post("/api/cards/{card_id}/interact")
async def interact_with_card(
    card_id: str,
    interaction: CardInteraction
):
    if card_id not in cards:
        raise HTTPException(status_code=404, detail="Card not found")
    
    if interaction.interaction_type == "correct":
        cards[card_id]["correct_count"] += 1
        return {"message": "Card marked as correct", "token_change": -2}
    raise HTTPException(status_code=400, detail="Invalid interaction type")

@app.get("/api/tokens/balance")
async def get_token_balance():
    return {"balance": 15}  # Mock balance

@app.get("/api/cards/{card_id}/nft-eligibility")
async def check_nft_eligibility(card_id: str):
    if card_id not in cards:
        raise HTTPException(status_code=404, detail="Card not found")
    
    card = cards[card_id]
    
    # Check eligibility criteria
    is_eligible = False
    reasons = []
    
    # High engagement check (100+ correct swipes)
    if card["correct_count"] >= 100:
        is_eligible = True
        reasons.append("high_engagement")
    
    # First card of the day check
    today = datetime.now().date()
    card_date = card["created_at"].date()
    if card_date == today:
        first_card_today = all(
            c["created_at"].date() != today or c["id"] == card_id
            for c in cards.values()
        )
        if first_card_today:
            is_eligible = True
            reasons.append("first_card_of_day")
    
    return {
        "eligible": is_eligible,
        "reasons": reasons,
        "requirements": {
            "correct_count": {
                "current": card["correct_count"],
                "required": 100
            }
        }
    }

@app.post("/api/nft/mint")
async def mint_nft(request: NFTMintRequest):
    if request.card_id not in cards:
        raise HTTPException(status_code=404, detail="Card not found")
    
    # Check eligibility
    eligibility = await check_nft_eligibility(request.card_id)
    if not eligibility["eligible"]:
        raise HTTPException(
            status_code=400,
            detail="Card is not eligible for NFT minting"
        )
    
    card = cards[request.card_id]
    
    # Check if user has enough tokens (50 required)
    user_balance = 15  # Mock balance, replace with actual balance check
    if user_balance < 50:
        raise HTTPException(
            status_code=400,
            detail="Insufficient tokens. 50 tokens required for minting."
        )
    
    try:
        # Prepare metadata for IPFS
        metadata = {
            "title": card["title"],
            "content": card["content"],
            "author": card["author_id"],
            "correctCount": card["correct_count"],
            "mediaUrls": card["media_urls"],
            "createdAt": card["created_at"].isoformat()
        }
        
        # TODO: Upload to IPFS and get URI (will be implemented in step 004)
        ipfs_uri = f"ipfs://mock/{request.card_id}"
        
        # TODO: Interact with smart contract to mint NFT
        # This is a mock response for now
        nft_data = {
            "token_id": str(uuid.uuid4()),
            "contract_address": "0x1234...5678",
            "owner_address": request.user_address,
            "ipfs_uri": ipfs_uri
        }
        
        # Update card with NFT status
        cards[request.card_id]["nft_status"] = nft_data
        nft_cards[request.card_id] = nft_data
        
        # Deduct tokens (mock implementation)
        
        return {
            "success": True,
            "nft_data": nft_data,
            "token_change": -50
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to mint NFT: {str(e)}"
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
