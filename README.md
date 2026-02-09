# SpendX 💰

**AI-Powered Smart Finance Manager**

A modern personal finance application built with React Native (Expo) for mobile/web and FastAPI for the backend. Track expenses, set budgets, get AI-powered insights, and chat with an intelligent financial assistant.

![SpendX Banner](https://img.shields.io/badge/SpendX-AI%20Finance-6366F1?style=for-the-badge)
![React Native](https://img.shields.io/badge/React%20Native-0.76-61DAFB?style=flat-square&logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?style=flat-square&logo=expo)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?style=flat-square&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=flat-square&logo=python)

---

## ✨ Features

### 📊 **Expense Tracking**
- Add income and expense transactions with categories
- View transaction history with search and filters
- Monthly summaries with income/expense breakdown
- Category-wise spending analysis

### 💰 **Budget Management**
- Set monthly budgets with category limits
- Track spending against budget in real-time
- Visual progress indicators
- Budget alerts when nearing limits

### 🤖 **AI-Powered Features**
- **AI Chat**: Conversational financial assistant powered by Google Gemini
- **Smart Insights**: AI-generated spending analysis and tips
- **Predictions**: Expense forecasting based on spending patterns
- Automatic fallback responses when API limits are reached

### 🎨 **Modern UI/UX**
- Premium glassmorphism design
- Dark and light theme support
- Smooth animations with React Native Reanimated
- Responsive layout (works on mobile, tablet, and desktop)

### 🌍 **Multi-Currency Support**
- Switch between INR (₹) and USD ($)
- Currency preference saved locally
- Reflects across entire app instantly

### 🔐 **Secure Authentication**
- JWT-based authentication
- Secure token storage
- Auto-refresh tokens
- Protected API routes

---

## 📁 Project Structure

```
SpendX/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── api/            # API route handlers
│   │   ├── models/         # SQLAlchemy database models
│   │   ├── schemas/        # Pydantic request/response schemas
│   │   ├── services/       # Business logic & AI services
│   │   ├── middleware/     # Rate limiting & other middleware
│   │   ├── main.py         # FastAPI app entry point
│   │   └── config.py       # Environment configuration
│   ├── requirements.txt
│   └── .env               # Environment variables
│
├── mobile-app/             # React Native (Expo) Frontend
│   ├── app/               # Expo Router screens
│   │   ├── (app)/         # Authenticated screens
│   │   ├── auth/          # Login/Signup screens
│   │   └── _layout.tsx    # Root layout
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── config/        # API config & theme
│   │   ├── hooks/         # Custom React hooks
│   │   └── services/      # API service layer
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.10+
- **Git**
- **Expo Go** app on your mobile device (for mobile testing)

---

## 🖥️ Backend Setup

### 1. Navigate to backend directory
```bash
cd SpendX/backend
```

### 2. Create and activate virtual environment
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment variables
Create a `.env` file in the `backend/` directory:
```env
# Database
DATABASE_URL=sqlite+aiosqlite:///./spendx.db

# JWT Authentication
SECRET_KEY=your-super-secret-key-change-in-production-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Google Gemini AI (get from https://aistudio.google.com/apikey)
GEMINI_API_KEY=your-gemini-api-key

# CORS (use * for development)
CORS_ORIGINS=*

# Environment
ENVIRONMENT=development
DEBUG=true
```

### 5. Start the backend server

**For localhost only (laptop browser):**
```bash
uvicorn app.main:app --reload --port 8000
```

**For mobile device access (use your computer's IP):**
```bash
# First, find your IP address
# Windows: ipconfig | findstr IPv4
# macOS/Linux: ifconfig | grep inet

# Then start with host 0.0.0.0
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **Localhost:** http://localhost:8000
- **Network:** http://YOUR_IP:8000
- **API Docs:** http://localhost:8000/docs

---

## 📱 Frontend Setup (Mobile App)

### 1. Navigate to mobile app directory
```bash
cd SpendX/mobile-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure API URL

Edit `src/config/api.ts` and update the IP address to match your backend:

```typescript
// For mobile device access, use your computer's local IP
const DEV_API_URL = 'http://YOUR_COMPUTER_IP:8000';

// Example:
const DEV_API_URL = 'http://192.168.1.100:8000';
```

### 4. Start the Expo development server
```bash
npx expo start
```

---

## 📲 Running the App

### On Laptop/Desktop Browser
1. After running `npx expo start`, press `w` to open in web browser
2. The app will open at http://localhost:8081

### On Mobile Device (Expo Go)
1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Make sure your phone is on the **same WiFi network** as your computer
3. After running `npx expo start`, scan the QR code with:
   - **iOS**: Camera app
   - **Android**: Expo Go app
4. The app will load in Expo Go

### On Android Emulator
```bash
npx expo start --android
```

### On iOS Simulator (macOS only)
```bash
npx expo start --ios
```

---

## 🔧 Important Configuration Notes

### Mobile Device Connection Issues

If the app shows "Login/Signup Failed" on mobile:

1. **Check your computer's IP address:**
   ```bash
   # Windows
   ipconfig | findstr IPv4
   
   # macOS/Linux
   ifconfig | grep inet
   ```

2. **Update `mobile-app/src/config/api.ts`:**
   ```typescript
   const DEV_API_URL = 'http://YOUR_IP:8000';
   ```

3. **Start backend with network access:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Ensure CORS is configured in `backend/.env`:**
   ```env
   CORS_ORIGINS=*
   ```

5. **Restart both backend and Expo**

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React Native 0.76 | Cross-platform mobile framework |
| Expo SDK 54 | Development platform & tools |
| TypeScript | Type-safe JavaScript |
| Expo Router | File-based navigation |
| React Native Paper | Material Design components |
| React Native Reanimated | Smooth animations |
| Axios | HTTP client |
| AsyncStorage | Local data persistence |

### Backend
| Technology | Purpose |
|------------|---------|
| FastAPI | High-performance Python API framework |
| SQLAlchemy | Async ORM for database |
| SQLite | Development database |
| Pydantic | Data validation |
| JWT | Authentication tokens |
| Google Gemini | AI chat & insights |

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Create new account |
| POST | `/api/auth/login` | Login & get tokens |
| POST | `/api/auth/refresh` | Refresh access token |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | List transactions |
| POST | `/api/transactions` | Create transaction |
| GET | `/api/transactions/summary` | Monthly summary |
| GET | `/api/transactions/categories` | List categories |

### AI Features
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Chat with AI assistant |
| GET | `/api/ai/chat/{id}` | Get chat history |
| GET | `/api/ai/predict` | Get spending predictions |
| GET | `/api/ai/insights` | Get AI insights |

### User
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get current user profile |

---

## 🎯 Usage Guide

### Adding a Transaction
1. Tap the **+** button on the Dashboard
2. Select **Expense** or **Income**
3. Enter the amount
4. Choose a category
5. Add a description
6. Tap **Save**

### Chatting with AI
1. Go to the **Chat** tab
2. Type a question like:
   - "How much did I spend this month?"
   - "Give me tips to save money"
   - "What's my spending pattern?"
3. Get AI-powered responses

### Changing Currency
1. Go to **Profile** → **Currency**
2. Select **INR (₹)** or **USD ($)**
3. Currency updates across the entire app

---

## 🐛 Troubleshooting

### "Network Error" on mobile
- Ensure phone and computer are on same WiFi
- Check that backend is running with `--host 0.0.0.0`
- Verify the IP address in `api.ts` is correct

### "Gemini API quota exceeded"
- The app automatically falls back to helpful mock responses
- Get a new API key from a different Google Cloud project
- Wait 24 hours for quota reset

### "Login Failed"
- Check backend is running
- Verify `.env` file has correct values
- Check CORS is set to `*` for development

---

## 📄 License

MIT License - feel free to use this project for learning or personal use.

---

## 👨‍💻 Author

**Prathik Reddy**

- GitHub: [@PrathikReddy560](https://github.com/PrathikReddy560)

---

<p align="center">
  Made with ❤️ for smarter financial management
</p>