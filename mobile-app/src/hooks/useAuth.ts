// Authentication Hook (API-connected)
// Manages auth state with real API calls

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_BASE_URL, Endpoints } from '../config/api';

interface User {
    id: string;
    email: string;
    name: string;
    avatar_url?: string;
    is_premium?: boolean;
    created_at?: string;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    accessToken: string | null;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface SignupData extends LoginCredentials {
    name: string;
}

// Token storage keys
const TOKEN_KEY = 'spendx_access_token';
const REFRESH_TOKEN_KEY = 'spendx_refresh_token';
const USER_KEY = 'spendx_user';

// Create axios instance with auth interceptor
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export function useAuth() {
    const router = useRouter();
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoading: true,
        isAuthenticated: false,
        accessToken: null,
    });

    // Set up axios interceptor for auth header
    useEffect(() => {
        const interceptor = api.interceptors.request.use(
            async (config) => {
                const token = await AsyncStorage.getItem(TOKEN_KEY);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            api.interceptors.request.eject(interceptor);
        };
    }, []);

    // Check auth state on mount
    useEffect(() => {
        checkAuthState();
    }, []);

    const checkAuthState = async () => {
        try {
            const token = await AsyncStorage.getItem(TOKEN_KEY);
            const userStr = await AsyncStorage.getItem(USER_KEY);

            if (token && userStr) {
                const user = JSON.parse(userStr);

                // Verify token is still valid by fetching profile
                try {
                    const response = await api.get(Endpoints.user.profile, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    setState({
                        user: response.data,
                        isLoading: false,
                        isAuthenticated: true,
                        accessToken: token,
                    });
                    return;
                } catch (error: any) {
                    // Token might be expired, try refresh
                    if (error.response?.status === 401) {
                        const refreshed = await tryRefreshToken();
                        if (refreshed) return;
                    }
                }
            }

            setState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
                accessToken: null,
            });
        } catch (error) {
            console.error('Auth check failed:', error);
            setState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
                accessToken: null,
            });
        }
    };

    const tryRefreshToken = async (): Promise<boolean> => {
        try {
            const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
            if (!refreshToken) return false;

            const response = await api.post(Endpoints.auth.refresh, {
                refresh_token: refreshToken,
            });

            const { access_token, refresh_token: newRefreshToken } = response.data;

            await AsyncStorage.setItem(TOKEN_KEY, access_token);
            await AsyncStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);

            // Fetch user profile with new token
            const userResponse = await api.get(Endpoints.user.profile, {
                headers: { Authorization: `Bearer ${access_token}` },
            });

            await AsyncStorage.setItem(USER_KEY, JSON.stringify(userResponse.data));

            setState({
                user: userResponse.data,
                isLoading: false,
                isAuthenticated: true,
                accessToken: access_token,
            });

            return true;
        } catch (error) {
            // Refresh failed, clear tokens
            await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
            return false;
        }
    };

    const login = useCallback(async (credentials: LoginCredentials) => {
        setState((prev) => ({ ...prev, isLoading: true }));

        try {
            const response = await api.post(Endpoints.auth.login, credentials);
            const { access_token, refresh_token } = response.data;

            // Store tokens
            await AsyncStorage.setItem(TOKEN_KEY, access_token);
            await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);

            // Fetch user profile
            const userResponse = await api.get(Endpoints.user.profile, {
                headers: { Authorization: `Bearer ${access_token}` },
            });

            await AsyncStorage.setItem(USER_KEY, JSON.stringify(userResponse.data));

            setState({
                user: userResponse.data,
                isLoading: false,
                isAuthenticated: true,
                accessToken: access_token,
            });

            router.replace('/(app)');
            return { success: true };
        } catch (error: any) {
            setState((prev) => ({ ...prev, isLoading: false }));
            const message = error.response?.data?.detail || 'Login failed';
            return { success: false, error: message };
        }
    }, [router]);

    const signup = useCallback(async (data: SignupData) => {
        setState((prev) => ({ ...prev, isLoading: true }));

        try {
            const response = await api.post(Endpoints.auth.signup, data);
            const { access_token, refresh_token } = response.data;

            // Store tokens
            await AsyncStorage.setItem(TOKEN_KEY, access_token);
            await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);

            // Fetch user profile
            const userResponse = await api.get(Endpoints.user.profile, {
                headers: { Authorization: `Bearer ${access_token}` },
            });

            await AsyncStorage.setItem(USER_KEY, JSON.stringify(userResponse.data));

            setState({
                user: userResponse.data,
                isLoading: false,
                isAuthenticated: true,
                accessToken: access_token,
            });

            router.replace('/(app)');
            return { success: true };
        } catch (error: any) {
            setState((prev) => ({ ...prev, isLoading: false }));
            const message = error.response?.data?.detail || 'Signup failed';
            return { success: false, error: message };
        }
    }, [router]);

    const logout = useCallback(async () => {
        try {
            // Call logout endpoint (optional, JWT is stateless)
            await api.post(Endpoints.auth.logout).catch(() => { });

            // Clear stored data
            await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);

            setState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
                accessToken: null,
            });

            router.replace('/auth/signup');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }, [router]);

    const updateProfile = useCallback(async (updates: Partial<User>) => {
        if (!state.user) return { success: false };

        try {
            const response = await api.patch(Endpoints.user.updateProfile, updates);
            const updatedUser = response.data;

            await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

            setState((prev) => ({
                ...prev,
                user: updatedUser,
            }));

            return { success: true };
        } catch (error: any) {
            const message = error.response?.data?.detail || 'Update failed';
            return { success: false, error: message };
        }
    }, [state.user]);

    return {
        ...state,
        login,
        signup,
        logout,
        updateProfile,
        checkAuthState,
        api, // Export configured axios instance
    };
}

// Export the configured API instance for use in other hooks
export { api };
