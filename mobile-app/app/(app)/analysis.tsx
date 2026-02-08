// Budget Analysis Screen
// AI-powered budget predictions and recommendations

import React, { useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { Text, useTheme, ProgressBar, TextInput, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ResponsiveContainer, { useResponsive } from '../../src/components/layout/ResponsiveContainer';
import GradientHeader from '../../src/components/ui/GradientHeader';
import GlassCard from '../../src/components/ui/GlassCard';
import AnimatedButton from '../../src/components/ui/AnimatedButton';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';
import { API_BASE_URL, Endpoints } from '../../src/config/api';

interface CategoryPrediction {
    category_name: string;
    category_color: string;
    category_icon: string;
    predicted_amount: number;
    last_month_amount: number;
    change_percentage: number;
    trend: 'up' | 'down' | 'stable';
}

interface Prediction {
    next_month: string;
    predicted_total: number;
    potential_savings: number;
    risk_level: 'low' | 'medium' | 'high';
    category_predictions: CategoryPrediction[];
    recommendations: string[];
    explanation: string;
}

interface Insight {
    type: 'tip' | 'warning' | 'achievement';
    title: string;
    description: string;
    icon: string;
}

interface Summary {
    totalIncome: number;
    totalExpense: number;
    categoryBreakdown: Array<{
        category_name: string;
        category_color: string;
        amount: number;
        percentage: number;
    }>;
}

export default function AnalysisScreen() {
    const theme = useTheme();
    const { isDesktop } = useResponsive();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [prediction, setPrediction] = useState<Prediction | null>(null);
    const [insights, setInsights] = useState<Insight[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [monthlyBudget, setMonthlyBudget] = useState('');
    const [showBudgetInput, setShowBudgetInput] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const token = await AsyncStorage.getItem('spendx_access_token');
            if (!token) return;

            const headers = { Authorization: `Bearer ${token}` };
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;

            // Fetch prediction, insights, and summary in parallel
            const [predictionRes, insightsRes, summaryRes] = await Promise.all([
                axios.get(`${API_BASE_URL}${Endpoints.ai.predict}`, { headers }).catch(() => null),
                axios.get(`${API_BASE_URL}${Endpoints.ai.insights}`, { headers }).catch(() => null),
                axios.get(`${API_BASE_URL}${Endpoints.transactions.summary}?year=${year}&month=${month}`, { headers }),
            ]);

            if (predictionRes?.data) {
                setPrediction({
                    next_month: predictionRes.data.next_month,
                    predicted_total: parseFloat(predictionRes.data.predicted_total) || 0,
                    potential_savings: parseFloat(predictionRes.data.potential_savings) || 0,
                    risk_level: predictionRes.data.risk_level || 'medium',
                    category_predictions: predictionRes.data.category_predictions || [],
                    recommendations: predictionRes.data.recommendations || [],
                    explanation: predictionRes.data.explanation || '',
                });
            }

            if (insightsRes?.data?.insights) {
                setInsights(insightsRes.data.insights);
            }

            setSummary({
                totalIncome: parseFloat(summaryRes.data.total_income) || 0,
                totalExpense: parseFloat(summaryRes.data.total_expense) || 0,
                categoryBreakdown: summaryRes.data.category_breakdown || [],
            });
        } catch (error: any) {
            console.error('Analysis fetch error:', error.response?.data || error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchData();
    }, [fetchData]);

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'low': return colors.success;
            case 'high': return colors.error;
            default: return colors.warning;
        }
    };

    const getInsightColor = (type: string) => {
        switch (type) {
            case 'warning': return colors.error;
            case 'achievement': return colors.success;
            default: return colors.primary;
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up': return 'trending-up';
            case 'down': return 'trending-down';
            default: return 'minus';
        }
    };

    if (loading) {
        return (
            <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ color: colors.text, marginTop: Spacing.md }}>Analyzing your budget...</Text>
            </View>
        );
    }

    return (
        <ResponsiveContainer>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <GradientHeader
                    title="AI Budget Analysis"
                    subtitle={prediction ? `Predicting: ${prediction.next_month}` : 'Analyzing your spending...'}
                    height="md"
                    gradientColors={colors.gradients?.ocean as [string, string] || ['#6366F1', '#8B5CF6']}
                />

                <View style={[styles.content, isDesktop && styles.contentDesktop]}>
                    {/* Prediction Card */}
                    {prediction && (
                        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                            <GlassCard style={styles.predictionCard} padding="lg">
                                <View style={styles.predictionHeader}>
                                    <MaterialCommunityIcons name="brain" size={28} color={colors.primary} />
                                    <View style={styles.predictionText}>
                                        <Text variant="titleMedium" style={[styles.predictionTitle, { color: colors.text }]}>
                                            AI Prediction for {prediction.next_month}
                                        </Text>
                                        <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
                                            {prediction.explanation}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.predictionStats}>
                                    <View style={styles.predictionStat}>
                                        <Text variant="headlineSmall" style={[styles.predictionValue, { color: colors.primary }]}>
                                            ${prediction.predicted_total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </Text>
                                        <Text variant="labelSmall" style={{ color: colors.textSecondary }}>
                                            Predicted Spending
                                        </Text>
                                    </View>
                                    <View style={styles.predictionDivider} />
                                    <View style={styles.predictionStat}>
                                        <Text variant="headlineSmall" style={[styles.predictionValue, { color: colors.success }]}>
                                            ${prediction.potential_savings.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </Text>
                                        <Text variant="labelSmall" style={{ color: colors.textSecondary }}>
                                            Potential Savings
                                        </Text>
                                    </View>
                                </View>

                                <View style={[styles.riskBadge, { backgroundColor: getRiskColor(prediction.risk_level) + '20' }]}>
                                    <MaterialCommunityIcons
                                        name={prediction.risk_level === 'low' ? 'shield-check' : prediction.risk_level === 'high' ? 'alert' : 'shield-half-full'}
                                        size={16}
                                        color={getRiskColor(prediction.risk_level)}
                                    />
                                    <Text style={[styles.riskText, { color: getRiskColor(prediction.risk_level) }]}>
                                        {prediction.risk_level.charAt(0).toUpperCase() + prediction.risk_level.slice(1)} Risk Level
                                    </Text>
                                </View>
                            </GlassCard>
                        </Animated.View>
                    )}

                    {/* Category Predictions */}
                    {prediction && prediction.category_predictions.length > 0 && (
                        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
                            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
                                Category Predictions
                            </Text>
                            {prediction.category_predictions.map((cat, index) => (
                                <GlassCard key={index} style={styles.categoryCard} padding="md">
                                    <View style={styles.categoryRow}>
                                        <View style={[styles.categoryIcon, { backgroundColor: cat.category_color + '20' }]}>
                                            <MaterialCommunityIcons
                                                name={(cat.category_icon || 'dots-horizontal') as any}
                                                size={20}
                                                color={cat.category_color}
                                            />
                                        </View>
                                        <View style={styles.categoryInfo}>
                                            <Text variant="bodyMedium" style={{ color: colors.text }}>
                                                {cat.category_name}
                                            </Text>
                                            <Text variant="labelSmall" style={{ color: colors.textSecondary }}>
                                                Predicted: ${cat.predicted_amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </Text>
                                        </View>
                                        <View style={styles.categoryTrend}>
                                            <MaterialCommunityIcons
                                                name={getTrendIcon(cat.trend) as any}
                                                size={20}
                                                color={cat.trend === 'up' ? colors.error : cat.trend === 'down' ? colors.success : colors.textSecondary}
                                            />
                                            <Text
                                                style={[
                                                    styles.changeText,
                                                    { color: cat.change_percentage >= 0 ? colors.error : colors.success }
                                                ]}
                                            >
                                                {cat.change_percentage >= 0 ? '+' : ''}{cat.change_percentage.toFixed(0)}%
                                            </Text>
                                        </View>
                                    </View>
                                </GlassCard>
                            ))}
                        </Animated.View>
                    )}

                    {/* Current Month Summary */}
                    {summary && (
                        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
                            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
                                Current Month Spending
                            </Text>
                            {summary.categoryBreakdown.map((cat, index) => (
                                <View key={index} style={styles.budgetItem}>
                                    <View style={styles.budgetHeader}>
                                        <Text variant="bodyMedium" style={{ color: colors.text }}>
                                            {cat.category_name}
                                        </Text>
                                        <Text variant="bodyMedium" style={{ color: colors.text }}>
                                            ${cat.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </Text>
                                    </View>
                                    <ProgressBar
                                        progress={cat.percentage / 100}
                                        color={cat.category_color}
                                        style={[styles.progressBar, { backgroundColor: colors.surfaceVariant }]}
                                    />
                                    <Text variant="labelSmall" style={[styles.percentageText, { color: colors.textSecondary }]}>
                                        {cat.percentage.toFixed(0)}% of total expenses
                                    </Text>
                                </View>
                            ))}
                        </Animated.View>
                    )}

                    {/* AI Recommendations */}
                    {(prediction?.recommendations?.length > 0 || insights.length > 0) && (
                        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
                            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
                                💡 AI Recommendations
                            </Text>

                            {/* Insights */}
                            {insights.map((insight, index) => (
                                <GlassCard key={`insight-${index}`} style={styles.recommendationCard} padding="md">
                                    <View style={styles.recommendationRow}>
                                        <View style={[styles.recommendationIcon, { backgroundColor: getInsightColor(insight.type) + '20' }]}>
                                            <MaterialCommunityIcons
                                                name={(insight.icon || 'lightbulb-on') as any}
                                                size={20}
                                                color={getInsightColor(insight.type)}
                                            />
                                        </View>
                                        <View style={styles.recommendationContent}>
                                            <Text variant="bodyMedium" style={[styles.recommendationTitle, { color: colors.text }]}>
                                                {insight.title}
                                            </Text>
                                            <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
                                                {insight.description}
                                            </Text>
                                        </View>
                                    </View>
                                </GlassCard>
                            ))}

                            {/* Recommendations from prediction */}
                            {prediction?.recommendations?.map((rec, index) => (
                                <GlassCard key={`rec-${index}`} style={styles.recommendationCard} padding="md">
                                    <View style={styles.recommendationRow}>
                                        <View style={[styles.recommendationIcon, { backgroundColor: colors.primary + '20' }]}>
                                            <MaterialCommunityIcons name="lightbulb-on" size={20} color={colors.primary} />
                                        </View>
                                        <Text variant="bodyMedium" style={{ color: colors.text, flex: 1 }}>
                                            {rec}
                                        </Text>
                                    </View>
                                </GlassCard>
                            ))}
                        </Animated.View>
                    )}

                    {/* Set Budget Button */}
                    <Animated.View entering={FadeInDown.delay(500).duration(400)}>
                        <AnimatedButton
                            title="Refresh Analysis"
                            onPress={onRefresh}
                            icon="refresh"
                            fullWidth
                            style={{ marginTop: Spacing.xl }}
                        />
                    </Animated.View>
                </View>
            </ScrollView>
        </ResponsiveContainer>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 100,
        flexGrow: 1,
    },
    content: {
        paddingHorizontal: Spacing.md,
        paddingTop: Spacing.md,
        marginTop: -Spacing.lg,
    },
    contentDesktop: {
        maxWidth: 900,
        alignSelf: 'center',
        width: '100%',
        paddingHorizontal: Spacing.lg,
    },
    predictionCard: {
        marginBottom: Spacing.lg,
    },
    predictionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        marginBottom: Spacing.lg,
    },
    predictionText: {
        flex: 1,
    },
    predictionTitle: {
        fontWeight: 'bold',
    },
    predictionStats: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    predictionStat: {
        flex: 1,
        alignItems: 'center',
    },
    predictionDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(128, 128, 128, 0.2)',
    },
    predictionValue: {
        fontWeight: 'bold',
    },
    riskBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xs,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.full,
        alignSelf: 'center',
    },
    riskText: {
        fontSize: 12,
        fontWeight: '600',
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: Spacing.md,
        marginTop: Spacing.xl,
    },
    categoryCard: {
        marginBottom: Spacing.sm,
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    categoryIcon: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryInfo: {
        flex: 1,
    },
    categoryTrend: {
        alignItems: 'center',
    },
    changeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    budgetItem: {
        marginBottom: Spacing.xl,
        paddingBottom: Spacing.sm,
    },
    budgetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    progressBar: {
        height: 10,
        borderRadius: BorderRadius.full,
    },
    percentageText: {
        marginTop: Spacing.sm,
        marginBottom: Spacing.xs,
    },
    recommendationCard: {
        marginBottom: Spacing.sm,
    },
    recommendationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    recommendationIcon: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    recommendationContent: {
        flex: 1,
    },
    recommendationTitle: {
        fontWeight: '600',
        marginBottom: 2,
    },
});
