/**
 * usePredictions Hook
 * Fetches budget predictions from the backend
 */
import { useState, useEffect, useCallback } from 'react';
import { PredictionsAPI, PredictionResponse } from '../services/api';

interface UsePredictionsResult {
    prediction: PredictionResponse | null;
    forecasts: PredictionResponse[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

export function usePredictions(): UsePredictionsResult {
    const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
    const [forecasts, setForecasts] = useState<PredictionResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [nextMonthData, forecastData] = await Promise.all([
                PredictionsAPI.getNextMonth(),
                PredictionsAPI.getForecast(3),
            ]);

            setPrediction(nextMonthData);
            setForecasts(forecastData.forecasts);
        } catch (err) {
            console.error('Failed to fetch predictions:', err);
            setError('Failed to load predictions. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        prediction,
        forecasts,
        loading,
        error,
        refresh: fetchData,
    };
}

export default usePredictions;
