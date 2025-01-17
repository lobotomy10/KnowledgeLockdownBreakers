from datetime import datetime
from pydantic import BaseModel

class TokenTransactionBase(BaseModel):
    from_user_id: str
    to_user_id: str
    amount: int
    transaction_type: str

class TokenTransactionCreate(TokenTransactionBase):
    pass

class TokenTransactionResponse(TokenTransactionBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenTransfer(BaseModel):
    to_user_id: str
    amount: int

class TokenBalance(BaseModel):
    balance: int
