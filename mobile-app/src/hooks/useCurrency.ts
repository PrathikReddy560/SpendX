// Currency Hook
// Provides currency symbol across the app

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CURRENCY_KEY = 'spendx_currency';

interface CurrencyInfo {
    code: string;
    symbol: string;
    name: string;
}

const CURRENCIES: Record<string, CurrencyInfo> = {
    INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
};

export function useCurrency() {
    const [currencyCode, setCurrencyCode] = useState<string>('INR');
    const [loading, setLoading] = useState(true);

    const loadCurrency = useCallback(async () => {
        try {
            const saved = await AsyncStorage.getItem(CURRENCY_KEY);
            if (saved && CURRENCIES[saved]) {
                setCurrencyCode(saved);
            }
        } catch (error) {
            console.error('Error loading currency:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCurrency();
    }, [loadCurrency]);

    const currency = CURRENCIES[currencyCode] || CURRENCIES.INR;

    const formatAmount = useCallback((amount: number): string => {
        return `${currency.symbol}${amount.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    }, [currency.symbol]);

    return {
        currencyCode,
        symbol: currency.symbol,
        name: currency.name,
        formatAmount,
        loading,
        refresh: loadCurrency,
    };
}

export default useCurrency;
