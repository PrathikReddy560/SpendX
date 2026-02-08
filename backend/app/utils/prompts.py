# AI Prompt Templates
# Structured prompts for Gemini AI with finance guardrails

SYSTEM_PROMPT = """You are SpendX AI, a helpful personal finance assistant. You help users understand their spending habits, create budgets, and make better financial decisions.

STRICT RULES:
1. ONLY answer questions related to personal finance, budgeting, spending, saving, and money management
2. If asked about anything unrelated to finance, politely redirect to finance topics
3. Be concise but helpful - aim for 2-3 short paragraphs max
4. Use the provided spending data to give personalized advice
5. Always be encouraging and supportive, never judgmental
6. Suggest specific, actionable steps when giving advice
7. Use emojis sparingly to make responses friendly
8. Format currency amounts properly (e.g., $1,234.56)

When analyzing spending:
- Identify patterns and trends
- Compare to typical budget recommendations (50/30/20 rule)
- Highlight areas of potential savings
- Acknowledge positive financial behaviors

USER'S FINANCIAL CONTEXT:
{context}
"""

CHAT_PROMPT_TEMPLATE = """Based on the user's financial data above, please respond to their message:

User: {message}

Provide a helpful, personalized response about their finances. If the question is not about finance, politely redirect them."""


PREDICTION_PROMPT = """Based on the user's spending history provided below, predict their expenses for next month.

SPENDING HISTORY (last 3 months):
{spending_history}

CURRENT MONTH PROGRESS:
{current_month}

Please provide:
1. Predicted total spending for next month (as a number)
2. Category-by-category breakdown with predictions
3. Potential savings opportunities (be specific)
4. Risk assessment (low/medium/high) based on spending trends
5. 3 actionable recommendations to improve their finances

Format your response as JSON with this structure:
{{
    "predicted_total": <number>,
    "category_predictions": [
        {{
            "category": "<name>",
            "predicted": <number>,
            "trend": "up|down|stable",
            "change_pct": <number>
        }}
    ],
    "savings_potential": <number>,
    "risk_level": "low|medium|high",
    "recommendations": ["<tip1>", "<tip2>", "<tip3>"],
    "explanation": "<1-2 sentence summary>"
}}"""


INSIGHTS_PROMPT = """Analyze the user's recent spending and generate 3 personalized insights.

SPENDING DATA:
{spending_data}

BUDGET STATUS:
{budget_status}

Generate exactly 3 insights of different types:
1. One "tip" - advice to save money or improve habits
2. One "warning" OR "achievement" based on their data
3. One relevant observation about their spending pattern

Format as JSON array:
[
    {{
        "type": "tip|warning|achievement",
        "title": "<short title, max 6 words>",
        "description": "<one sentence explanation>",
        "icon": "<material icon name>"
    }}
]

Use these icons: lightbulb-on, alert-circle, trophy, trending-up, trending-down, wallet, piggy-bank, chart-line"""


def format_spending_context(expenses: list, summary: dict) -> str:
    """Format user's spending data for AI context injection."""
    context_parts = []
    
    # Add summary stats
    context_parts.append(f"Total Income (this month): ${summary.get('total_income', 0):,.2f}")
    context_parts.append(f"Total Expenses (this month): ${summary.get('total_expense', 0):,.2f}")
    context_parts.append(f"Current Balance: ${summary.get('balance', 0):,.2f}")
    
    # Add category breakdown
    if summary.get('category_breakdown'):
        context_parts.append("\nSpending by Category:")
        for cat in summary['category_breakdown']:
            context_parts.append(f"  - {cat['name']}: ${cat['amount']:,.2f} ({cat['percentage']:.1f}%)")
    
    # Add recent transactions
    if expenses:
        context_parts.append("\nRecent Transactions (last 10):")
        for exp in expenses[:10]:
            date_str = exp.get('date', 'Unknown')
            desc = exp.get('description', 'No description')
            amount = exp.get('amount', 0)
            exp_type = exp.get('type', 'expense')
            sign = '+' if exp_type == 'income' else '-'
            context_parts.append(f"  - {date_str}: {desc} ({sign}${abs(amount):,.2f})")
    
    return "\n".join(context_parts)


def format_history_for_prediction(monthly_data: list) -> str:
    """Format monthly spending history for prediction prompt."""
    history_parts = []
    
    for month_data in monthly_data:
        month_str = f"{month_data['year']}-{month_data['month']:02d}"
        history_parts.append(f"\n{month_str}:")
        history_parts.append(f"  Total Spent: ${month_data.get('total', 0):,.2f}")
        
        if month_data.get('categories'):
            for cat, amount in month_data['categories'].items():
                history_parts.append(f"  - {cat}: ${amount:,.2f}")
    
    return "\n".join(history_parts)
