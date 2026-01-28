// API Integration Hook (FastAPI Ready)
// Centralized API calls with error handling and loading states

import { useState, useCallback } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your FastAPI backend URL
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    isLoading: boolean;
}

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
}

export function useApi<T = unknown>() {
    const [state, setState] = useState<ApiResponse<T>>({
        data: null,
        error: null,
        isLoading: false,
    });

    const request = useCallback(async (endpoint: string, options: RequestOptions = {}) => {
        const { method = 'GET', body, headers = {} } = options;

        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            // Get auth token
            // const token = await AsyncStorage.getItem('auth_token');
            const token = null; // Mock

            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                    ...headers,
                },
                ...(body ? { body: JSON.stringify(body) } : {}),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `Request failed: ${response.status}`);
            }

            const data = await response.json();
            setState({ data, error: null, isLoading: false });
            return { data, error: null };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred';
            setState({ data: null, error: errorMessage, isLoading: false });
            return { data: null, error: errorMessage };
        }
    }, []);

    const get = useCallback((endpoint: string, headers?: Record<string, string>) => {
        return request(endpoint, { method: 'GET', headers });
    }, [request]);

    const post = useCallback((endpoint: string, body: Record<string, unknown>, headers?: Record<string, string>) => {
        return request(endpoint, { method: 'POST', body, headers });
    }, [request]);

    const put = useCallback((endpoint: string, body: Record<string, unknown>, headers?: Record<string, string>) => {
        return request(endpoint, { method: 'PUT', body, headers });
    }, [request]);

    const patch = useCallback((endpoint: string, body: Record<string, unknown>, headers?: Record<string, string>) => {
        return request(endpoint, { method: 'PATCH', body, headers });
    }, [request]);

    const del = useCallback((endpoint: string, headers?: Record<string, string>) => {
        return request(endpoint, { method: 'DELETE', headers });
    }, [request]);

    return {
        ...state,
        request,
        get,
        post,
        put,
        patch,
        del,
    };
}

// Pre-configured API endpoints for SpendX
export const spendxApi = {
    // Transactions
    transactions: {
        list: '/transactions',
        create: '/transactions',
        get: (id: string) => `/transactions/${id}`,
        update: (id: string) => `/transactions/${id}`,
        delete: (id: string) => `/transactions/${id}`,
        byMonth: (year: number, month: number) => `/transactions?year=${year}&month=${month}`,
    },

    // Analysis
    analysis: {
        summary: '/analysis/summary',
        predictions: '/analysis/predictions',
        categoryBreakdown: '/analysis/categories',
        trends: '/analysis/trends',
    },

    // Chat
    chat: {
        send: '/chat/message',
        history: '/chat/history',
    },

    // User
    user: {
        profile: '/users/me',
        updateProfile: '/users/me',
        preferences: '/users/preferences',
    },

    // Budget
    budget: {
        list: '/budgets',
        create: '/budgets',
        update: (id: string) => `/budgets/${id}`,
    },
};
