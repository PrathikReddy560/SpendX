// API Configuration for SpendX
// FastAPI backend endpoint configurations and types

// Base URL configuration
const DEV_API_URL = 'http://localhost:8000';
const PROD_API_URL = 'https://api.spendx.io'; // Replace with actual production URL

export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

// API Endpoints
export const Endpoints = {
    // Auth endpoints
    auth: {
        login: '/api/auth/login',
        signup: '/api/auth/signup',
        logout: '/api/auth/logout',
        refresh: '/api/auth/refresh',
        forgotPassword: '/api/auth/forgot-password',
        resetPassword: '/api/auth/reset-password',
        verifyEmail: '/api/auth/verify-email',
    },

    // User endpoints
    user: {
        profile: '/api/user/profile',
        updateProfile: '/api/user/profile',
        uploadAvatar: '/api/user/avatar',
        preferences: '/api/user/preferences',
        deleteAccount: '/api/user/delete',
    },

    // Transaction endpoints
    transactions: {
        list: '/api/transactions',
        create: '/api/transactions',
        update: (id: string) => `/api/transactions/${id}`,
        delete: (id: string) => `/api/transactions/${id}`,
        categories: '/api/transactions/categories',
        summary: '/api/transactions/summary',
        monthly: '/api/transactions/monthly',
    },

    // Budget endpoints
    budget: {
        current: '/api/budget/current',
        create: '/api/budget',
        update: '/api/budget',
        history: '/api/budget/history',
        goals: '/api/budget/goals',
    },

    // AI endpoints
    ai: {
        chat: '/api/ai/chat',
        analyze: '/api/ai/analyze',
        predict: '/api/ai/predict',
        categorize: '/api/ai/categorize',
        insights: '/api/ai/insights',
        recommendations: '/api/ai/recommendations',
    },

    // Reports endpoints
    reports: {
        generate: '/api/reports/generate',
        download: '/api/reports/download',
        scheduled: '/api/reports/scheduled',
    },

    // UPI integration
    upi: {
        link: '/api/upi/link',
        transactions: '/api/upi/transactions',
        sync: '/api/upi/sync',
    },
};

// Request types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    name: string;
}

export interface TransactionRequest {
    amount: number;
    category: string;
    description?: string;
    date: string;
    type: 'income' | 'expense';
}

export interface ChatRequest {
    message: string;
    conversationId?: string;
}

// Response types
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: UserProfile;
}

export interface UserProfile {
    id: string;
    email: string;
    name: string;
    avatarUrl?: string;
    isPremium: boolean;
    createdAt: string;
}

export interface Transaction {
    id: string;
    amount: number;
    category: string;
    categoryIcon: string;
    description: string;
    date: string;
    type: 'income' | 'expense';
    isAutoDetected: boolean;
}

export interface TransactionSummary {
    totalIncome: number;
    totalExpense: number;
    balance: number;
    categoryBreakdown: CategoryBreakdown[];
}

export interface CategoryBreakdown {
    category: string;
    amount: number;
    percentage: number;
    color: string;
}

export interface BudgetData {
    id: string;
    month: string;
    limit: number;
    spent: number;
    remaining: number;
    categories: BudgetCategory[];
}

export interface BudgetCategory {
    category: string;
    limit: number;
    spent: number;
}

export interface AIInsight {
    id: string;
    type: 'tip' | 'warning' | 'achievement';
    title: string;
    description: string;
    actionUrl?: string;
}

export interface AIPrediction {
    nextMonthEstimate: number;
    savingsPotential: number;
    riskLevel: 'low' | 'medium' | 'high';
    recommendations: string[];
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    isTyping?: boolean;
}

// API Error types
export interface APIError {
    code: string;
    message: string;
    details?: Record<string, string>;
}

// Categories configuration
export const Categories = [
    { id: 'food', label: 'Food & Dining', icon: 'food', color: '#EF4444' },
    { id: 'transport', label: 'Transport', icon: 'car', color: '#3B82F6' },
    { id: 'shopping', label: 'Shopping', icon: 'shopping', color: '#8B5CF6' },
    { id: 'entertainment', label: 'Entertainment', icon: 'movie', color: '#EC4899' },
    { id: 'bills', label: 'Bills & Utilities', icon: 'file-document', color: '#F59E0B' },
    { id: 'health', label: 'Health', icon: 'hospital', color: '#22C55E' },
    { id: 'education', label: 'Education', icon: 'school', color: '#06B6D4' },
    { id: 'income', label: 'Income', icon: 'cash-plus', color: '#10B981' },
    { id: 'other', label: 'Other', icon: 'dots-horizontal', color: '#6B7280' },
];

// Request timeout
export const API_TIMEOUT = 30000; // 30 seconds

// Pagination defaults
export const PAGINATION = {
    defaultLimit: 20,
    maxLimit: 100,
};
