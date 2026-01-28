// Premium Analysis Screen
// AI-powered analysis with charts and predictions

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Text, useTheme, ProgressBar, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PieChart, LineChart } from 'react-native-chart-kit';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import ResponsiveContainer, { useResponsive } from '../../src/components/layout/ResponsiveContainer';
import GradientHeader from '../../src/components/ui/GradientHeader';
import GlassCard from '../../src/components/ui/GlassCard';
import StatCard from '../../src/components/ui/StatCard';
import AnimatedChart, { getChartConfig, getPieChartColors } from '../../src/components/ui/AnimatedChart';
import AnimatedButton from '../../src/components/ui/AnimatedButton';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';

const pieData = [
    { name: 'Food', population: 450, color: '#EF4444', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Transport', population: 280, color: '#3B82F6', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Shopping', population: 320, color: '#8B5CF6', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Bills', population: 190, color: '#F59E0B', legendFontColor: '#7F7F7F', legendFontSize: 12 },
];

const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        { data: [1200, 1450, 1100, 1680, 1250, 1400], color: () => '#6366F1' },
        { data: [800, 900, 750, 820, 680, 720], color: () => '#22C55E', strokeWidth: 2 },
    ],
    legend: ['Expenses', 'Savings'],
};

const budgetCategories = [
    { name: 'Food & Dining', spent: 450, limit: 600, color: '#EF4444' },
    { name: 'Transportation', spent: 280, limit: 400, color: '#3B82F6' },
    { name: 'Shopping', spent: 320, limit: 300, color: '#8B5CF6' },
    { name: 'Entertainment', spent: 150, limit: 200, color: '#EC4899' },
];

const aiRecommendations = [
    { icon: 'lightbulb-on', text: 'Reduce food spending by 15% to meet your savings goal', type: 'tip' },
    { icon: 'alert-circle', text: 'Shopping budget exceeded by $20 this month', type: 'warning' },
    { icon: 'trophy', text: "Great job! You've saved 20% more than last month", type: 'achievement' },
];

