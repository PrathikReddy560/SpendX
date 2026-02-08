# Budget Service
# Business logic for budget management

from uuid import UUID
from datetime import date
from decimal import Decimal
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, extract
from sqlalchemy.orm import selectinload

from app.models.budget import Budget, BudgetCategory
from app.models.expense import Expense, TransactionType
from app.models.category import Category
from app.schemas.budget import (
    BudgetCreate,
    BudgetResponse,
    BudgetCategoryResponse,
)


class BudgetService:
    """Budget business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_or_update(self, user_id: UUID, data: BudgetCreate) -> Budget:
        """Create or update a budget for a specific month."""
        # Check if budget exists for this month
        result = await self.db.execute(
            select(Budget)
            .options(selectinload(Budget.category_limits).selectinload(BudgetCategory.category))
            .where(
                and_(
                    Budget.user_id == user_id,
                    Budget.year == data.year,
                    Budget.month == data.month,
                )
            )
        )
        existing_budget = result.scalar_one_or_none()
        
        if existing_budget:
            # Update existing budget
            existing_budget.total_limit = data.total_limit
            
            # Remove old category limits
            for cat_limit in existing_budget.category_limits:
                await self.db.delete(cat_limit)
            
            budget = existing_budget
        else:
            # Create new budget
            budget = Budget(
                user_id=user_id,
                year=data.year,
                month=data.month,
                total_limit=data.total_limit,
            )
            self.db.add(budget)
            await self.db.flush()
        
        # Add category limits
        for cat_limit in data.category_limits:
            budget_category = BudgetCategory(
                budget_id=budget.id,
                category_id=cat_limit.category_id,
                limit_amount=cat_limit.limit_amount,
            )
            self.db.add(budget_category)
        
        await self.db.commit()
        await self.db.refresh(budget, ["category_limits"])
        
        return budget
    
    async def get_current(self, user_id: UUID) -> Optional[BudgetResponse]:
        """Get current month's budget with spent amounts."""
        today = date.today()
        return await self.get_for_month(user_id, today.year, today.month)
    
    async def get_for_month(
        self,
        user_id: UUID,
        year: int,
        month: int,
    ) -> Optional[BudgetResponse]:
        """Get budget for a specific month with spent amounts."""
        # Get budget
        result = await self.db.execute(
            select(Budget)
            .options(
                selectinload(Budget.category_limits)
                .selectinload(BudgetCategory.category)
            )
            .where(
                and_(
                    Budget.user_id == user_id,
                    Budget.year == year,
                    Budget.month == month,
                )
            )
        )
        budget = result.scalar_one_or_none()
        
        if not budget:
            return None
        
        # Get spent amounts by category
        spent_query = (
            select(
                Expense.category_id,
                func.sum(Expense.amount).label("spent"),
            )
            .where(
                and_(
                    Expense.user_id == user_id,
                    Expense.type == TransactionType.EXPENSE,
                    extract("year", Expense.date) == year,
                    extract("month", Expense.date) == month,
                )
            )
            .group_by(Expense.category_id)
        )
        
        spent_result = await self.db.execute(spent_query)
        spent_by_category = {row.category_id: row.spent for row in spent_result}
        
        # Calculate total spent
        total_spent = sum(spent_by_category.values(), Decimal("0"))
        
        # Build response
        category_responses = []
        for cat_limit in budget.category_limits:
            spent = spent_by_category.get(cat_limit.category_id, Decimal("0"))
            remaining = cat_limit.limit_amount - spent
            pct = float(spent / cat_limit.limit_amount * 100) if cat_limit.limit_amount > 0 else 0
            
            category_responses.append(BudgetCategoryResponse(
                category_id=cat_limit.category_id,
                category_name=cat_limit.category.name,
                category_icon=cat_limit.category.icon,
                category_color=cat_limit.category.color,
                limit_amount=cat_limit.limit_amount,
                spent_amount=spent,
                remaining=remaining,
                percentage_used=round(pct, 1),
            ))
        
        total_pct = float(total_spent / budget.total_limit * 100) if budget.total_limit > 0 else 0
        
        return BudgetResponse(
            id=budget.id,
            year=budget.year,
            month=budget.month,
            total_limit=budget.total_limit,
            total_spent=total_spent,
            remaining=budget.total_limit - total_spent,
            percentage_used=round(total_pct, 1),
            category_limits=category_responses,
            created_at=budget.created_at,
        )
    
    async def get_history(
        self,
        user_id: UUID,
        limit: int = 12,
    ) -> List[BudgetResponse]:
        """Get budget history."""
        result = await self.db.execute(
            select(Budget)
            .where(Budget.user_id == user_id)
            .order_by(Budget.year.desc(), Budget.month.desc())
            .limit(limit)
        )
        budgets = list(result.scalars().all())
        
        responses = []
        for budget in budgets:
            response = await self.get_for_month(user_id, budget.year, budget.month)
            if response:
                responses.append(response)
        
        return responses
