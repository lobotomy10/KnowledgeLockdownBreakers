import uuid
from typing import List, Optional
from datetime import datetime

from ..core.config import settings
from ..models.token import TokenTransaction
from ..models.user import User
from ..db.base import InMemoryDB

class TokenService:
    def __init__(self):
        self.transactions_db = InMemoryDB[TokenTransaction]()
        self.users_db = InMemoryDB[User]()
    
    async def create_transaction(
        self,
        from_user_id: str,
        to_user_id: str,
        amount: int,
        transaction_type: str
    ) -> TokenTransaction:
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
        from_user = await self.users_db.get(from_user_id)
        to_user = await self.users_db.get(to_user_id)
        
        if from_user:
            from_user.token_balance -= amount
            await self.users_db.update(from_user_id, from_user)
        
        if to_user:
            to_user.token_balance += amount
            await self.users_db.update(to_user_id, to_user)
        
        return transaction
    
    async def reward_card_creation(self, user_id: str) -> TokenTransaction:
        return await self.create_transaction(
            "system",
            user_id,
            settings.CARD_CREATION_REWARD,
            "create_card"
        )
    
    async def process_correct_card(self, user_id: str) -> TokenTransaction:
        return await self.create_transaction(
            user_id,
            "system",
            abs(settings.CORRECT_CARD_COST),
            "correct"
        )
    
    async def process_special_content(self, user_id: str) -> TokenTransaction:
        return await self.create_transaction(
            user_id,
            "system",
            abs(settings.SPECIAL_CONTENT_COST),
            "special_content"
        )
    
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
