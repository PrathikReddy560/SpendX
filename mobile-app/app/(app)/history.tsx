// Premium History Screen
// Transaction history with monthly filtering and charts

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable, FlatList } from 'react-native';
import { Text, useTheme, Searchbar, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import ResponsiveContainer, { useResponsive } from '../../src/components/layout/ResponsiveContainer';
import GradientHeader from '../../src/components/ui/GradientHeader';
import TransactionItem from '../../src/components/ui/TransactionItem';
import GlassCard from '../../src/components/ui/GlassCard';
import AnimatedChart, { getChartConfig } from '../../src/components/ui/AnimatedChart';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';

// Mock data
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const currentMonth = new Date().getMonth();

const mockTransactionsByDate = {
  'Today': [
    { id: '1', title: 'Starbucks Coffee', category: 'food', amount: 5.50, date: '10:30 AM', type: 'expense' as const },
    { id: '2', title: 'Uber Ride', category: 'transport', amount: 24.50, date: '9:15 AM', type: 'expense' as const },
  ],
  'Yesterday': [
    { id: '3', title: 'Netflix Subscription', category: 'entertainment', amount: 15.99, date: 'Jan 27', type: 'expense' as const },
    { id: '4', title: 'Grocery Store', category: 'food', amount: 85.20, date: 'Jan 27', type: 'expense' as const },
  ],
  'Jan 25, 2026': [
    { id: '5', title: 'Salary Deposit', category: 'income', amount: 4500, date: 'Jan 25', type: 'income' as const },
  ],
  'Jan 24, 2026': [
    { id: '6', title: 'Electric Bill', category: 'bills', amount: 120, date: 'Jan 24', type: 'expense' as const },
    { id: '7', title: 'Online Shopping', category: 'shopping', amount: 89.99, date: 'Jan 24', type: 'expense' as const },
  ],
};

const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{ data: [120, 45, 78, 195, 33, 210, 150] }],
};

