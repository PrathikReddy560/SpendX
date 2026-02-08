// Premium History Screen
// Transaction history with real data from backend

import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { Text, useTheme, Searchbar, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ResponsiveContainer, { useResponsive } from '../../src/components/layout/ResponsiveContainer';
import GradientHeader from '../../src/components/ui/GradientHeader';
import TransactionItem from '../../src/components/ui/TransactionItem';
import GlassCard from '../../src/components/ui/GlassCard';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';
import { API_BASE_URL, Endpoints } from '../../src/config/api';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const currentMonth = new Date().getMonth();

// Category icon mapping
const categoryIcons: Record<string, string> = {
  'Food & Dining': 'food',
  'Transport': 'car',
  'Shopping': 'shopping',
  'Entertainment': 'movie',
  'Bills & Utilities': 'file-document',
  'Health': 'hospital',
  'Education': 'school',
  'Income': 'cash-plus',
  'Other': 'dots-horizontal',
};

interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

interface GroupedTransactions {
  [key: string]: Transaction[];
}

export default function HistoryScreen() {
  const theme = useTheme();
  const { isDesktop } = useResponsive();
  const isDark = theme.dark;
  const colors = isDark ? Colors.dark : Colors.light;

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userEmail, setUserEmail] = useState('');
  const [summary, setSummary] = useState({ totalSpent: 0, totalIncome: 0 });

  const fetchData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('spendx_access_token');
      if (!token) return;

      const headers = { Authorization: `Bearer ${token}` };
      const year = new Date().getFullYear();
      const month = selectedMonth + 1;

      const [transactionsRes, summaryRes, userRes] = await Promise.all([
        axios.get(`${API_BASE_URL}${Endpoints.transactions.list}?per_page=50`, { headers }),
        axios.get(`${API_BASE_URL}${Endpoints.transactions.summary}?year=${year}&month=${month}`, { headers }),
        axios.get(`${API_BASE_URL}${Endpoints.user.profile}`, { headers }),
      ]);

      // Map transactions
      const mappedTransactions: Transaction[] = transactionsRes.data.items.map((item: any) => ({
        id: item.id,
        title: item.description || item.category.name,
        category: categoryIcons[item.category.name] || 'dots-horizontal',
        amount: parseFloat(item.amount),
        date: item.date,
        type: item.type.toLowerCase() as 'income' | 'expense',
      }));

      setTransactions(mappedTransactions);
      setSummary({
        totalSpent: parseFloat(summaryRes.data.total_expense) || 0,
        totalIncome: parseFloat(summaryRes.data.total_income) || 0,
      });
      setUserEmail(userRes.data.email || '');
    } catch (error: any) {
      console.error('History fetch error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedMonth]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Group by date
  const groupedTransactions: GroupedTransactions = filteredTransactions.reduce((groups, t) => {
    const dateKey = formatDateKey(t.date);
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(t);
    return groups;
  }, {} as GroupedTransactions);

  function formatDateKey(dateStr: string): string {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: Spacing.md }}>Loading...</Text>
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
          title="Transaction History"
          subtitle={userEmail || `${months[selectedMonth]} ${new Date().getFullYear()}`}
          height="md"
        />

        {/* Content */}
        <View style={[styles.content, isDesktop && styles.contentDesktop]}>
          {/* User Email Display */}
          {userEmail && (
            <Animated.View entering={FadeInDown.delay(50).duration(300)}>
              <View style={[styles.emailContainer, { backgroundColor: colors.surfaceVariant }]}>
                <MaterialCommunityIcons name="account-circle" size={20} color={colors.primary} />
                <Text style={[styles.emailText, { color: colors.text }]}>{userEmail}</Text>
              </View>
            </Animated.View>
          )}

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
                    ${summary.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                    ${summary.totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
            {Object.keys(groupedTransactions).length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="history" size={48} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No transactions found
                </Text>
              </View>
            ) : (
              Object.entries(groupedTransactions).map(([date, transactions], groupIndex) => (
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
              ))
            )}
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
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  emailText: {
    fontSize: 14,
    fontWeight: '500',
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
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginVertical: Spacing.md,
  },
  summaryCard: {
    flex: 1,
    minWidth: 0,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: Spacing.md,
  },
});
