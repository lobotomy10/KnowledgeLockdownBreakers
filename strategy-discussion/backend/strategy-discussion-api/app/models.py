from pydantic import BaseModel
from typing import List, Optional

class PersonaConfig(BaseModel):
    name: str
    role: str
    position: str  # 賛成派、中立派、懐疑派など
    speaking_style: str
    icon: Optional[str] = None

class Message(BaseModel):
    persona_name: str
    content: str
    timestamp: str

class StrategyDocument(BaseModel):
    content: str

class Discussion(BaseModel):
    strategy_document: StrategyDocument
    messages: List[Message] = []
    is_active: bool = True
