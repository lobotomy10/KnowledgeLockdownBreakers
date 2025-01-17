from datetime import datetime
from typing import Dict, List, Optional

class Card:
    def __init__(
        self,
        id: str,
        title: str,
        content: str,
        author_id: str,
        media_urls: Optional[List[str]] = None,
        tags: Optional[List[str]] = None,
        correct_count: int = 0,
        created_at: Optional[datetime] = None,
        nft_status: Optional[Dict] = None
    ):
        self.id = id
        self.title = title
        self.content = content
        self.author_id = author_id
        self.media_urls = media_urls or []
        self.tags = tags or []
        self.correct_count = correct_count
        self.created_at = created_at or datetime.now()
        self.nft_status = nft_status

    def to_dict(self) -> Dict:
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "author_id": self.author_id,
            "media_urls": self.media_urls,
            "tags": self.tags,
            "correct_count": self.correct_count,
            "created_at": self.created_at.isoformat(),
            "nft_status": self.nft_status
        }

    @classmethod
    def from_dict(cls, data: Dict) -> "Card":
        return cls(
            id=data["id"],
            title=data["title"],
            content=data["content"],
            author_id=data["author_id"],
            media_urls=data.get("media_urls", []),
            tags=data.get("tags", []),
            correct_count=data.get("correct_count", 0),
            created_at=datetime.fromisoformat(data["created_at"]) if "created_at" in data else None,
            nft_status=data.get("nft_status")
        )
