# Budget Model
# Monthly budget with category-wise limits

import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import Integer, DateTime, ForeignKey, Numeric, func, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class Budget(Base):
    """Monthly budget model."""
    
    __tablename__ = "budgets"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    year: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    month: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )
    total_limit: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    
    # Relationships
    user = relationship("User", back_populates="budgets")
    category_limits = relationship(
        "BudgetCategory",
        back_populates="budget",
        cascade="all, delete-orphan",
    )
    
    # Ensure one budget per user per month
    __table_args__ = (
        UniqueConstraint("user_id", "year", "month", name="uq_budget_user_month"),
    )
    
    def __repr__(self) -> str:
        return f"<Budget {self.year}-{self.month:02d} ${self.total_limit}>"


class BudgetCategory(Base):
    """Category-specific budget limit."""
    
    __tablename__ = "budget_categories"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )
    budget_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("budgets.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"),
        nullable=False,
    )
    limit_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )
    
    # Relationships
    budget = relationship("Budget", back_populates="category_limits")
    category = relationship("Category", back_populates="budget_categories")
    
    # Ensure one limit per category per budget
    __table_args__ = (
        UniqueConstraint("budget_id", "category_id", name="uq_budget_category"),
    )
    
    def __repr__(self) -> str:
        return f"<BudgetCategory ${self.limit_amount}>"
