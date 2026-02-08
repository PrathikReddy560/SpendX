# Budget API Routes
# Budget management

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.schemas.budget import (
    BudgetCreate,
    BudgetResponse,
    BudgetListResponse,
)
from app.services.budget_service import BudgetService
from app.utils.security import get_current_user


router = APIRouter(prefix="/budgets", tags=["Budgets"])


@router.get("/current", response_model=BudgetResponse)
async def get_current_budget(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get current month's budget."""
    service = BudgetService(db)
    budget = await service.get_current(current_user.id)
    
    if not budget:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No budget set for this month. Create one first.",
        )
    
    return budget


@router.post("", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
async def create_or_update_budget(
    data: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create or update a monthly budget."""
    service = BudgetService(db)
    budget = await service.create_or_update(current_user.id, data)
    
    # Get full response with spent amounts
    return await service.get_for_month(current_user.id, data.year, data.month)


@router.get("/history", response_model=BudgetListResponse)
async def get_budget_history(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get budget history."""
    service = BudgetService(db)
    budgets = await service.get_history(current_user.id)
    
    return BudgetListResponse(
        items=budgets,
        total=len(budgets),
    )
