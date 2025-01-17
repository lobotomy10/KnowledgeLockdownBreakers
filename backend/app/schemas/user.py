from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    profile_image: Optional[str] = None

class UserResponse(UserBase):
    id: str
    profile_image: Optional[str] = None
    token_balance: int
    created_at: datetime
    created_cards: List[str]
    correct_cards: List[str]
    unnecessary_cards: List[str]

    class Config:
        from_attributes = True
