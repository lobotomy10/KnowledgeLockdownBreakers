from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from firebase_admin import auth as firebase_auth
from typing import Optional, Dict

from ...core.config import settings

from ...schemas.user import UserCreate, UserResponse, UserUpdate
from ...services.auth import AuthService
from ...core.config import settings

router = APIRouter()
auth_service = AuthService()

async def get_current_user(token: str = Depends(OAuth2PasswordBearer(tokenUrl="token"))) -> Optional[UserResponse]:
    decoded_token = await auth_service.verify_token(token)
    if not decoded_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    user = await auth_service.get_user(decoded_token["uid"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserResponse(**user.to_dict())

@router.post("/signup", response_model=dict)
async def signup(user: UserCreate):
    try:
        if not settings.DEV_MODE:
            # Create Firebase user in production
            firebase_user = firebase_auth.create_user(
                email=user.email,
                password=user.password
            )
        # Create user in our system
        db_user = await auth_service.create_user(
            email=user.email,
            username=user.username
        )
        return {
            "user": UserResponse(**db_user.to_dict()),
            "token": getattr(db_user, "auth_token", None)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.put("/me", response_model=UserResponse)
async def update_profile(
    update: UserUpdate,
    current_user: UserResponse = Depends(get_current_user)
):
    updated_user = await auth_service.update_user(
        current_user.id,
        username=update.username,
        profile_image=update.profile_image
    )
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return UserResponse(**updated_user.to_dict())
