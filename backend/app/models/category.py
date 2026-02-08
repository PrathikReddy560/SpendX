# Category Model
# Pre-defined expense categories

from sqlalchemy import String, Boolean, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Category(Base):
    """Expense category model."""
    
    __tablename__ = "categories"
    
    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        autoincrement=True,
    )
    name: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
    )
    icon: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="dots-horizontal",
    )
    color: Mapped[str] = mapped_column(
        String(7),
        nullable=False,
        default="#6B7280",
    )
    is_system: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        comment="System categories cannot be deleted",
    )
    
    # Relationships
    expenses = relationship("Expense", back_populates="category")
    budget_categories = relationship("BudgetCategory", back_populates="category")
    
    def __repr__(self) -> str:
        return f"<Category {self.name}>"


# Default categories to seed
DEFAULT_CATEGORIES = [
    {"name": "Food & Dining", "icon": "food", "color": "#EF4444"},
    {"name": "Transport", "icon": "car", "color": "#3B82F6"},
    {"name": "Shopping", "icon": "shopping", "color": "#8B5CF6"},
    {"name": "Entertainment", "icon": "movie", "color": "#EC4899"},
    {"name": "Bills & Utilities", "icon": "file-document", "color": "#F59E0B"},
    {"name": "Health", "icon": "hospital", "color": "#22C55E"},
    {"name": "Education", "icon": "school", "color": "#06B6D4"},
    {"name": "Income", "icon": "cash-plus", "color": "#10B981"},
    {"name": "Other", "icon": "dots-horizontal", "color": "#6B7280"},
]
