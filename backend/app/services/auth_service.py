# Authentication Service
# Business logic for user authentication

from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.auth import SignupRequest, LoginRequest, TokenResponse
from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)


class AuthService:
    """Authentication business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def signup(self, data: SignupRequest) -> TokenResponse:
        """Register a new user."""
        # Check if email already exists
        existing = await self.db.execute(
            select(User).where(User.email == data.email)
        )
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )
        
        # Create user
        user = User(
            email=data.email,
            password_hash=hash_password(data.password),
            name=data.name,
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        
        # Generate tokens
        access_token = create_access_token(user.id, user.email)
        refresh_token = create_refresh_token(user.id, user.email)
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
        )
    
    async def login(self, data: LoginRequest) -> TokenResponse:
        """Authenticate user and return tokens."""
        # Find user
        result = await self.db.execute(
            select(User).where(User.email == data.email)
        )
        user = result.scalar_one_or_none()
        
        if not user or not verify_password(data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Account is disabled",
            )
        
        # Generate tokens
        access_token = create_access_token(user.id, user.email)
        refresh_token = create_refresh_token(user.id, user.email)
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
        )
    
    async def refresh_tokens(self, refresh_token: str) -> TokenResponse:
        """Refresh access token using refresh token."""
        token_data = decode_token(refresh_token, "refresh")
        
        # Verify user still exists and is active
        result = await self.db.execute(
            select(User).where(User.id == token_data.user_id)
        )
        user = result.scalar_one_or_none()
        
        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token",
            )
        
        # Generate new tokens
        access_token = create_access_token(user.id, user.email)
        new_refresh_token = create_refresh_token(user.id, user.email)
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
        )
