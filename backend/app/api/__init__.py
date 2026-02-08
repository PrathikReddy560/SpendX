# API Routes Package
from app.api.auth import router as auth_router
from app.api.users import router as users_router
from app.api.expenses import router as expenses_router
from app.api.budgets import router as budgets_router
from app.api.ai import router as ai_router

__all__ = [
    "auth_router",
    "users_router",
    "expenses_router",
    "budgets_router",
    "ai_router",
]
