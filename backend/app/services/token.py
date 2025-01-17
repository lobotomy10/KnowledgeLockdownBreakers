import uuid
from typing import List, Optional
from datetime import datetime

from ..core.config import settings
from ..models.token import TokenTransaction
from ..models.user import User
from ..db.base import InMemoryDB

class TokenService:
    _instance = None
    _initialized = False

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(TokenService, cls).__new__(cls)
        return cls._instance

    def __init__(self):
        if not TokenService._initialized:
            self.transactions_db = InMemoryDB[TokenTransaction]()
            self.users_db = InMemoryDB[User]()
            TokenService._initialized = True
    
    async def create_transaction(
        self,
        from_user_id: str,
        to_user_id: str,
        amount: int,
        transaction_type: str
    ) -> Optional[TokenTransaction]:
        # Check if sender has enough tokens
        if from_user_id != "system":
            from_user = await self.users_db.get(from_user_id)
            if not from_user or from_user.token_balance < amount:
                return None

        transaction_id = str(uuid.uuid4())
        transaction = TokenTransaction(
            id=transaction_id,
            from_user_id=from_user_id,
            to_user_id=to_user_id,
            amount=amount,
            transaction_type=transaction_type
        )
        await self.transactions_db.create(transaction_id, transaction)
        
        # Update user balances
        if from_user_id != "system":
            from_user = await self.users_db.get(from_user_id)
            if from_user:
                from_user.token_balance -= amount
                await self.users_db.update(from_user_id, from_user)
        
        if to_user_id != "system":
            to_user = await self.users_db.get(to_user_id)
            if to_user:
                to_user.token_balance += amount
                await self.users_db.update(to_user_id, to_user)
        
        return transaction
    
    async def reward_card_creation(self, user_id: str) -> Optional[TokenTransaction]:
        transaction = await self.create_transaction(
            "system",
            user_id,
            settings.CARD_CREATION_REWARD,
            "create_card"
        )
        if transaction:
            # Update user's token balance
            user = await self.users_db.get(user_id)
            if user:
                user.token_balance += settings.CARD_CREATION_REWARD
                await self.users_db.update(user_id, user)
        return transaction
    
    async def process_correct_card(self, user_id: str) -> Optional[TokenTransaction]:
        user = await self.users_db.get(user_id)
        if user and user.token_balance >= abs(settings.CORRECT_CARD_COST):
            return await self.create_transaction(
                user_id,
                "system",
                abs(settings.CORRECT_CARD_COST),
                "correct"
            )
        return None
    
    async def process_special_content(self, user_id: str) -> Optional[TokenTransaction]:
        user = await self.users_db.get(user_id)
        if user and user.token_balance >= abs(settings.SPECIAL_CONTENT_COST):
            return await self.create_transaction(
                user_id,
                "system",
                abs(settings.SPECIAL_CONTENT_COST),
                "special_content"
            )
        return None
    
    async def transfer_tokens(
        self,
        from_user_id: str,
        to_user_id: str,
        amount: int
    ) -> Optional[TokenTransaction]:
        from_user = await self.users_db.get(from_user_id)
        if from_user and from_user.token_balance >= amount:
            return await self.create_transaction(
                from_user_id,
                to_user_id,
                amount,
                "transfer"
            )
        return None
