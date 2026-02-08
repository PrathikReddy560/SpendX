# AI Service
# Gemini AI integration for chat, predictions, and insights

import uuid
import json
from datetime import datetime, date
from decimal import Decimal
from typing import Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

import google.generativeai as genai

from app.config import settings
from app.models.chat import ChatMessage, ChatRole
from app.models.user import User
from app.services.expense_service import ExpenseService
from app.services.budget_service import BudgetService
from app.schemas.ai import (
    ChatRequest,
    ChatResponse,
    ChatMessageResponse,
    ChatHistoryResponse,
    PredictionResponse,
    CategoryPrediction,
    InsightsResponse,
    AIInsight,
    InsightType,
)
from app.utils.prompts import (
    SYSTEM_PROMPT,
    CHAT_PROMPT_TEMPLATE,
    PREDICTION_PROMPT,
    INSIGHTS_PROMPT,
    format_spending_context,
    format_history_for_prediction,
)


class AIService:
    """Gemini AI integration service."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        # Configure Gemini
        if settings.gemini_api_key:
            genai.configure(api_key=settings.gemini_api_key)
            self.model = genai.GenerativeModel("gemini-2.0-flash")
        else:
            self.model = None
    
    async def chat(
        self,
        user: User,
        request: ChatRequest,
    ) -> ChatResponse:
        """Process a chat message and return AI response."""
        conversation_id = request.conversation_id or uuid.uuid4()
        
        # Get user's spending context
        expense_service = ExpenseService(self.db)
        today = date.today()
        
        # Get recent expenses
        expenses, _ = await expense_service.list(
            user_id=user.id,
            per_page=20,
        )
        expense_dicts = [
            {
                "date": str(e.date),
                "description": e.description or e.category.name,
                "amount": float(e.amount),
                "type": e.type.value,
            }
            for e in expenses
        ]
        
        # Get summary
        summary = await expense_service.get_summary(user.id, today.year, today.month)
        summary_dict = {
            "total_income": float(summary.total_income),
            "total_expense": float(summary.total_expense),
            "balance": float(summary.balance),
            "category_breakdown": [
                {
                    "name": cat.category_name,
                    "amount": float(cat.amount),
                    "percentage": cat.percentage,
                }
                for cat in summary.category_breakdown
            ],
        }
        
        # Build context
        context = format_spending_context(expense_dicts, summary_dict)
        
        # Generate AI response
        if self.model:
            full_prompt = SYSTEM_PROMPT.format(context=context)
            full_prompt += "\n\n" + CHAT_PROMPT_TEMPLATE.format(message=request.message)
            
            try:
                response = self.model.generate_content(full_prompt)
                ai_response = response.text
            except Exception as e:
                ai_response = f"I apologize, but I'm having trouble processing your request. Please try again. (Error: {str(e)[:50]})"
        else:
            # Fallback when no API key
            ai_response = self._generate_mock_response(request.message, summary_dict)
        
        # Save user message
        user_message = ChatMessage(
            user_id=user.id,
            conversation_id=conversation_id,
            role=ChatRole.USER,
            content=request.message,
        )
        self.db.add(user_message)
        
        # Save AI response
        ai_message = ChatMessage(
            user_id=user.id,
            conversation_id=conversation_id,
            role=ChatRole.ASSISTANT,
            content=ai_response,
        )
        self.db.add(ai_message)
        await self.db.commit()
        await self.db.refresh(ai_message)
        
        return ChatResponse(
            message=ChatMessageResponse(
                id=ai_message.id,
                role=ChatRole.ASSISTANT,
                content=ai_response,
                timestamp=ai_message.created_at,
            ),
            conversation_id=conversation_id,
        )
    
    async def get_chat_history(
        self,
        user_id: uuid.UUID,
        conversation_id: uuid.UUID,
    ) -> ChatHistoryResponse:
        """Get chat history for a conversation."""
        result = await self.db.execute(
            select(ChatMessage)
            .where(
                and_(
                    ChatMessage.user_id == user_id,
                    ChatMessage.conversation_id == conversation_id,
                )
            )
            .order_by(ChatMessage.created_at)
        )
        messages = list(result.scalars().all())
        
        return ChatHistoryResponse(
            conversation_id=conversation_id,
            messages=[
                ChatMessageResponse(
                    id=msg.id,
                    role=msg.role,
                    content=msg.content,
                    timestamp=msg.created_at,
                )
                for msg in messages
            ],
        )
    
    async def get_prediction(self, user: User) -> PredictionResponse:
        """Get AI-powered spending prediction for next month."""
        expense_service = ExpenseService(self.db)
        
        # Get historical data
        monthly_data = await expense_service.get_monthly_data(user.id, months=3)
        
        # Get current month progress
        today = date.today()
        current_summary = await expense_service.get_summary(
            user.id, today.year, today.month
        )
        
        current_month_data = {
            "day_of_month": today.day,
            "days_in_month": 30,  # Simplified
            "spent_so_far": float(current_summary.total_expense),
            "categories": {
                cat.category_name: float(cat.amount)
                for cat in current_summary.category_breakdown
            },
        }
        
        if self.model and monthly_data:
            # Use Gemini for prediction
            history_str = format_history_for_prediction(monthly_data)
            prompt = PREDICTION_PROMPT.format(
                spending_history=history_str,
                current_month=json.dumps(current_month_data, indent=2),
            )
            
            try:
                response = self.model.generate_content(prompt)
                # Try to parse JSON from response
                prediction_data = self._parse_json_response(response.text)
                return self._build_prediction_response(prediction_data, monthly_data)
            except Exception:
                pass
        
        # Fallback prediction based on averages
        return self._generate_fallback_prediction(monthly_data, current_summary)
    
    async def get_insights(self, user: User) -> InsightsResponse:
        """Get AI-generated spending insights."""
        expense_service = ExpenseService(self.db)
        budget_service = BudgetService(self.db)
        
        today = date.today()
        summary = await expense_service.get_summary(user.id, today.year, today.month)
        budget = await budget_service.get_current(user.id)
        
        # Prepare data for AI
        spending_data = {
            "total_spent": float(summary.total_expense),
            "total_income": float(summary.total_income),
            "top_categories": [
                {"name": cat.category_name, "amount": float(cat.amount), "pct": cat.percentage}
                for cat in summary.category_breakdown[:5]
            ],
        }
        
        budget_status = None
        if budget:
            budget_status = {
                "limit": float(budget.total_limit),
                "spent": float(budget.total_spent),
                "remaining": float(budget.remaining),
                "pct_used": budget.percentage_used,
            }
        
        if self.model:
            prompt = INSIGHTS_PROMPT.format(
                spending_data=json.dumps(spending_data, indent=2),
                budget_status=json.dumps(budget_status, indent=2) if budget_status else "No budget set",
            )
            
            try:
                response = self.model.generate_content(prompt)
                insights_data = self._parse_json_response(response.text)
                if isinstance(insights_data, list):
                    return InsightsResponse(
                        insights=[
                            AIInsight(
                                type=InsightType(i.get("type", "tip")),
                                title=i.get("title", "Insight"),
                                description=i.get("description", ""),
                                icon=i.get("icon", "lightbulb-on"),
                            )
                            for i in insights_data[:3]
                        ],
                        generated_at=datetime.now(),
                    )
            except Exception:
                pass
        
        # Fallback insights
        return self._generate_fallback_insights(summary, budget)
    
    def _generate_mock_response(self, message: str, summary: dict) -> str:
        """Generate mock response when no API key."""
        lower = message.lower()
        
        if "spend" in lower or "expense" in lower:
            total = summary.get("total_expense", 0)
            return f"Based on your data, you've spent ${total:,.2f} this month. Your top spending categories are: {', '.join([c['name'] for c in summary.get('category_breakdown', [])[:3]])}. Would you like tips on reducing expenses?"
        
        if "budget" in lower:
            return "I'd recommend following the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. Based on your income, I can help you create a personalized budget. Would you like that?"
        
        if "save" in lower or "saving" in lower:
            return "Here are 3 ways to boost your savings:\n1. Review subscriptions you're not using\n2. Cook at home more often\n3. Set up automatic transfers to savings\n\nWould you like specific advice based on your spending?"
        
        return f"I can help you understand your finances! You currently have a balance of ${summary.get('balance', 0):,.2f}. Ask me about your spending patterns, budgeting tips, or savings goals."
    
    def _parse_json_response(self, text: str) -> dict:
        """Extract JSON from AI response."""
        # Try to find JSON in the response
        start = text.find("{")
        end = text.rfind("}") + 1
        if start == -1:
            start = text.find("[")
            end = text.rfind("]") + 1
        
        if start != -1 and end > start:
            json_str = text[start:end]
            return json.loads(json_str)
        raise ValueError("No valid JSON found")
    
    def _build_prediction_response(
        self,
        data: dict,
        monthly_data: List[dict],
    ) -> PredictionResponse:
        """Build prediction response from AI data."""
        today = date.today()
        next_month = today.month + 1 if today.month < 12 else 1
        next_year = today.year if today.month < 12 else today.year + 1
        month_name = date(next_year, next_month, 1).strftime("%B %Y")
        
        last_month = monthly_data[0] if monthly_data else {"total": 0}
        
        return PredictionResponse(
            next_month=month_name,
            predicted_total=Decimal(str(data.get("predicted_total", 0))),
            last_month_total=Decimal(str(last_month.get("total", 0))),
            potential_savings=Decimal(str(data.get("savings_potential", 0))),
            risk_level=data.get("risk_level", "medium"),
            category_predictions=[
                CategoryPrediction(
                    category_id=i + 1,
                    category_name=cp.get("category", "Unknown"),
                    category_icon="dots-horizontal",
                    category_color="#6B7280",
                    predicted_amount=Decimal(str(cp.get("predicted", 0))),
                    last_month_amount=Decimal(str(cp.get("predicted", 0) * 0.9)),
                    change_percentage=cp.get("change_pct", 0),
                    trend=cp.get("trend", "stable"),
                )
                for i, cp in enumerate(data.get("category_predictions", []))
            ],
            recommendations=data.get("recommendations", []),
            explanation=data.get("explanation", "Based on your spending history."),
        )
    
    def _generate_fallback_prediction(
        self,
        monthly_data: List[dict],
        current_summary,
    ) -> PredictionResponse:
        """Generate fallback prediction without AI."""
        today = date.today()
        next_month = today.month + 1 if today.month < 12 else 1
        next_year = today.year if today.month < 12 else today.year + 1
        month_name = date(next_year, next_month, 1).strftime("%B %Y")
        
        # Calculate average from history
        if monthly_data:
            avg_total = sum(m["total"] for m in monthly_data) / len(monthly_data)
        else:
            avg_total = float(current_summary.total_expense) * 1.1
        
        return PredictionResponse(
            next_month=month_name,
            predicted_total=Decimal(str(round(avg_total, 2))),
            last_month_total=Decimal(str(monthly_data[0]["total"])) if monthly_data else Decimal("0"),
            potential_savings=Decimal(str(round(avg_total * 0.15, 2))),
            risk_level="medium",
            category_predictions=[
                CategoryPrediction(
                    category_id=cat.category_id,
                    category_name=cat.category_name,
                    category_icon=cat.category_icon,
                    category_color=cat.category_color,
                    predicted_amount=cat.amount,
                    last_month_amount=cat.amount,
                    change_percentage=0,
                    trend="stable",
                )
                for cat in current_summary.category_breakdown[:5]
            ],
            recommendations=[
                "Track your daily expenses consistently",
                "Set category-specific budget limits",
                "Review and cancel unused subscriptions",
            ],
            explanation="Prediction based on your average spending patterns over recent months.",
        )
    
    def _generate_fallback_insights(
        self,
        summary,
        budget,
    ) -> InsightsResponse:
        """Generate fallback insights without AI."""
        insights = []
        
        # Tip based on top category
        if summary.category_breakdown:
            top_cat = summary.category_breakdown[0]
            insights.append(AIInsight(
                type=InsightType.TIP,
                title=f"Watch {top_cat.category_name} spending",
                description=f"This category takes {top_cat.percentage:.0f}% of your expenses. Consider setting a limit.",
                icon="lightbulb-on",
            ))
        
        # Budget status
        if budget:
            if budget.percentage_used > 80:
                insights.append(AIInsight(
                    type=InsightType.WARNING,
                    title="Budget running low",
                    description=f"You've used {budget.percentage_used:.0f}% of your monthly budget.",
                    icon="alert-circle",
                ))
            elif budget.percentage_used < 50:
                insights.append(AIInsight(
                    type=InsightType.ACHIEVEMENT,
                    title="Great budget progress!",
                    description=f"Only {budget.percentage_used:.0f}% used - you're on track!",
                    icon="trophy",
                ))
        
        # Balance insight
        if float(summary.balance) > 0:
            insights.append(AIInsight(
                type=InsightType.TIP,
                title="Positive cash flow",
                description=f"You have ${float(summary.balance):,.0f} surplus. Consider saving it!",
                icon="piggy-bank",
            ))
        
        return InsightsResponse(
            insights=insights[:3],
            generated_at=datetime.now(),
        )
