import uuid
from typing import List, Optional
from datetime import datetime

from ..core.config import settings
from ..models.card import Card
from ..db.base import InMemoryDB
from ..services.token import TokenService

class CardService:
    _instance = None
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CardService, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not CardService._initialized:
            self.cards_db = InMemoryDB[Card]()
            self.token_service = TokenService()
            CardService._initialized = True
    
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
            initial_cards = await self.distribute_initial_cards(author_id)
            # Create sample cards if needed
            while len(initial_cards) < settings.INITIAL_CARD_DISTRIBUTION:
                sample_card_id = str(uuid.uuid4())
                sample_card = Card(
                    id=sample_card_id,
                    title=f"Sample Card {len(initial_cards) + 1}",
                    content="This is a sample card to help you get started with the platform.",
                    author_id="system",
                    tags=["sample"]
                )
                await self.cards_db.create(sample_card_id, sample_card)
                initial_cards.append(sample_card)
        
        return card
    
    async def distribute_initial_cards(self, user_id: str) -> List[Card]:
        # Get all cards except user's own cards
        all_cards = await self.cards_db.get_all()
        other_cards = [card for card in all_cards if card.author_id != user_id]
        
        # If not enough cards, create some sample cards
        while len(other_cards) < settings.INITIAL_CARD_DISTRIBUTION:
            card_id = str(uuid.uuid4())
            sample_card = Card(
                id=card_id,
                title=f"Sample Card {len(other_cards) + 1}",
                content=f"This is a sample card to help you get started with the platform.",
                author_id="system",
                tags=["sample"]
            )
            await self.cards_db.create(card_id, sample_card)
            other_cards.append(sample_card)
        
        return other_cards[:settings.INITIAL_CARD_DISTRIBUTION]
    
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
