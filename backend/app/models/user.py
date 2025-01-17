from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel

class User:
    def __init__(
        self,
        id: str,
        email: str,
        username: str,
        profile_image: Optional[str] = None,
        token_balance: int = 15,  # Initial balance
        created_at: Optional[datetime] = None
    ):
        self.id = id
        self.email = email
        self.username = username
        self.profile_image = profile_image
        self.token_balance = token_balance
        self.created_at = created_at or datetime.now()
        self.created_cards: List[str] = []  # List of card IDs
        self.correct_cards: List[str] = []
        self.unnecessary_cards: List[str] = []

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "profile_image": self.profile_image,
            "token_balance": self.token_balance,
            "created_at": self.created_at.isoformat(),
            "created_cards": self.created_cards,
            "correct_cards": self.correct_cards,
            "unnecessary_cards": self.unnecessary_cards
        }

    @classmethod
    def from_dict(cls, data: Dict) -> "User":
        user = cls(
            id=data["id"],
            email=data["email"],
            username=data["username"],
            profile_image=data.get("profile_image"),
            token_balance=data.get("token_balance", 15),
            created_at=datetime.fromisoformat(data["created_at"]) if "created_at" in data else None
        )
        user.created_cards = data.get("created_cards", [])
        user.correct_cards = data.get("correct_cards", [])
        user.unnecessary_cards = data.get("unnecessary_cards", [])
        return user
