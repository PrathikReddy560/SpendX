# Expense Service
# Business logic for transactions (expenses and income)

from uuid import UUID
from datetime import date, datetime
from decimal import Decimal
from typing import Optional, List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, extract
from sqlalchemy.orm import selectinload

from app.models.expense import Expense, TransactionType
from app.models.category import Category
from app.schemas.expense import (
    ExpenseCreate,
    ExpenseUpdate,
    ExpenseResponse,
    ExpenseListResponse,
    ExpenseSummary,
    CategoryBreakdown,
    CategoryResponse,
)


class ExpenseService:
    """Expense/transaction business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, user_id: UUID, data: ExpenseCreate) -> Expense:
        """Create a new expense/income transaction."""
        expense = Expense(
            user_id=user_id,
            category_id=data.category_id,
            amount=data.amount,
            type=TransactionType(data.type.value),
            description=data.description,
            date=data.date,
        )
        self.db.add(expense)
        await self.db.commit()
        await self.db.refresh(expense, ["category"])
        return expense
    
    async def get_by_id(self, expense_id: UUID, user_id: UUID) -> Optional[Expense]:
        """Get expense by ID for a specific user."""
        result = await self.db.execute(
            select(Expense)
            .options(selectinload(Expense.category))
            .where(
                and_(
                    Expense.id == expense_id,
                    Expense.user_id == user_id,
                )
            )
        )
        return result.scalar_one_or_none()
    
    async def list(
        self,
        user_id: UUID,
        page: int = 1,
        per_page: int = 20,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        category_id: Optional[int] = None,
        transaction_type: Optional[str] = None,
    ) -> Tuple[List[Expense], int]:
        """List expenses with filters and pagination."""
        query = (
            select(Expense)
            .options(selectinload(Expense.category))
            .where(Expense.user_id == user_id)
        )
        
        # Apply filters
        if start_date:
            query = query.where(Expense.date >= start_date)
        if end_date:
            query = query.where(Expense.date <= end_date)
        if category_id:
            query = query.where(Expense.category_id == category_id)
        if transaction_type:
            query = query.where(Expense.type == TransactionType(transaction_type))
        
        # Count total
        count_query = select(func.count()).select_from(query.subquery())
        total = (await self.db.execute(count_query)).scalar() or 0
        
        # Apply pagination and ordering
        query = (
            query
            .order_by(Expense.date.desc(), Expense.created_at.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
        )
        
        result = await self.db.execute(query)
        expenses = list(result.scalars().all())
        
        return expenses, total
    
    async def update(
        self,
        expense_id: UUID,
        user_id: UUID,
        data: ExpenseUpdate,
    ) -> Optional[Expense]:
        """Update an expense."""
        expense = await self.get_by_id(expense_id, user_id)
        if not expense:
            return None
        
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if field == "type" and value:
                value = TransactionType(value.value)
            setattr(expense, field, value)
        
        await self.db.commit()
        await self.db.refresh(expense, ["category"])
        return expense
    
    async def delete(self, expense_id: UUID, user_id: UUID) -> bool:
        """Delete an expense."""
        expense = await self.get_by_id(expense_id, user_id)
        if not expense:
            return False
        
        await self.db.delete(expense)
        await self.db.commit()
        return True
    
    async def get_summary(
        self,
        user_id: UUID,
        year: int,
        month: int,
    ) -> ExpenseSummary:
        """Get monthly expense summary with category breakdown."""
        # Get totals by type
        totals_query = (
            select(
                Expense.type,
                func.sum(Expense.amount).label("total"),
            )
            .where(
                and_(
                    Expense.user_id == user_id,
                    extract("year", Expense.date) == year,
                    extract("month", Expense.date) == month,
                )
            )
            .group_by(Expense.type)
        )
        
        totals_result = await self.db.execute(totals_query)
        totals = {row.type: row.total for row in totals_result}
        
        total_income = totals.get(TransactionType.INCOME, Decimal("0"))
        total_expense = totals.get(TransactionType.EXPENSE, Decimal("0"))
        
        # Get category breakdown (expenses only)
        category_query = (
            select(
                Category.id,
                Category.name,
                Category.icon,
                Category.color,
                func.sum(Expense.amount).label("amount"),
                func.count(Expense.id).label("count"),
            )
            .join(Expense, Expense.category_id == Category.id)
            .where(
                and_(
                    Expense.user_id == user_id,
                    Expense.type == TransactionType.EXPENSE,
                    extract("year", Expense.date) == year,
                    extract("month", Expense.date) == month,
                )
            )
            .group_by(Category.id, Category.name, Category.icon, Category.color)
            .order_by(func.sum(Expense.amount).desc())
        )
        
        category_result = await self.db.execute(category_query)
        categories = list(category_result.all())
        
        # Calculate percentages
        breakdown = []
        for cat in categories:
            pct = float(cat.amount / total_expense * 100) if total_expense > 0 else 0
            breakdown.append(CategoryBreakdown(
                category_id=cat.id,
                category_name=cat.name,
                category_icon=cat.icon,
                category_color=cat.color,
                amount=cat.amount,
                percentage=round(pct, 1),
                transaction_count=cat.count,
            ))
        
        return ExpenseSummary(
            total_income=total_income,
            total_expense=total_expense,
            balance=total_income - total_expense,
            category_breakdown=breakdown,
        )
    
    async def get_all_categories(self) -> List[Category]:
        """Get all expense categories."""
        result = await self.db.execute(select(Category).order_by(Category.id))
        return list(result.scalars().all())
    
    async def get_monthly_data(
        self,
        user_id: UUID,
        months: int = 3,
    ) -> List[dict]:
        """Get spending data for the last N months (for AI predictions)."""
        today = date.today()
        data = []
        
        for i in range(months):
            # Calculate year/month
            month = today.month - i
            year = today.year
            if month <= 0:
                month += 12
                year -= 1
            
            # Get summary for this month
            summary = await self.get_summary(user_id, year, month)
            
            data.append({
                "year": year,
                "month": month,
                "total": float(summary.total_expense),
                "categories": {
                    cat.category_name: float(cat.amount)
                    for cat in summary.category_breakdown
                },
            })
        
        return data
