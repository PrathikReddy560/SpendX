# Users API Routes
# User profile management

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, extract
from datetime import date
import bcrypt

from app.database import get_db
from app.models.user import User
from app.models.expense import Expense, TransactionType
from app.schemas.user import UserResponse, UserUpdate, UserProfileResponse, ChangePasswordRequest
from app.utils.security import get_current_user


router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserProfileResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current user's profile with stats."""
    today = date.today()
    
    # Get totals
    totals_query = select(
        Expense.type,
        func.sum(Expense.amount).label("total"),
    ).where(Expense.user_id == current_user.id).group_by(Expense.type)
    
    result = await db.execute(totals_query)
    totals = {row.type: float(row.total) for row in result}
    
    # Get current month spending
    month_query = select(
        func.sum(Expense.amount).label("total"),
    ).where(
        Expense.user_id == current_user.id,
        Expense.type == TransactionType.EXPENSE,
        extract("year", Expense.date) == today.year,
        extract("month", Expense.date) == today.month,
    )
    
    month_result = await db.execute(month_query)
    current_month_spent = month_result.scalar() or 0
    
    return UserProfileResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        avatar_url=current_user.avatar_url,
        phone=current_user.phone,
        dob=current_user.dob,
        gender=current_user.gender,
        notifications_enabled=current_user.notifications_enabled,
        is_premium=current_user.is_premium,
        created_at=current_user.created_at,
        total_expenses=totals.get(TransactionType.EXPENSE, 0),
        total_income=totals.get(TransactionType.INCOME, 0),
        current_month_spent=float(current_month_spent),
    )


@router.patch("/me", response_model=UserResponse)
async def update_current_user(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update current user's profile."""
    update_data = data.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(current_user, field, value)
    
    await db.commit()
    await db.refresh(current_user)
    
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        name=current_user.name,
        avatar_url=current_user.avatar_url,
        phone=current_user.phone,
        dob=current_user.dob,
        gender=current_user.gender,
        notifications_enabled=current_user.notifications_enabled,
        is_premium=current_user.is_premium,
        created_at=current_user.created_at,
    )


@router.post("/me/change-password")
async def change_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Change current user's password."""
    # Verify current password
    if not bcrypt.checkpw(data.current_password.encode(), current_user.password_hash.encode()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    # Verify new passwords match
    if data.new_password != data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New passwords do not match"
        )
    
    # Verify new password is different
    if data.current_password == data.new_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be different from current password"
        )
    
    # Update password
    new_hash = bcrypt.hashpw(data.new_password.encode(), bcrypt.gensalt()).decode()
    current_user.password_hash = new_hash
    
    await db.commit()
    
    return {"message": "Password changed successfully"}

