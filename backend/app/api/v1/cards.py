from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from typing import List, Optional

from ...schemas.card import CardCreate, CardResponse, CardInteraction
from ...schemas.user import UserResponse
from ...services.card import CardService
from .auth import get_current_user

router = APIRouter()
card_service = CardService()

@router.post("", response_model=CardResponse)
async def create_card(
    card: CardCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    return await card_service.create_card(
        title=card.title,
        content=card.content,
        author_id=current_user.id,
        media_urls=card.media_urls,
        tags=card.tags
    )

@router.get("/feed", response_model=List[CardResponse])
async def get_card_feed(
    current_user: UserResponse = Depends(get_current_user)
):
    user_cards = await card_service.get_user_cards(current_user.id)
    if not user_cards:
        # If user has no cards, distribute initial cards
        return await card_service.distribute_initial_cards(current_user.id)
    return user_cards

@router.post("/{card_id}/interact")
async def interact_with_card(
    card_id: str,
    interaction: CardInteraction,
    current_user: UserResponse = Depends(get_current_user)
):
    if interaction.interaction_type == "correct":
        card = await card_service.mark_card_correct(card_id, current_user.id)
        if not card:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Card not found"
            )
        return {"message": "Card marked as correct", "token_change": -2}
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid interaction type"
    )
