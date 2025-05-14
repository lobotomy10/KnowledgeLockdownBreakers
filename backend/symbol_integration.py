"""
Symbol Integration Module

This module provides API endpoints to interact with the Symbol blockchain
and bridge data between Symbol and Ethereum blockchains.
"""

import os
import json
import requests
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/symbol", tags=["symbol"])

class SymbolCard(BaseModel):
    id: str
    title: str
    content: str
    author: str
    symbolAddress: str
    createdAt: str

class SymbolUser(BaseModel):
    username: str
    symbolAddress: str

class ConvertToNFTRequest(BaseModel):
    cardId: str
    ethereumAddress: str

class ConvertToNFTResponse(BaseModel):
    success: bool
    tokenId: Optional[str] = None
    error: Optional[str] = None

SYMBOL_API_URL = os.getenv("SYMBOL_API_URL", "http://localhost:3000")
SYMBOL_NODE = os.getenv("SYMBOL_NODE", "https://sym-test.opening-line.jp:3001")
SYMBOL_NETWORK = int(os.getenv("SYMBOL_NETWORK", "152"))
SYMBOL_METADATA_KEY = os.getenv("SYMBOL_METADATA_KEY", "knowledge_card")

symbol_cards_cache = {}
symbol_users_cache = {}

def decrypt_caesar_cipher(encrypted_data: str) -> str:
    """
    Decrypts data using Caesar cipher with a shift of -3
    This mimics the encryption used in KnowledgeCardToken
    """
    result = ""
    for char in encrypted_data:
        code = ord(char)
        if (65 <= code <= 90) or (97 <= code <= 122):
            shift = 97 if code >= 97 else 65
            result += chr(((code - shift - 3 + 26) % 26) + shift)
        else:
            result += char
    return result

async def fetch_from_symbol_api(endpoint: str) -> Dict[str, Any]:
    """
    Fetches data from the Symbol API
    In a real implementation, this would use Symbol SDK
    For now, we'll use a mock implementation
    """
    try:
        
        if endpoint == "cards":
            return list(symbol_cards_cache.values()) if symbol_cards_cache else []
        elif endpoint.startswith("cards/"):
            card_id = endpoint.split("/")[1]
            return symbol_cards_cache.get(card_id, {})
        elif endpoint.startswith("users/"):
            address = endpoint.split("/")[1]
            return symbol_users_cache.get(address, {})
        else:
            return {}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch from Symbol API: {str(e)}")

@router.get("/cards", response_model=List[SymbolCard])
async def get_symbol_cards():
    """
    Fetches all knowledge cards from the Symbol blockchain
    """
    try:
        
        if not symbol_cards_cache:
            symbol_cards_cache = {
                "1": {
                    "id": "1",
                    "title": "Introduction to Blockchain",
                    "content": "Blockchain is a distributed ledger technology...",
                    "author": "satoshi",
                    "symbolAddress": "TDPFWJT-XVPWMJ-WNVUNR-BYKJCZ-LTLOTM-DPCXPO-JJYY",
                    "createdAt": "2025-05-01T12:00:00Z"
                },
                "2": {
                    "id": "2",
                    "title": "Symbol Blockchain Overview",
                    "content": "Symbol is a secure and business-ready blockchain...",
                    "author": "nemtech",
                    "symbolAddress": "TDPFWJT-XVPWMJ-WNVUNR-BYKJCZ-LTLOTM-DPCXPO-JJYY",
                    "createdAt": "2025-05-02T14:30:00Z"
                }
            }
        
        return list(symbol_cards_cache.values())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Symbol cards: {str(e)}")

@router.get("/cards/{card_id}", response_model=SymbolCard)
async def get_symbol_card(card_id: str):
    """
    Fetches a specific knowledge card from the Symbol blockchain
    """
    try:
        
        if card_id not in symbol_cards_cache:
            raise HTTPException(status_code=404, detail=f"Symbol card {card_id} not found")
        
        return symbol_cards_cache[card_id]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Symbol card {card_id}: {str(e)}")

@router.get("/users/{symbol_address}", response_model=SymbolUser)
async def get_symbol_user(symbol_address: str):
    """
    Fetches user data from the Symbol blockchain
    """
    try:
        
        if not symbol_users_cache:
            symbol_users_cache = {
                "TDPFWJT-XVPWMJ-WNVUNR-BYKJCZ-LTLOTM-DPCXPO-JJYY": {
                    "username": "satoshi",
                    "symbolAddress": "TDPFWJT-XVPWMJ-WNVUNR-BYKJCZ-LTLOTM-DPCXPO-JJYY"
                }
            }
        
        if symbol_address not in symbol_users_cache:
            raise HTTPException(status_code=404, detail=f"Symbol user {symbol_address} not found")
        
        return symbol_users_cache[symbol_address]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Symbol user {symbol_address}: {str(e)}")

@router.post("/convert-to-nft", response_model=ConvertToNFTResponse)
async def convert_to_nft(request: ConvertToNFTRequest):
    """
    Converts a Symbol card to an Ethereum NFT
    """
    try:
        if request.cardId not in symbol_cards_cache:
            raise HTTPException(status_code=404, detail=f"Symbol card {request.cardId} not found")
        
        card = symbol_cards_cache[request.cardId]
        
        
        token_id = f"eth-{request.cardId}"
        
        return {
            "success": True,
            "tokenId": token_id
        }
    except HTTPException:
        raise
    except Exception as e:
        return {
            "success": False,
            "error": f"Failed to convert to NFT: {str(e)}"
        }
