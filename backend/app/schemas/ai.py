# AI Schemas
# Pydantic models for AI/chat endpoints

from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, List
from enum import Enum
from decimal import Decimal


class ChatRole(str, Enum):
    """Chat message role."""
    USER = "user"
    ASSISTANT = "assistant"


class ChatRequest(BaseModel):
    """Chat message request."""
    message: str = Field(min_length=1, max_length=2000)
    conversation_id: Optional[UUID] = None


class ChatMessageResponse(BaseModel):
    """Single chat message."""
    id: UUID
    role: ChatRole
    content: str
    timestamp: datetime

    class Config:
        from_attributes = True


class ChatResponse(BaseModel):
    """Chat response from AI."""
    message: ChatMessageResponse
    conversation_id: UUID


class ChatHistoryResponse(BaseModel):
    """Conversation history."""
    conversation_id: UUID
    messages: List[ChatMessageResponse]


class CategoryPrediction(BaseModel):
    """Predicted spending for a category."""
    category_id: int
    category_name: str
    category_icon: str
    category_color: str
    predicted_amount: Decimal
    last_month_amount: Decimal
    change_percentage: float
    trend: str  # "up", "down", "stable"


class PredictionResponse(BaseModel):
    """AI budget prediction."""
    next_month: str  # "February 2026"
    predicted_total: Decimal
    last_month_total: Decimal
    potential_savings: Decimal
    risk_level: str  # "low", "medium", "high"
    category_predictions: List[CategoryPrediction]
    recommendations: List[str]
    explanation: str


class InsightType(str, Enum):
    """AI insight type."""
    TIP = "tip"
    WARNING = "warning"
    ACHIEVEMENT = "achievement"


class AIInsight(BaseModel):
    """AI-generated insight."""
    type: InsightType
    title: str
    description: str
    icon: str


class InsightsResponse(BaseModel):
    """AI insights response."""
    insights: List[AIInsight]
    generated_at: datetime
