# System Architecture Design

## 1. System Overview
The KnowledgeLockdownBreakers system is a fullstack web application with the following components:
- Frontend (React + TypeScript)
- Backend (FastAPI)
- Database (PostgreSQL)
- Authentication Service (Firebase Auth)
- Smart Contract (Solidity)

## 2. Component Architecture

### 2.1 Frontend Architecture
```
src/
├── components/
│   ├── auth/
│   │   ├── SignUp.tsx       # User registration
│   │   └── Login.tsx        # User login
│   ├── cards/
│   │   ├── CardView.tsx     # YouTube Shorts-style card viewer
│   │   ├── CardCreate.tsx   # note-style editor
│   │   └── CardSwipe.tsx    # Tinder-style swipe component
│   ├── user/
│   │   ├── Profile.tsx      # User profile display
│   │   └── CardList.tsx     # User's card collections
│   └── common/
│       └── i18n/            # Internationalization
├── hooks/
│   ├── useAuth.ts           # Authentication hooks
│   ├── useCards.ts          # Card management hooks
│   └── useTokens.ts         # Token economy hooks
└── services/
    ├── api.ts               # Backend API client
    └── web3.ts              # Blockchain interaction
```

### 2.2 Backend Architecture
```
backend/
├── app/
│   ├── api/
│   │   ├── auth.py         # Authentication endpoints
│   │   ├── cards.py        # Card management
│   │   └── tokens.py       # Token economy
│   ├── models/
│   │   ├── user.py         # User model
│   │   ├── card.py         # Card model
│   │   └── token.py        # Token transaction model
│   └── services/
│       ├── auth.py         # Firebase Auth integration
│       ├── storage.py      # Media storage
│       └── blockchain.py   # Smart contract interaction
└── alembic/                # Database migrations
```

## 3. Data Models

### 3.1 User Model
```python
class User:
    id: str                 # UUID
    email: str
    username: str
    profile_image: str      # URL
    token_balance: int      # Default: 15
    created_cards: List[Card]
    sorted_cards: Dict[str, List[Card]]  # {"correct": [], "unnecessary": []}
```

### 3.2 Card Model
```python
class Card:
    id: str                 # UUID
    title: str
    content: str
    media_urls: List[str]   # Images/videos
    author_id: str          # User ID
    correct_count: int
    nft_status: Optional[NFTStatus]
    created_at: datetime
```

### 3.3 Token Transaction Model
```python
class TokenTransaction:
    id: str                 # UUID
    from_user_id: str
    to_user_id: str
    amount: int
    type: str              # "create_card", "correct", "unnecessary", "transfer"
    created_at: datetime
```

## 4. API Endpoints

### 4.1 Authentication
- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/social-login

### 4.2 User Management
- GET /api/users/me
- PUT /api/users/me
- GET /api/users/{id}/cards
- GET /api/users/{id}/sorted-cards

### 4.3 Card Management
- POST /api/cards
- GET /api/cards/feed
- POST /api/cards/{id}/sort
- GET /api/cards/{id}
- POST /api/cards/{id}/mint-nft

### 4.4 Token Economy
- GET /api/tokens/balance
- POST /api/tokens/transfer
- GET /api/tokens/transactions

## 5. Token Economy Rules
- Initial balance: 15 tokens
- Card creation reward: +5 tokens
- Correct card: -2 tokens
- Special content access: -5 tokens
- NFT minting cost: 50 tokens

## 6. Security Considerations
- Firebase Auth for secure authentication
- JWT for API authorization
- CORS configuration for frontend security
- Rate limiting for API endpoints
- Input validation and sanitization
- Secure media upload handling

## 7. Internationalization
- Default language: English
- Supported language: Japanese
- i18next integration for frontend
- Bilingual API responses

## 8. Performance Optimizations
- Image optimization and lazy loading
- Infinite scroll for card feed
- Caching strategy for frequently accessed data
- Database indexing for common queries
- CDN for media delivery

## 9. Deployment Architecture
```
                   [CDN]
                     ↑
[Frontend] ←→ [API Gateway] ←→ [Backend API]
                               ↙     ↓     ↘
                    [PostgreSQL] [Firebase] [IPFS]
                                     ↓
                             [Smart Contract]
```
