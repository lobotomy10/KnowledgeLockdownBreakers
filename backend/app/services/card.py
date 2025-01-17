import uuid
from typing import List, Optional
from datetime import datetime

from ..core.config import settings
from ..models.card import Card
from ..db.base import InMemoryDB
from ..services.token import TokenService

class CardService:
    def __init__(self):
        self.cards_db = InMemoryDB[Card]()
        self.token_service = TokenService()
    
    async def create_card(
        self,
        title: str,
        content: str,
        author_id: str,
        media_urls: Optional[List[str]] = None,
        tags: Optional[List[str]] = None
    ) -> Card:
        card_id = str(uuid.uuid4())
        card = Card(
            id=card_id,
            title=title,
            content=content,
            author_id=author_id,
            media_urls=media_urls,
            tags=tags
        )
        await self.cards_db.create(card_id, card)
        
        # Reward user for creating card
        await self.token_service.reward_card_creation(author_id)
        
        # Check if this is user's first card
        user_cards = await self.cards_db.find_by("author_id", author_id)
        if len(user_cards) == 1:
            # Auto-distribute initial cards
            await self.distribute_initial_cards(author_id)
        
        return card
    
    async def distribute_initial_cards(self, user_id: str) -> List[Card]:
        # In a real implementation, this would select cards based on some criteria
        all_cards = await self.cards_db.get_all()
        available_cards = [
            card for card in all_cards 
            if card.author_id != user_id
        ][:settings.INITIAL_CARD_DISTRIBUTION]
        return available_cards
    
    async def get_card(self, card_id: str) -> Optional[Card]:
        return await self.cards_db.get(card_id)
    
    async def get_user_cards(self, user_id: str) -> List[Card]:
        return await self.cards_db.find_by("author_id", user_id)
    
    async def mark_card_correct(self, card_id: str, user_id: str) -> Optional[Card]:
        card = await self.get_card(card_id)
        if card:
            card.correct_count += 1
            await self.cards_db.update(card_id, card)
            # Deduct tokens for marking as correct
            await self.token_service.process_correct_card(user_id)
        return card
