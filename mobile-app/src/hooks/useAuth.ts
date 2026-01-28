// Authentication Hook (API-ready)
// Manages auth state and provides login/logout functions

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
// import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
    isPremium?: boolean;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
}

interface LoginCredentials {
    email: string;
    password: string;
}

interface SignupData extends LoginCredentials {
    name: string;
}

// Mock API base URL - replace with FastAPI backend URL
const API_BASE_URL = 'http://localhost:8000/api/v1';

export function useAuth() {
    const router = useRouter();
    const [state, setState] = useState<AuthState>({
        user: null,
        isLoading: true,
        isAuthenticated: false,
    });

    // Check auth state on mount
    useEffect(() => {
        checkAuthState();
    }, []);

    const checkAuthState = async () => {
        try {
            // In production, check token in AsyncStorage
            // const token = await AsyncStorage.getItem('auth_token');
            // if (token) {
            //   const user = await fetchUser(token);
            //   setState({ user, isLoading: false, isAuthenticated: true });
            // } else {
            //   setState({ user: null, isLoading: false, isAuthenticated: false });
            // }

            // Mock: simulate checking auth
            setState((prev) => ({ ...prev, isLoading: false }));
        } catch (error) {
            console.error('Auth check failed:', error);
            setState({ user: null, isLoading: false, isAuthenticated: false });
        }
    };

    const login = useCallback(async (credentials: LoginCredentials) => {
        setState((prev) => ({ ...prev, isLoading: true }));

        try {
            // In production, call FastAPI login endpoint
            // const response = await fetch(`${API_BASE_URL}/auth/login`, {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(credentials),
            // });
            // const data = await response.json();
            // await AsyncStorage.setItem('auth_token', data.token);

            // Mock: simulate login
            const mockUser: User = {
                id: '1',
                email: credentials.email,
                name: 'Prath',
                avatar: 'https://i.pravatar.cc/150?u=prath',
                isPremium: true,
            };

            setState({
                user: mockUser,
                isLoading: false,
                isAuthenticated: true,
            });

            router.replace('/(app)');
            return { success: true };
        } catch (error) {
            setState((prev) => ({ ...prev, isLoading: false }));
            return { success: false, error: 'Login failed' };
        }
    }, [router]);

    const signup = useCallback(async (data: SignupData) => {
        setState((prev) => ({ ...prev, isLoading: true }));

        try {
            // In production, call FastAPI signup endpoint
            // const response = await fetch(`${API_BASE_URL}/auth/register`, {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(data),
            // });

            // Mock: simulate signup
            const mockUser: User = {
                id: '1',
                email: data.email,
                name: data.name,
            };

            setState({
                user: mockUser,
                isLoading: false,
                isAuthenticated: true,
            });

            router.replace('/(app)');
            return { success: true };
        } catch (error) {
            setState((prev) => ({ ...prev, isLoading: false }));
            return { success: false, error: 'Signup failed' };
        }
    }, [router]);

    const logout = useCallback(async () => {
        try {
            // await AsyncStorage.removeItem('auth_token');
            setState({
                user: null,
                isLoading: false,
                isAuthenticated: false,
            });
            router.replace('/auth/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }, [router]);

    const updateProfile = useCallback(async (updates: Partial<User>) => {
        if (!state.user) return { success: false };

        try {
            // In production, call FastAPI update endpoint
            setState((prev) => ({
                ...prev,
                user: prev.user ? { ...prev.user, ...updates } : null,
            }));
            return { success: true };
        } catch (error) {
            return { success: false, error: 'Update failed' };
        }
    }, [state.user]);

    return {
        ...state,
        login,
        signup,
        logout,
        updateProfile,
        checkAuthState,
    };
}
