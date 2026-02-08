# Expense Model
# Transaction records for income and expenses

import uuid
from datetime import datetime, date
from decimal import Decimal
from sqlalchemy import String, Date, DateTime, ForeignKey, Numeric, Boolean, Enum, func, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base
import enum


class TransactionType(str, enum.Enum):
    """Transaction type enum."""
    INCOME = "income"
    EXPENSE = "expense"


class Expense(Base):
    """Expense/Income transaction model."""
    
    __tablename__ = "expenses"
    
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
    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"),
        nullable=False,
        index=True,
    )
    amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )
    type: Mapped[TransactionType] = mapped_column(
        Enum(TransactionType),
        nullable=False,
        default=TransactionType.EXPENSE,
    )
    description: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )
    date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
        index=True,
    )
    is_auto_detected: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        comment="True if detected from UPI/bank statement",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )
    
    # Relationships
    user = relationship("User", back_populates="expenses")
    category = relationship("Category", back_populates="expenses")
    
    # Indexes for common queries
    __table_args__ = (
        Index("ix_expenses_user_date", "user_id", "date"),
        Index("ix_expenses_user_type", "user_id", "type"),
    )
    
    def __repr__(self) -> str:
        return f"<Expense {self.amount} {self.type.value}>"
