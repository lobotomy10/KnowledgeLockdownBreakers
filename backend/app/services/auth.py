import firebase_admin
from firebase_admin import auth, credentials
from typing import Optional, Dict
import uuid
from datetime import datetime

from ..core.config import settings
from ..models.user import User
from ..db.base import InMemoryDB

class AuthService:
    def __init__(self):
        self.users_db = InMemoryDB[User]()
        # Mock implementation for development
        # TODO: Replace with proper Firebase initialization in production
        self._mock_tokens = {}
    
    async def verify_token(self, token: str) -> Optional[Dict]:
        # Mock implementation for development
        # TODO: Replace with proper Firebase token verification in production
        if token in self._mock_tokens:
            return self._mock_tokens[token]
        return None
    
    async def create_user(self, email: str, username: str, profile_image: Optional[str] = None) -> User:
        user_id = str(uuid.uuid4())
        user = User(
            id=user_id,
            email=email,
            username=username,
            profile_image=profile_image,
            token_balance=settings.INITIAL_TOKEN_BALANCE
        )
        await self.users_db.create(user_id, user)
        
        # In dev mode, create a mock token
        if settings.DEV_MODE:
            mock_token = f"dev_token_{user_id}"
            self._mock_tokens[mock_token] = {
                "uid": user_id,
                "email": email
            }
            setattr(user, "auth_token", mock_token)
        
        return user
    
    async def get_user(self, user_id: str) -> Optional[User]:
        return await self.users_db.get(user_id)
    
    async def update_user(self, user_id: str, username: Optional[str] = None, profile_image: Optional[str] = None) -> Optional[User]:
        user = await self.get_user(user_id)
        if user:
            if username:
                user.username = username
            if profile_image:
                user.profile_image = profile_image
            return await self.users_db.update(user_id, user)
        return None
