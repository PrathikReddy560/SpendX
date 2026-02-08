# Expenses API Routes
# Transaction CRUD and summaries

from typing import Optional
from datetime import date
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
import math

from app.database import get_db
from app.models.user import User
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate,
    ExpenseResponse,
    ExpenseListResponse,
    ExpenseSummary,
    CategoryResponse,
)
from app.schemas.auth import MessageResponse
from app.services.expense_service import ExpenseService
from app.utils.security import get_current_user


router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.get("", response_model=ExpenseListResponse)
async def list_transactions(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    category_id: Optional[int] = None,
    type: Optional[str] = Query(None, regex="^(income|expense)$"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List transactions with filters and pagination."""
    service = ExpenseService(db)
    expenses, total = await service.list(
        user_id=current_user.id,
        page=page,
        per_page=per_page,
        start_date=start_date,
        end_date=end_date,
        category_id=category_id,
        transaction_type=type,
    )
    
    return ExpenseListResponse(
        items=[
            ExpenseResponse(
                id=e.id,
                amount=e.amount,
                type=e.type,
                description=e.description,
                date=e.date,
                category=CategoryResponse(
                    id=e.category.id,
                    name=e.category.name,
                    icon=e.category.icon,
                    color=e.category.color,
                ),
                is_auto_detected=e.is_auto_detected,
                created_at=e.created_at,
            )
            for e in expenses
        ],
        total=total,
        page=page,
        per_page=per_page,
        pages=math.ceil(total / per_page) if total > 0 else 1,
    )


@router.post("", response_model=ExpenseResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    data: ExpenseCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new transaction (expense or income)."""
    service = ExpenseService(db)
    expense = await service.create(current_user.id, data)
    
    return ExpenseResponse(
        id=expense.id,
        amount=expense.amount,
        type=expense.type,
        description=expense.description,
        date=expense.date,
        category=CategoryResponse(
            id=expense.category.id,
            name=expense.category.name,
            icon=expense.category.icon,
            color=expense.category.color,
        ),
        is_auto_detected=expense.is_auto_detected,
        created_at=expense.created_at,
    )


@router.get("/summary", response_model=ExpenseSummary)
async def get_summary(
    year: int = Query(..., ge=2020, le=2100),
    month: int = Query(..., ge=1, le=12),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get monthly expense summary with category breakdown."""
    service = ExpenseService(db)
    return await service.get_summary(current_user.id, year, month)


@router.get("/categories", response_model=list[CategoryResponse])
async def get_categories(
    db: AsyncSession = Depends(get_db),
):
    """Get all available expense categories."""
    service = ExpenseService(db)
    categories = await service.get_all_categories()
    return [
        CategoryResponse(
            id=c.id,
            name=c.name,
            icon=c.icon,
            color=c.color,
        )
        for c in categories
    ]


@router.get("/{expense_id}", response_model=ExpenseResponse)
async def get_transaction(
    expense_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a specific transaction by ID."""
    service = ExpenseService(db)
    expense = await service.get_by_id(expense_id, current_user.id)
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )
    
    return ExpenseResponse(
        id=expense.id,
        amount=expense.amount,
        type=expense.type,
        description=expense.description,
        date=expense.date,
        category=CategoryResponse(
            id=expense.category.id,
            name=expense.category.name,
            icon=expense.category.icon,
            color=expense.category.color,
        ),
        is_auto_detected=expense.is_auto_detected,
        created_at=expense.created_at,
    )


@router.patch("/{expense_id}", response_model=ExpenseResponse)
async def update_transaction(
    expense_id: UUID,
    data: ExpenseUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a transaction."""
    service = ExpenseService(db)
    expense = await service.update(expense_id, current_user.id, data)
    
    if not expense:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )
    
    return ExpenseResponse(
        id=expense.id,
        amount=expense.amount,
        type=expense.type,
        description=expense.description,
        date=expense.date,
        category=CategoryResponse(
            id=expense.category.id,
            name=expense.category.name,
            icon=expense.category.icon,
            color=expense.category.color,
        ),
        is_auto_detected=expense.is_auto_detected,
        created_at=expense.created_at,
    )


@router.delete("/{expense_id}", response_model=MessageResponse)
async def delete_transaction(
    expense_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete a transaction."""
    service = ExpenseService(db)
    deleted = await service.delete(expense_id, current_user.id)
    
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )
    
    return MessageResponse(message="Transaction deleted successfully")
