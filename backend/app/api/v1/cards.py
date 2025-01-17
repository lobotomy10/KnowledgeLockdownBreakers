from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Header
from typing import List, Optional

from ...core.config import settings
from ...schemas.card import CardCreate, CardResponse, CardInteraction
from ...schemas.user import UserResponse
from ...services.card import CardService
from ...services.token import TokenService
from .auth import get_current_user

router = APIRouter()
card_service = CardService()
token_service = TokenService()

@router.post("", response_model=CardResponse)
async def create_card(
    card: CardCreate,
    authorization: str = Header(None)
):
    current_user = await get_current_user(authorization)
    return await card_service.create_card(
        title=card.title,
        content=card.content,
        author_id=current_user.id,
        media_urls=card.media_urls,
        tags=card.tags
    )

@router.get("/feed", response_model=List[CardResponse])
async def get_card_feed(
    authorization: str = Header(None)
):
    current_user = await get_current_user(authorization)
    # Get all available cards
    all_cards = await card_service.cards_db.get_all()
    if not all_cards:
        # Create sample cards if no cards exist
        initial_cards = await card_service.distribute_initial_cards(current_user.id)
        return initial_cards
    return all_cards

@router.post("/{card_id}/interact")
async def interact_with_card(
    card_id: str,
    interaction: CardInteraction,
    authorization: str = Header(None)
):
    current_user = await get_current_user(authorization)
    if interaction.interaction_type == "correct":
        transaction = await token_service.process_correct_card(current_user.id)
        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient tokens"
            )
        card = await card_service.mark_card_correct(card_id, current_user.id)
        if not card:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Card not found"
            )
        return {"message": "Card marked as correct", "token_change": settings.CORRECT_CARD_COST}
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid interaction type"
    )
