from fastapi import APIRouter, Depends, HTTPException, status, Header
from typing import List

from ...schemas.token import TokenTransactionResponse, TokenTransfer, TokenBalance
from ...schemas.user import UserResponse
from ...services.token import TokenService
from .auth import get_current_user

router = APIRouter()
token_service = TokenService()

@router.get("/balance", response_model=TokenBalance)
async def get_token_balance(
    authorization: str = Header(None)
):
    current_user = await get_current_user(authorization)
    return TokenBalance(balance=current_user.token_balance)

@router.post("/transfer", response_model=TokenTransactionResponse)
async def transfer_tokens(
    transfer: TokenTransfer,
    authorization: str = Header(None)
):
    current_user = await get_current_user(authorization)
    transaction = await token_service.transfer_tokens(
        from_user_id=current_user.id,
        to_user_id=transfer.to_user_id,
        amount=transfer.amount
    )
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient tokens or invalid transfer"
        )
    return transaction

@router.post("/special-content/{card_id}")
async def process_special_content(
    card_id: str,
    authorization: str = Header(None)
):
    try:
        current_user = await get_current_user(authorization)
        transaction = await token_service.process_special_content(current_user.id)
        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient tokens"
            )
        return {
            "success": True,
            "message": "Special content unlocked",
            "token_change": -5
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
