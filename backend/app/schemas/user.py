# User Schemas
# Pydantic models for user data

from pydantic import BaseModel, EmailStr, Field
from uuid import UUID
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    """Base user fields."""
    email: EmailStr
    name: str = Field(min_length=2, max_length=100)


class UserCreate(UserBase):
    """User creation schema (internal use)."""
    password: str


class UserUpdate(BaseModel):
    """User update request."""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    avatar_url: Optional[str] = None
    phone: Optional[str] = Field(None, max_length=20)
    dob: Optional[str] = Field(None, max_length=10)  # YYYY-MM-DD format
    gender: Optional[str] = Field(None, max_length=20)
    notifications_enabled: Optional[bool] = None


class ChangePasswordRequest(BaseModel):
    """Change password request."""
    current_password: str = Field(min_length=1)
    new_password: str = Field(min_length=8, max_length=128)
    confirm_password: str = Field(min_length=8, max_length=128)


class UserResponse(BaseModel):
    """User response schema."""
    id: UUID
    email: EmailStr
    name: str
    avatar_url: Optional[str] = None
    phone: Optional[str] = None
    dob: Optional[str] = None
    gender: Optional[str] = None
    notifications_enabled: bool = True
    is_premium: bool = False
    created_at: datetime

    class Config:
        from_attributes = True


class UserProfileResponse(UserResponse):
    """Extended user profile with stats."""
    total_expenses: float = 0
    total_income: float = 0
    current_month_spent: float = 0

