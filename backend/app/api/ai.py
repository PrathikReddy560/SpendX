# AI API Routes
# Gemini AI chat, predictions, and insights

from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.schemas.ai import (
    ChatRequest,
    ChatResponse,
    ChatHistoryResponse,
    PredictionResponse,
    InsightsResponse,
)
from app.services.ai_service import AIService
from app.utils.security import get_current_user


router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Chat with AI assistant about finances."""
    service = AIService(db)
    return await service.chat(current_user, request)


@router.get("/chat/{conversation_id}", response_model=ChatHistoryResponse)
async def get_chat_history(
    conversation_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get chat history for a conversation."""
    service = AIService(db)
    return await service.get_chat_history(current_user.id, conversation_id)


@router.get("/predict", response_model=PredictionResponse)
async def get_prediction(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get AI-powered spending prediction for next month."""
    service = AIService(db)
    return await service.get_prediction(current_user)


@router.get("/insights", response_model=InsightsResponse)
async def get_insights(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get AI-generated spending insights."""
    service = AIService(db)
    return await service.get_insights(current_user)
