from fastapi import FastAPI, HTTPException, Depends, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import openai
from dotenv import load_dotenv
import uuid
import os
import base64
import tempfile
from datetime import datetime
from web3 import Web3
from eth_account import Account
from eth_utils import to_checksum_address
import json
from redis import asyncio as aioredis
from fastapi_limiter import FastAPILimiter
from fastapi_limiter.depends import RateLimiter
import asyncio

load_dotenv()

app = FastAPI(title="CardNote API")

# Configure OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

# Configure Redis and rate limiting
@app.on_event("startup")
async def startup():
    redis = await aioredis.from_url("redis://localhost", encoding="utf-8", decode_responses=True)
    await FastAPILimiter.init(redis)

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

class Message(BaseModel):
    role: str
    content: str

class StreamRequest(BaseModel):
    messages: List[Message]
    persona: str
    
class AudioSegmentResult(BaseModel):
    segment_id: str
    start_time: int  # in seconds
    end_time: int  # in seconds
    transcript: str
    keywords: List[str]
    
class KeywordExtractionPrompt(BaseModel):
    prompt: str = "重要なキーワードを抽出する"

@app.post("/chat")
async def chat_stream(
    request: StreamRequest,
    rate_limit: bool = Depends(RateLimiter(times=10, seconds=60))
):
    try:
        # Add persona context to the messages
        messages = [{"role": "system", "content": f"あなたは{request.persona}として回答してください。"}]
        messages.extend([{"role": m.role, "content": m.content} for m in request.messages])

        try:
            response = await openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=messages,
                stream=True,
                temperature=0.7,
                max_tokens=150
            )
            return StreamingResponse(process_stream(response))
        except Exception as e:
            raise HTTPException(
                status_code=500,
                detail=f"APIリクエストに失敗しました: {str(e)}"
            )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"エラーが発生しました: {str(e)}"
        )

async def process_stream(response):
    async for chunk in response:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content

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

@app.post("/api/upload/media")
async def upload_media(files: List[UploadFile] = File(...)):
    saved_paths = []
    for file in files:
        # Save file to /uploads
        file_extension = file.filename.split(".")[-1]
        unique_id = str(uuid.uuid4())
        new_filename = f"{unique_id}.{file_extension}"
        file_path = os.path.join("uploads", new_filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        saved_paths.append(f"/static/{new_filename}")
    return {"media_urls": saved_paths}

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
    
    # Check if user has enough tokens (15 required)
    user_balance = 15  # Mock balance, replace with actual balance check
    if user_balance < 15:
        raise HTTPException(
            status_code=400,
            detail="Insufficient tokens. 15 tokens required for minting."
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

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.extraction_prompt: str = "重要なキーワードを抽出する"

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        
    def update_extraction_prompt(self, prompt: str):
        self.extraction_prompt = prompt

manager = ConnectionManager()

@app.websocket("/ws/audio")
async def websocket_audio_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            audio_data = await websocket.receive_bytes()
            
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=True) as temp_audio_file:
                temp_audio_file.write(audio_data)
                temp_audio_file.flush()
                
                transcript = await transcribe_audio(temp_audio_file.name)
                
                keywords = await extract_keywords(transcript, manager.extraction_prompt)
                
                segment_id = str(uuid.uuid4())
                current_time = int(datetime.now().timestamp())
                
                result = {
                    "type": "transcript",
                    "segment_id": segment_id,
                    "start_time": current_time - 30,  # Assuming 30-second segments
                    "end_time": current_time,
                    "transcript": transcript,
                    "keywords": keywords
                }
                
                await websocket.send_json(result)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"Error processing audio: {str(e)}")
        try:
            await websocket.send_json({"type": "error", "message": str(e)})
        except:
            pass
        manager.disconnect(websocket)

@app.post("/api/audio/prompt")
async def update_extraction_prompt(prompt_data: KeywordExtractionPrompt):
    """Update the prompt used for keyword extraction."""
    manager.update_extraction_prompt(prompt_data.prompt)
    return {"message": "Prompt updated successfully", "prompt": prompt_data.prompt}

async def transcribe_audio(audio_file_path: str) -> str:
    """Transcribe audio file using OpenAI's Whisper API."""
    try:
        with open(audio_file_path, "rb") as audio_file:
            transcript = await openai.audio.transcriptions.create(
                file=audio_file,
                model="whisper-1"
            )
        return transcript.text
    except Exception as e:
        print(f"Error transcribing audio: {str(e)}")
        return ""

async def extract_keywords(text: str, prompt: str = "重要なキーワードを抽出する") -> List[str]:
    """Extract keywords from text using OpenAI API based on the provided prompt."""
    if not text:
        return []
        
    try:
        response = await openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": f"あなたは与えられたテキストから{prompt}アシスタントです。テキストを分析し、最も重要な5-10個のキーワードをリストとして返してください。"},
                {"role": "user", "content": f"以下のテキストから{prompt}。キーワードのみをカンマ区切りのリストで返してください。\n\n{text}"}
            ],
            temperature=0.3,
            max_tokens=100
        )
        keywords_text = response.choices[0].message.content
        keywords = [keyword.strip() for keyword in keywords_text.split(',')]
        return keywords
    except Exception as e:
        print(f"Error extracting keywords: {str(e)}")
        return []

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