export default function HistoryScreen() {
  const theme = useTheme();
  const { isDesktop, width } = useResponsive();
  const isDark = theme.dark;
  const colors = isDark ? Colors.dark : Colors.light;

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const chartWidth = Math.min(width - 80, 600);

  return (
    <ResponsiveContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <GradientHeader
          title="Transaction History"
          subtitle={`${months[selectedMonth]} 2026`}
          height="md"
        />

        {/* Content */}
        <View style={[styles.content, isDesktop && styles.contentDesktop]}>
          {/* Month Selector */}
          <Animated.View entering={FadeInDown.delay(100).duration(300)}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.monthSelector}
            >
              {months.map((month, index) => (
                <Pressable
                  key={month}
                  onPress={() => setSelectedMonth(index)}
                  style={[
                    styles.monthChip,
                    {
                      backgroundColor:
                        selectedMonth === index ? colors.primary : colors.surfaceVariant,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.monthText,
                      {
                        color: selectedMonth === index ? '#FFFFFF' : colors.textSecondary,
                      },
                    ]}
                  >
                    {month}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>

          {/* Weekly Chart */}
          <AnimatedChart delay={150}>
            <Text variant="titleMedium" style={[styles.chartTitle, { color: colors.text }]}>
              Weekly Spending
            </Text>
            <BarChart
              data={chartData}
              width={chartWidth}
              height={200}
              yAxisLabel="$"
              yAxisSuffix=""
              chartConfig={{
                ...getChartConfig(isDark),
                barPercentage: 0.6,
              }}
              style={styles.chart}
              showBarTops={false}
              fromZero
            />
          </AnimatedChart>

          {/* Summary Cards */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(300)}
            style={styles.summaryRow}
          >
            <GlassCard style={styles.summaryCard} padding="md">
              <View style={styles.summaryContent}>
                <MaterialCommunityIcons name="arrow-up-circle" size={24} color={colors.error} />
                <View>
                  <Text variant="labelSmall" style={{ color: colors.textSecondary }}>
                    Total Spent
                  </Text>
                  <Text variant="titleMedium" style={[styles.summaryAmount, { color: colors.text }]}>
                    $1,245.50
                  </Text>
                </View>
              </View>
            </GlassCard>
            <GlassCard style={styles.summaryCard} padding="md">
              <View style={styles.summaryContent}>
                <MaterialCommunityIcons name="arrow-down-circle" size={24} color={colors.success} />
                <View>
                  <Text variant="labelSmall" style={{ color: colors.textSecondary }}>
                    Total Income
                  </Text>
                  <Text variant="titleMedium" style={[styles.summaryAmount, { color: colors.text }]}>
                    $4,500.00
                  </Text>
                </View>
              </View>
            </GlassCard>
          </Animated.View>

          {/* Search and Filters */}
          <Animated.View entering={FadeInDown.delay(250).duration(300)}>
            <Searchbar
              placeholder="Search transactions..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[styles.searchBar, { backgroundColor: colors.surfaceVariant }]}
              inputStyle={{ color: colors.text }}
              iconColor={colors.textSecondary}
            />

            <View style={styles.filterRow}>
              {(['all', 'income', 'expense'] as const).map((type) => (
                <Chip
                  key={type}
                  selected={filterType === type}
                  onPress={() => setFilterType(type)}
                  style={[
                    styles.filterChip,
                    { backgroundColor: filterType === type ? colors.primary : colors.surfaceVariant },
                  ]}
                  textStyle={{
                    color: filterType === type ? '#FFFFFF' : colors.textSecondary,
                    textTransform: 'capitalize',
                  }}
                >
                  {type}
                </Chip>
              ))}
            </View>
          </Animated.View>

          {/* Transactions by Date */}
          <Animated.View entering={FadeInDown.delay(300).duration(300)}>
            {Object.entries(mockTransactionsByDate).map(([date, transactions], groupIndex) => (
              <View key={date} style={styles.dateGroup}>
                <Text
                  variant="labelMedium"
                  style={[styles.dateLabel, { color: colors.textSecondary }]}
                >
                  {date}
                </Text>
                {transactions.map((transaction, index) => (
                  <TransactionItem
                    key={transaction.id}
                    {...transaction}
                    delay={groupIndex * 50 + index * 30}
                  />
                ))}
              </View>
            ))}
          </Animated.View>

          {/* Export Button */}
          <Animated.View entering={FadeInDown.delay(400).duration(300)}>
            <Pressable
              style={[styles.exportButton, { borderColor: colors.border }]}
            >
              <MaterialCommunityIcons name="download" size={20} color={colors.primary} />
              <Text style={[styles.exportText, { color: colors.primary }]}>
                Export to PDF
              </Text>
            </Pressable>
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
    paddingHorizontal: Spacing.md, // Smaller padding on mobile
    paddingTop: Spacing.md,
    marginTop: -Spacing.lg, // Less overlap
  },
  contentDesktop: {
    maxWidth: 900,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
  monthSelector: {
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  monthChip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginRight: Spacing.xs,
  },
  monthText: {
    fontWeight: '600',
    fontSize: 13,
  },
  chartTitle: {
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  chart: {
    marginLeft: -Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm, // Smaller gap
    marginVertical: Spacing.md,
  },
  summaryCard: {
    flex: 1,
    minWidth: 0, // Allow shrinking
  },
  summaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  summaryAmount: {
    fontWeight: 'bold',
  },
  searchBar: {
    borderRadius: BorderRadius.lg,
    marginBottom: Spacing.md,
    elevation: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  filterChip: {
    borderRadius: BorderRadius.full,
  },
  dateGroup: {
    marginBottom: Spacing.lg,
  },
  dateLabel: {
    fontWeight: '600',
    marginBottom: Spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginTop: Spacing.lg,
  },
  exportText: {
    fontWeight: '600',
  },
});
