# Budget Schemas
# Pydantic models for budget data

from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, List
from decimal import Decimal


class BudgetCategoryCreate(BaseModel):
    """Category budget limit."""
    category_id: int
    limit_amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2)


class BudgetCreate(BaseModel):
    """Create/update budget request."""
    year: int = Field(ge=2020, le=2100)
    month: int = Field(ge=1, le=12)
    total_limit: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    category_limits: List[BudgetCategoryCreate] = []


class BudgetCategoryResponse(BaseModel):
    """Category budget with spent amount."""
    category_id: int
    category_name: str
    category_icon: str
    category_color: str
    limit_amount: Decimal
    spent_amount: Decimal
    remaining: Decimal
    percentage_used: float

    class Config:
        from_attributes = True


class BudgetResponse(BaseModel):
    """Budget response with category breakdown."""
    id: UUID
    year: int
    month: int
    total_limit: Decimal
    total_spent: Decimal
    remaining: Decimal
    percentage_used: float
    category_limits: List[BudgetCategoryResponse]
    created_at: datetime

    class Config:
        from_attributes = True


class BudgetListResponse(BaseModel):
    """Budget history."""
    items: List[BudgetResponse]
    total: int
