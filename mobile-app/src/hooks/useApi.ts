// API Integration Hook (FastAPI Ready)
// Centralized API calls with error handling, loading states, and auth

import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../config/api';

// Token key
const TOKEN_KEY = 'spendx_access_token';

interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    isLoading: boolean;
}

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body?: Record<string, unknown>;
    params?: Record<string, string | number | boolean>;
    headers?: Record<string, string>;
}

// Create and configure axios instance
const createApiClient = (): AxiosInstance => {
    const client = axios.create({
        baseURL: API_BASE_URL,
        timeout: API_TIMEOUT,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Request interceptor to add auth token
    client.interceptors.request.use(
        async (config) => {
            const token = await AsyncStorage.getItem(TOKEN_KEY);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    client.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            if (error.response?.status === 401) {
                // Token expired - could trigger refresh here
                // For now, just reject
            }
            return Promise.reject(error);
        }
    );

    return client;
};

// Singleton API client
let apiClient: AxiosInstance | null = null;

const getApiClient = (): AxiosInstance => {
    if (!apiClient) {
        apiClient = createApiClient();
    }
    return apiClient;
};

export function useApi<T = unknown>() {
    const [state, setState] = useState<ApiResponse<T>>({
        data: null,
        error: null,
        isLoading: false,
    });

    const request = useCallback(async (endpoint: string, options: RequestOptions = {}) => {
        const { method = 'GET', body, params, headers = {} } = options;
        const client = getApiClient();

        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        try {
            const response = await client.request<T>({
                url: endpoint,
                method,
                data: body,
                params,
                headers,
            });

            setState({ data: response.data, error: null, isLoading: false });
            return { data: response.data, error: null };
        } catch (error) {
            let errorMessage = 'An error occurred';

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.detail
                    || error.response?.data?.message
                    || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            setState({ data: null, error: errorMessage, isLoading: false });
            return { data: null, error: errorMessage };
        }
    }, []);

    const get = useCallback((endpoint: string, params?: Record<string, string | number | boolean>) => {
        return request(endpoint, { method: 'GET', params });
    }, [request]);

    const post = useCallback((endpoint: string, body: Record<string, unknown>) => {
        return request(endpoint, { method: 'POST', body });
    }, [request]);

    const put = useCallback((endpoint: string, body: Record<string, unknown>) => {
        return request(endpoint, { method: 'PUT', body });
    }, [request]);

    const patch = useCallback((endpoint: string, body: Record<string, unknown>) => {
        return request(endpoint, { method: 'PATCH', body });
    }, [request]);

    const del = useCallback((endpoint: string) => {
        return request(endpoint, { method: 'DELETE' });
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
    // Authentication
    auth: {
        login: '/api/auth/login',
        signup: '/api/auth/signup',
        refresh: '/api/auth/refresh',
        logout: '/api/auth/logout',
    },

    // Users
    users: {
        profile: '/api/users/me',
        updateProfile: '/api/users/me',
    },

    // Transactions
    transactions: {
        list: '/api/transactions',
        create: '/api/transactions',
        get: (id: string) => `/api/transactions/${id}`,
        update: (id: string) => `/api/transactions/${id}`,
        delete: (id: string) => `/api/transactions/${id}`,
        summary: '/api/transactions/summary',
        categories: '/api/transactions/categories',
    },

    // Budgets
    budgets: {
        current: '/api/budgets/current',
        create: '/api/budgets',
        history: '/api/budgets/history',
    },

    // AI
    ai: {
        chat: '/api/ai/chat',
        chatHistory: (id: string) => `/api/ai/chat/${id}`,
        predict: '/api/ai/predict',
        insights: '/api/ai/insights',
    },
};

// Export API client for direct use
export { getApiClient };
