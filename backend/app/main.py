# SpendX Backend - Main Application
# FastAPI app with CORS, routes, and lifespan events

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select

from app.config import settings
from app.database import create_tables, async_session_maker
from app.models.category import Category, DEFAULT_CATEGORIES
from app.api import (
    auth_router,
    users_router,
    expenses_router,
    budgets_router,
    ai_router,
)


async def seed_categories():
    """Seed default categories if not exists."""
    async with async_session_maker() as session:
        result = await session.execute(select(Category).limit(1))
        if result.scalar_one_or_none() is None:
            for cat_data in DEFAULT_CATEGORIES:
                category = Category(**cat_data, is_system=True)
                session.add(category)
            await session.commit()
            print("✅ Seeded default categories")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    print("🚀 Starting SpendX Backend...")
    await create_tables()
    print("✅ Database tables created")
    await seed_categories()
    print("✅ SpendX Backend ready!")
    
    yield
    
    # Shutdown
    print("👋 Shutting down SpendX Backend...")


# Create FastAPI app
app = FastAPI(
    title="SpendX API",
    description="AI-powered personal finance management API",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(users_router, prefix="/api")
app.include_router(expenses_router, prefix="/api")
app.include_router(budgets_router, prefix="/api")
app.include_router(ai_router, prefix="/api")


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "name": "SpendX API",
        "version": "1.0.0",
        "status": "healthy",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "database": "connected",
        "ai": "available" if settings.gemini_api_key else "not configured",
    }
