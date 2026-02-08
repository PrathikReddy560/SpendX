# Expense Schemas
# Pydantic models for transaction data

from pydantic import BaseModel, Field
from uuid import UUID
from datetime import date, datetime
from typing import Optional, List
from enum import Enum
from decimal import Decimal


class TransactionType(str, Enum):
    """Transaction type."""
    INCOME = "income"
    EXPENSE = "expense"


class CategoryResponse(BaseModel):
    """Category response."""
    id: int
    name: str
    icon: str
    color: str

    class Config:
        from_attributes = True


class ExpenseCreate(BaseModel):
    """Create expense request."""
    amount: Decimal = Field(gt=0, max_digits=12, decimal_places=2)
    category_id: int
    type: TransactionType = TransactionType.EXPENSE
    description: Optional[str] = Field(None, max_length=255)
    date: date


class ExpenseUpdate(BaseModel):
    """Update expense request."""
    amount: Optional[Decimal] = Field(None, gt=0, max_digits=12, decimal_places=2)
    category_id: Optional[int] = None
    type: Optional[TransactionType] = None
    description: Optional[str] = Field(None, max_length=255)
    date: Optional[date] = None


class ExpenseResponse(BaseModel):
    """Expense response."""
    id: UUID
    amount: Decimal
    type: TransactionType
    description: Optional[str]
    date: date
    category: CategoryResponse
    is_auto_detected: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ExpenseListResponse(BaseModel):
    """Paginated expense list."""
    items: List[ExpenseResponse]
    total: int
    page: int
    per_page: int
    pages: int


class ExpenseSummary(BaseModel):
    """Monthly expense summary."""
    total_income: Decimal
    total_expense: Decimal
    balance: Decimal
    category_breakdown: List["CategoryBreakdown"]


class CategoryBreakdown(BaseModel):
    """Category spending breakdown."""
    category_id: int
    category_name: str
    category_icon: str
    category_color: str
    amount: Decimal
    percentage: float
    transaction_count: int


class DailySummary(BaseModel):
    """Daily spending summary."""
    date: date
    total: Decimal
    count: int
