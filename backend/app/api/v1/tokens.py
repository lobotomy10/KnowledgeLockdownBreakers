from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from ...schemas.token import TokenTransactionResponse, TokenTransfer, TokenBalance
from ...schemas.user import UserResponse
from ...services.token import TokenService
from ..auth import get_current_user

router = APIRouter()
token_service = TokenService()

@router.get("/balance", response_model=TokenBalance)
async def get_token_balance(
    current_user: UserResponse = Depends(get_current_user)
):
    return TokenBalance(balance=current_user.token_balance)

@router.post("/transfer", response_model=TokenTransactionResponse)
async def transfer_tokens(
    transfer: TokenTransfer,
    current_user: UserResponse = Depends(get_current_user)
):
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
