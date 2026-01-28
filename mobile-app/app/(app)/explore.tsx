// Premium Explore/Insights Screen
// Spending breakdown with premium charts

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Text, useTheme, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ResponsiveContainer, { useResponsive } from '../../src/components/layout/ResponsiveContainer';
import GradientHeader from '../../src/components/ui/GradientHeader';
import GlassCard from '../../src/components/ui/GlassCard';
import AnimatedChart, { getChartConfig } from '../../src/components/ui/AnimatedChart';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';

const categoryData = [
  { id: 'food', name: 'Food & Dining', amount: 450, percentage: 35, icon: 'food', color: '#EF4444' },
  { id: 'transport', name: 'Transportation', amount: 280, percentage: 22, icon: 'car', color: '#3B82F6' },
  { id: 'shopping', name: 'Shopping', amount: 230, percentage: 18, icon: 'shopping', color: '#8B5CF6' },
  { id: 'bills', name: 'Bills & Utilities', amount: 190, percentage: 15, icon: 'file-document', color: '#F59E0B' },
  { id: 'entertainment', name: 'Entertainment', amount: 130, percentage: 10, icon: 'movie', color: '#EC4899' },
];

const pieChartData = categoryData.map((cat) => ({
  name: cat.name,
  population: cat.amount,
  color: cat.color,
  legendFontColor: '#7F7F7F',
  legendFontSize: 12,
}));

const comparisonData = {
  thisMonth: 1280,
  lastMonth: 1450,
  change: -11.7,
};

export default function ExploreScreen() {
  const theme = useTheme();
  const { isDesktop, width } = useResponsive();
  const isDark = theme.dark;
  const colors = isDark ? Colors.dark : Colors.light;

  const [period, setPeriod] = useState('month');

  const chartWidth = Math.min(width - 40, 400); // Smaller margin for mobile

  return (
    <ResponsiveContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <GradientHeader
          title="Spending Insights"
          subtitle="Understand where your money goes"
          height="md"
          gradientColors={colors.gradients.purple as [string, string]}
        />

        {/* Content */}
        <View style={[styles.content, isDesktop && styles.contentDesktop]}>
          {/* Period Selector */}
          <Animated.View entering={FadeInDown.delay(100).duration(300)}>
            <SegmentedButtons
              value={period}
              onValueChange={setPeriod}
              buttons={[
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'year', label: 'Year' },
              ]}
              style={styles.segmentedButtons}
            />
          </Animated.View>

          {/* Comparison Card */}
          <Animated.View entering={FadeInDown.delay(150).duration(300)}>
            <GlassCard style={styles.comparisonCard} padding="lg">
              <View style={styles.comparisonRow}>
                <View style={styles.comparisonItem}>
                  <Text variant="labelMedium" style={{ color: colors.textSecondary }}>
                    This Month
                  </Text>
                  <Text variant="headlineSmall" style={[styles.comparisonValue, { color: colors.text }]}>
                    ${comparisonData.thisMonth}
                  </Text>
                </View>
                <View style={styles.comparisonDivider} />
                <View style={styles.comparisonItem}>
                  <Text variant="labelMedium" style={{ color: colors.textSecondary }}>
                    Last Month
                  </Text>
                  <Text variant="headlineSmall" style={[styles.comparisonValue, { color: colors.textSecondary }]}>
                    ${comparisonData.lastMonth}
                  </Text>
                </View>
              </View>
              <View style={[styles.changeIndicator, { backgroundColor: `${colors.success}15` }]}>
                <MaterialCommunityIcons
                  name={comparisonData.change < 0 ? 'trending-down' : 'trending-up'}
                  size={20}
                  color={comparisonData.change < 0 ? colors.success : colors.error}
                />
                <Text style={{ color: comparisonData.change < 0 ? colors.success : colors.error, fontWeight: '600' }}>
                  {Math.abs(comparisonData.change)}% {comparisonData.change < 0 ? 'less' : 'more'} than last month
                </Text>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Pie Chart */}
          <AnimatedChart delay={200}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
              Spending Breakdown
            </Text>
            <View style={styles.chartContainer}>
              <PieChart
                data={pieChartData}
                width={chartWidth}
                height={200}
                chartConfig={getChartConfig(isDark)}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="0"
                absolute
              />
            </View>
          </AnimatedChart>

          {/* Category List */}
          <Animated.View entering={FadeInDown.delay(300).duration(300)}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
              By Category
            </Text>
            {categoryData.map((category, index) => (
              <GlassCard
                key={category.id}
                style={styles.categoryCard}
                padding="md"
                delay={index * 30}
              >
                <View style={styles.categoryRow}>
                  <View style={[styles.categoryIcon, { backgroundColor: `${category.color}15` }]}>
                    <MaterialCommunityIcons
                      name={category.icon as any}
                      size={22}
                      color={category.color}
                    />
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text variant="titleSmall" style={{ color: colors.text }}>
                      {category.name}
                    </Text>
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          { width: `${category.percentage}%`, backgroundColor: category.color },
                        ]}
                      />
                    </View>
                  </View>
                  <View style={styles.categoryAmount}>
                    <Text variant="titleSmall" style={{ color: colors.text, fontWeight: 'bold' }}>
                      ${category.amount}
                    </Text>
                    <Text variant="labelSmall" style={{ color: colors.textSecondary }}>
                      {category.percentage}%
                    </Text>
                  </View>
                </View>
              </GlassCard>
            ))}
          </Animated.View>

          {/* AI Insight Tip */}
          <Animated.View entering={FadeInDown.delay(400).duration(300)}>
            <LinearGradient
              colors={colors.gradients.primary as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.insightCard}
            >
              <View style={styles.insightIcon}>
                <MaterialCommunityIcons name="lightbulb-on" size={28} color="#FFFFFF" />
              </View>
              <View style={styles.insightContent}>
                <Text variant="titleSmall" style={styles.insightTitle}>
                  💡 AI Insight
                </Text>
                <Text variant="bodyMedium" style={styles.insightText}>
                  You spent 40% more on Food this week compared to last week. Consider meal prepping to save ~$80/month!
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>
      </ScrollView>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  content: {
    paddingHorizontal: Spacing.md, // Smaller padding on mobile
    paddingTop: Spacing.md,
    marginTop: -Spacing.lg, // Less overlap
  },
  contentDesktop: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
  segmentedButtons: {
    marginBottom: Spacing.lg,
  },
  comparisonCard: {
    marginBottom: Spacing.lg,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  comparisonItem: {
    alignItems: 'center',
  },
  comparisonValue: {
    fontWeight: 'bold',
    marginTop: Spacing.xs,
  },
  comparisonDivider: {
    width: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  chartContainer: {
    alignItems: 'center',
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
    width: 40, // Smaller on mobile
    height: 40,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInfo: {
    flex: 1,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 2,
    marginTop: Spacing.xs,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  categoryAmount: {
    alignItems: 'flex-end',
  },
  insightCard: {
    flexDirection: 'row',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.xl,
    gap: Spacing.md,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  insightText: {
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 22,
  },
});
