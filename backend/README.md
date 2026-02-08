# SpendX Backend

AI-powered personal finance management API built with FastAPI.

## Quick Start

### Prerequisites
- Python 3.11+
- PostgreSQL 14+ (or use SQLite for development)

### Setup

1. **Create virtual environment:**
   ```bash
   cd backend
   python -m venv venv
   
   # Windows
   .\venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Set up PostgreSQL:**
   ```bash
   # Create database
   createdb spendx
   
   # Or use this connection string for SQLite (easier for dev):
   # DATABASE_URL=sqlite+aiosqlite:///./spendx.db
   ```

5. **Run the server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

6. **Open API docs:**
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql+asyncpg://... |
| SECRET_KEY | JWT signing key (min 32 chars) | - |
| GEMINI_API_KEY | Google Gemini API key | - |
| CORS_ORIGINS | Allowed origins (comma-separated) | http://localhost:8081 |

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login and get tokens
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users/me` - Get current user profile
- `PATCH /api/users/me` - Update profile

### Transactions
- `GET /api/transactions` - List transactions (with filters)
- `POST /api/transactions` - Create transaction
- `GET /api/transactions/{id}` - Get transaction
- `PATCH /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction
- `GET /api/transactions/summary` - Monthly summary
- `GET /api/transactions/categories` - List categories

### Budgets
- `GET /api/budgets/current` - Get current month budget
- `POST /api/budgets` - Create/update budget
- `GET /api/budgets/history` - Budget history

### AI
- `POST /api/ai/chat` - Chat with AI assistant
- `GET /api/ai/chat/{id}` - Get chat history
- `GET /api/ai/predict` - Get spending prediction
- `GET /api/ai/insights` - Get AI insights

## Project Structure

```
backend/
├── app/
│   ├── main.py           # FastAPI app
│   ├── config.py         # Settings
│   ├── database.py       # DB connection
│   ├── models/           # SQLAlchemy models
│   ├── schemas/          # Pydantic schemas
│   ├── api/              # Route handlers
│   ├── services/         # Business logic
│   └── utils/            # Helpers
├── requirements.txt
└── .env.example
```
