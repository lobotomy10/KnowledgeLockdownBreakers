from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "KnowledgeLockdownBreakers"
    API_V1_STR: str = "/api/v1"
    
    # Development mode flag
    DEV_MODE: bool = True
    
    # Firebase Admin SDK credentials (not used in dev mode)
    FIREBASE_CREDENTIALS: dict = {}
    
    # Token Economy Settings
    INITIAL_TOKEN_BALANCE: int = 15
    CARD_CREATION_REWARD: int = 5
    CORRECT_CARD_COST: int = -2
    SPECIAL_CONTENT_COST: int = -5
    NFT_MINTING_COST: int = 50
    
    # Card Distribution Settings
    INITIAL_CARD_DISTRIBUTION: int = 5

settings = Settings()
