/**
 * useInsights Hook
 * Fetches spending insights from the backend
 */
import { useState, useEffect, useCallback } from 'react';
import { InsightsAPI, InsightsSummary, SpendingPatterns, MonthlyInsights, Anomaly } from '../services/api';

interface UseInsightsResult {
    summary: InsightsSummary | null;
    patterns: SpendingPatterns | null;
    insights: MonthlyInsights | null;
    anomalies: Anomaly[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

export function useInsights(year?: number, month?: number): UseInsightsResult {
    const [summary, setSummary] = useState<InsightsSummary | null>(null);
    const [patterns, setPatterns] = useState<SpendingPatterns | null>(null);
    const [insights, setInsights] = useState<MonthlyInsights | null>(null);
    const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [summaryData, patternsData, insightsData, anomaliesData] = await Promise.all([
                InsightsAPI.getSummary(year, month),
                InsightsAPI.getPatterns(3),
                InsightsAPI.getMonthlyInsights(year, month),
                InsightsAPI.getAnomalies(3),
            ]);

            setSummary(summaryData);
            setPatterns(patternsData);
            setInsights(insightsData);
            setAnomalies(anomaliesData.anomalies);
        } catch (err) {
            console.error('Failed to fetch insights:', err);
            setError('Failed to load insights. Please check your connection.');
        } finally {
            setLoading(false);
        }
    }, [year, month]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        summary,
        patterns,
        insights,
        anomalies,
        loading,
        error,
        refresh: fetchData,
    };
}

export default useInsights;