export default function AnalysisScreen() {
    const theme = useTheme();
    const { isDesktop, width } = useResponsive();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;

    const chartWidth = Math.min(width - 40, 500); // Smaller margin for mobile

    return (
        <ResponsiveContainer>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <GradientHeader
                    title="AI Budget Analysis"
                    subtitle="You're on track this month! 🎯"
                    height="md"
                    gradientColors={colors.gradients.ocean as [string, string]}
                />

                {/* Content */}
                <View style={[styles.content, isDesktop && styles.contentDesktop]}>
                    {/* Prediction Card */}
                    <AnimatedChart delay={100}>
                        <View style={styles.predictionHeader}>
                            <MaterialCommunityIcons name="brain" size={28} color={colors.primary} />
                            <View style={styles.predictionText}>
                                <Text variant="titleMedium" style={[styles.predictionTitle, { color: colors.text }]}>
                                    AI Prediction
                                </Text>
                                <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
                                    Based on your spending patterns
                                </Text>
                            </View>
                        </View>
                        <View style={styles.predictionStats}>
                            <View style={styles.predictionStat}>
                                <Text variant="headlineSmall" style={[styles.predictionValue, { color: colors.primary }]}>
                                    $1,380
                                </Text>
                                <Text variant="labelSmall" style={{ color: colors.textSecondary }}>
                                    Predicted Spending
                                </Text>
                            </View>
                            <View style={styles.predictionDivider} />
                            <View style={styles.predictionStat}>
                                <Text variant="headlineSmall" style={[styles.predictionValue, { color: colors.success }]}>
                                    $620
                                </Text>
                                <Text variant="labelSmall" style={{ color: colors.textSecondary }}>
                                    Potential Savings
                                </Text>
                            </View>
                        </View>
                    </AnimatedChart>

                    {/* Spending Breakdown */}
                    <AnimatedChart delay={200}>
                        <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
                            Spending Breakdown
                        </Text>
                        <PieChart
                            data={pieData}
                            width={chartWidth}
                            height={200}
                            chartConfig={getChartConfig(isDark)}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="0"
                            absolute
                        />
                    </AnimatedChart>

                    {/* Trend Chart */}
                    <AnimatedChart delay={300}>
                        <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
                            6-Month Trend
                        </Text>
                        <LineChart
                            data={lineData}
                            width={chartWidth}
                            height={220}
                            chartConfig={{
                                ...getChartConfig(isDark),
                                propsForDots: { r: '4', strokeWidth: '2', stroke: colors.primary },
                            }}
                            bezier
                            style={styles.lineChart}
                        />
                    </AnimatedChart>

                    {/* Budget Progress */}
                    <Animated.View entering={FadeInDown.delay(400).duration(400)}>
                        <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
                            Budget Progress
                        </Text>
                        {budgetCategories.map((category, index) => {
                            const progress = category.spent / category.limit;
                            const isOver = progress > 1;

                            return (
                                <GlassCard key={category.name} style={styles.budgetCard} padding="md" delay={index * 50}>
                                    <View style={styles.budgetHeader}>
                                        <Text variant="titleSmall" style={{ color: colors.text }}>
                                            {category.name}
                                        </Text>
                                        <Text
                                            variant="labelMedium"
                                            style={{ color: isOver ? colors.error : colors.textSecondary }}
                                        >
                                            ${category.spent} / ${category.limit}
                                        </Text>
                                    </View>
                                    <ProgressBar
                                        progress={Math.min(progress, 1)}
                                        color={isOver ? colors.error : category.color}
                                        style={styles.progressBar}
                                    />
                                    {isOver && (
                                        <Text variant="labelSmall" style={{ color: colors.error, marginTop: 4 }}>
                                            ${category.spent - category.limit} over budget
                                        </Text>
                                    )}
                                </GlassCard>
                            );
                        })}
                    </Animated.View>

                    {/* AI Recommendations */}
                    <Animated.View entering={FadeInDown.delay(500).duration(400)}>
                        <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
                            AI Recommendations
                        </Text>
                        {aiRecommendations.map((rec, index) => (
                            <GlassCard
                                key={index}
                                style={[
                                    styles.recommendationCard,
                                    {
                                        borderLeftWidth: 3,
                                        borderLeftColor:
                                            rec.type === 'warning'
                                                ? colors.warning
                                                : rec.type === 'achievement'
                                                    ? colors.success
                                                    : colors.info,
                                    },
                                ]}
                                padding="md"
                                delay={index * 50}
                            >
                                <View style={styles.recommendationContent}>
                                    <MaterialCommunityIcons
                                        name={rec.icon as any}
                                        size={24}
                                        color={
                                            rec.type === 'warning'
                                                ? colors.warning
                                                : rec.type === 'achievement'
                                                    ? colors.success
                                                    : colors.info
                                        }
                                    />
                                    <Text
                                        variant="bodyMedium"
                                        style={[styles.recommendationText, { color: colors.text }]}
                                    >
                                        {rec.text}
                                    </Text>
                                </View>
                            </GlassCard>
                        ))}
                    </Animated.View>

                    {/* Download Report */}
                    <Animated.View entering={FadeInDown.delay(600).duration(400)}>
                        <AnimatedButton
                            title="Download Full Report"
                            icon="file-pdf-box"
                            variant="primary"
                            size="lg"
                            fullWidth
                            onPress={() => console.log('Download report')}
                            style={styles.downloadButton}
                        />
                    </Animated.View>
                </View>
            </ScrollView>
        </ResponsiveContainer>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 100,
        flexGrow: 1,
    },
    content: {
        paddingHorizontal: Spacing.md, // Smaller padding
        paddingTop: Spacing.md,
        marginTop: -Spacing.lg, // Less overlap
    },
    contentDesktop: {
        maxWidth: 900,
        alignSelf: 'center',
        width: '100%',
        paddingHorizontal: Spacing.lg,
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: Spacing.md,
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
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    predictionStat: {
        alignItems: 'center',
    },
    predictionValue: {
        fontWeight: 'bold',
    },
    predictionDivider: {
        width: 1,
        height: 40,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    lineChart: {
        marginLeft: -Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    budgetCard: {
        marginBottom: Spacing.sm,
    },
    budgetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
    },
    recommendationCard: {
        marginBottom: Spacing.sm,
    },
    recommendationContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    recommendationText: {
        flex: 1,
    },
    downloadButton: {
        marginTop: Spacing.xl,
    },
});
