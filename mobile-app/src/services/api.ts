/**
 * SpendX API Service
 * Centralized API calls for the mobile app
 */
import { API_BASE_URL, Endpoints } from '../config/api';

// Types for API responses
export interface InsightsSummary {
    year: number;
    month: number;
    total_income: number;
    total_expenses: number;
    net_savings: number;
    savings_rate: number;
    transaction_count: number;
    category_breakdown: CategoryBreakdown[];
    top_merchants: TopMerchant[];
}

export interface CategoryBreakdown {
    category: string;
    total_amount: number;
    transaction_count: number;
    percentage: number;
    average_transaction: number;
}

export interface TopMerchant {
    merchant: string;
    total: number;
    count: number;
}

export interface SpendingPatterns {
    daily_average: number;
    weekly_average: number;
    monthly_average: number;
    peak_spending_day: string;
    peak_spending_category: string;
    trend: 'increasing' | 'decreasing' | 'stable';
    trend_percentage: number;
}

export interface Insight {
    type: string;
    priority: string;
    icon: string;
    message: string;
}

export interface MonthlyInsights {
    year: number;
    month: number;
    insights: Insight[];
    recommendations: string[];
}

export interface Anomaly {
    transaction_id: number;
    amount: number;
    category: string;
    merchant: string;
    date: string;
    reason: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface PredictionResponse {
    year: number;
    month: number;
    total_predicted: number;
    category_predictions: CategoryPrediction[];
    confidence_score: number;
    method: string;
}

export interface CategoryPrediction {
    category: string;
    predicted_amount: number;
    percentage: number;
    trend: string;
}

export interface ChatResponse {
    response: string;
    session_id: string;
    suggestions: string[];
}

export interface Transaction {
    id: number;
    amount: number;
    description: string;
    category: string;
    transaction_type: 'income' | 'expense';
    transaction_date: string;
    merchant: string;
    is_anomaly: boolean;
}

// API Error class
class APIError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

// Base fetch wrapper
async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        if (!response.ok) {
            throw new APIError(
                `API Error: ${response.statusText}`,
                response.status
            );
        }

        return response.json();
    } catch (error) {
        if (error instanceof APIError) throw error;
        throw new APIError('Network error', 0);
    }
}

// ========== INSIGHTS API ==========

export const InsightsAPI = {
    /**
     * Get monthly spending summary
     */
    getSummary: async (year?: number, month?: number): Promise<InsightsSummary> => {
        const now = new Date();
        const y = year ?? now.getFullYear();
        const m = month ?? now.getMonth() + 1;
        return apiFetch(`${Endpoints.insights.summary}?year=${y}&month=${m}`);
    },

    /**
     * Get spending patterns
     */
    getPatterns: async (months: number = 3): Promise<SpendingPatterns> => {
        return apiFetch(`${Endpoints.insights.patterns}?months=${months}`);
    },

    /**
     * Get monthly insights and recommendations
     */
    getMonthlyInsights: async (year?: number, month?: number): Promise<MonthlyInsights> => {
        const now = new Date();
        const y = year ?? now.getFullYear();
        const m = month ?? now.getMonth() + 1;
        return apiFetch(`${Endpoints.insights.monthly}?year=${y}&month=${m}`);
    },

    /**
     * Get anomalies/unusual transactions
     */
    getAnomalies: async (months: number = 3, method: 'iqr' | 'zscore' = 'iqr'): Promise<{ anomalies: Anomaly[], count: number }> => {
        return apiFetch(`${Endpoints.insights.anomalies}?months=${months}&method=${method}`);
    },

    /**
     * Get overspending alerts
     */
    getOverspendingAlerts: async (): Promise<{ alerts: any[] }> => {
        return apiFetch(Endpoints.insights.overspending);
    },
};

// ========== PREDICTIONS API ==========

export const PredictionsAPI = {
    /**
     * Get next month prediction
     */
    getNextMonth: async (year?: number, month?: number): Promise<PredictionResponse> => {
        let url = Endpoints.predictions.nextMonth;
        if (year && month) {
            url += `?year=${year}&month=${month}`;
        }
        return apiFetch(url);
    },

    /**
     * Train the prediction model
     */
    trainModel: async (months: number = 6): Promise<any> => {
        return apiFetch(`${Endpoints.predictions.train}?months=${months}`, {
            method: 'POST',
        });
    },

    /**
     * Get multi-month forecast
     */
    getForecast: async (monthsAhead: number = 3): Promise<{ forecasts: PredictionResponse[] }> => {
        return apiFetch(`${Endpoints.predictions.forecast}?months_ahead=${monthsAhead}`);
    },
};

// ========== CHAT API ==========

export const ChatAPI = {
    /**
     * Send a message to the AI chatbot
     */
    sendMessage: async (message: string, sessionId?: string): Promise<ChatResponse> => {
        return apiFetch(Endpoints.chat.send, {
            method: 'POST',
            body: JSON.stringify({
                message,
                session_id: sessionId,
            }),
        });
    },
};

// ========== TRANSACTIONS API ==========

export const TransactionsAPI = {
    /**
     * Get all transactions with optional filters
     */
    getAll: async (params: {
        page?: number;
        per_page?: number;
        category?: string;
        transaction_type?: string;
        start_date?: string;
        end_date?: string;
    } = {}): Promise<{ transactions: Transaction[], total: number }> => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.set('page', String(params.page));
        if (params.per_page) searchParams.set('per_page', String(params.per_page));
        if (params.category) searchParams.set('category', params.category);
        if (params.transaction_type) searchParams.set('transaction_type', params.transaction_type);
        if (params.start_date) searchParams.set('start_date', params.start_date);
        if (params.end_date) searchParams.set('end_date', params.end_date);

        const query = searchParams.toString();
        return apiFetch(`${Endpoints.transactions.list}${query ? '?' + query : ''}`);
    },

    /**
     * Create a new transaction
     */
    create: async (transaction: Partial<Transaction>): Promise<Transaction> => {
        return apiFetch(Endpoints.transactions.create, {
            method: 'POST',
            body: JSON.stringify(transaction),
        });
    },

    /**
     * Delete a transaction
     */
    delete: async (id: number): Promise<void> => {
        await apiFetch(Endpoints.transactions.delete(id), {
            method: 'DELETE',
        });
    },
};

// Default export
export default {
    Insights: InsightsAPI,
    Predictions: PredictionsAPI,
    Chat: ChatAPI,
    Transactions: TransactionsAPI,
};
