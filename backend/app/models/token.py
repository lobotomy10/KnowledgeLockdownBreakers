from datetime import datetime
from typing import Dict, Optional

class TokenTransaction:
    def __init__(
        self,
        id: str,
        from_user_id: str,
        to_user_id: str,
        amount: int,
        transaction_type: str,  # "create_card", "correct", "unnecessary", "transfer"
        created_at: Optional[datetime] = None
    ):
        self.id = id
        self.from_user_id = from_user_id
        self.to_user_id = to_user_id
        self.amount = amount
        self.transaction_type = transaction_type
        self.created_at = created_at or datetime.now()

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "from_user_id": self.from_user_id,
            "to_user_id": self.to_user_id,
            "amount": self.amount,
            "transaction_type": self.transaction_type,
            "created_at": self.created_at.isoformat()
        }

    @classmethod
    def from_dict(cls, data: Dict) -> "TokenTransaction":
        return cls(
            id=data["id"],
            from_user_id=data["from_user_id"],
            to_user_id=data["to_user_id"],
            amount=data["amount"],
            transaction_type=data["transaction_type"],
            created_at=datetime.fromisoformat(data["created_at"]) if "created_at" in data else None
        )
