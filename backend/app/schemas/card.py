from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel

class CardBase(BaseModel):
    title: str
    content: str
    media_urls: Optional[List[str]] = None
    tags: Optional[List[str]] = None

class CardCreate(CardBase):
    pass

class CardUpdate(CardBase):
    pass

class CardResponse(CardBase):
    id: str
    author_id: str
    correct_count: int
    created_at: datetime
    nft_status: Optional[Dict] = None

    class Config:
        from_attributes = True

class CardInteraction(BaseModel):
    interaction_type: str  # "correct" or "unnecessary"
