// API Configuration for SpendX
// FastAPI backend endpoint configurations and types

// Base URL configuration
// Use localhost for browser/laptop, use IP for mobile device
const DEV_API_URL = 'http://localhost:8000';
const PROD_API_URL = 'https://api.spendx.io'; // Replace with actual production URL

// @ts-ignore - __DEV__ is available in React Native
export const API_BASE_URL = typeof __DEV__ !== 'undefined' && __DEV__ ? DEV_API_URL : PROD_API_URL;
export const API_TIMEOUT = 30000;

// API Endpoints
export const Endpoints = {
    // Auth endpoints
    auth: {
        login: '/api/auth/login',
        signup: '/api/auth/signup',
        logout: '/api/auth/logout',
        refresh: '/api/auth/refresh',
    },

    // User endpoints
    user: {
        profile: '/api/users/me',
        updateProfile: '/api/users/me',
    },

    // Transaction endpoints
    transactions: {
        list: '/api/transactions',
        create: '/api/transactions',
        get: (id: string) => `/api/transactions/${id}`,
        update: (id: string) => `/api/transactions/${id}`,
        delete: (id: string) => `/api/transactions/${id}`,
        categories: '/api/transactions/categories',
        summary: '/api/transactions/summary',
    },

    // Budget endpoints
    budget: {
        current: '/api/budgets/current',
        create: '/api/budgets',
        history: '/api/budgets/history',
    },

    // AI endpoints
    ai: {
        chat: '/api/ai/chat',
        chatHistory: (id: string) => `/api/ai/chat/${id}`,
        predict: '/api/ai/predict',
        insights: '/api/ai/insights',
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

// Categories configuration (IDs match backend database)
export const Categories = [
    { id: 1, label: 'Food & Dining', icon: 'food', color: '#EF4444' },
    { id: 2, label: 'Transport', icon: 'car', color: '#3B82F6' },
    { id: 3, label: 'Shopping', icon: 'shopping', color: '#8B5CF6' },
    { id: 4, label: 'Entertainment', icon: 'movie', color: '#EC4899' },
    { id: 5, label: 'Bills & Utilities', icon: 'file-document', color: '#F59E0B' },
    { id: 6, label: 'Health', icon: 'hospital', color: '#22C55E' },
    { id: 7, label: 'Education', icon: 'school', color: '#06B6D4' },
    { id: 8, label: 'Income', icon: 'cash-plus', color: '#10B981' },
    { id: 9, label: 'Other', icon: 'dots-horizontal', color: '#6B7280' },
];

// Pagination defaults
export const PAGINATION = {
    defaultLimit: 20,
    maxLimit: 100,
};
