from typing import Dict, List, Optional, TypeVar, Generic, Any
from datetime import datetime

T = TypeVar('T')

class InMemoryDB(Generic[T]):
    def __init__(self):
        self.data: Dict[str, T] = {}
        
    async def get(self, id: str) -> Optional[T]:
        return self.data.get(id)
        
    async def get_all(self) -> List[T]:
        return list(self.data.values())
        
    async def create(self, id: str, item: T) -> T:
        self.data[id] = item
        return item
        
    async def update(self, id: str, item: T) -> Optional[T]:
        if id in self.data:
            self.data[id] = item
            return item
        return None
        
    async def delete(self, id: str) -> bool:
        if id in self.data:
            del self.data[id]
            return True
        return False
        
    async def find_by(self, field: str, value: Any) -> List[T]:
        return [item for item in self.data.values() if getattr(item, field, None) == value]
