// Premium Dashboard Screen
// Connected to backend APIs for real data

import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { Text, Avatar, useTheme, FAB } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ResponsiveContainer, { useResponsive } from '../../src/components/layout/ResponsiveContainer';
import GradientHeader from '../../src/components/ui/GradientHeader';
import StatCard from '../../src/components/ui/StatCard';
import TransactionItem from '../../src/components/ui/TransactionItem';
import GlassCard from '../../src/components/ui/GlassCard';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';
import { API_BASE_URL, Endpoints } from '../../src/config/api';
import useCurrency from '../../src/hooks/useCurrency';

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

const quickActions = [
  { id: 'add', icon: 'plus', label: 'Add', color: '#6366F1' },
  { id: 'budget', icon: 'chart-pie', label: 'Budget', color: '#F59E0B' },
  { id: 'scan', icon: 'qrcode-scan', label: 'Scan', color: '#EC4899' },
];

interface Transaction {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export default function Dashboard() {
  const theme = useTheme();
  const router = useRouter();
  const { isDesktop } = useResponsive();
  const isDark = theme.dark;
  const colors = isDark ? Colors.dark : Colors.light;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [userName, setUserName] = useState('User');
  const { symbol: currencySymbol, refresh: refreshCurrency } = useCurrency();

  const fetchData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('spendx_access_token');
      if (!token) {
        router.replace('/auth/login');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;

      // Fetch transactions and summary in parallel
      const [transactionsRes, summaryRes, userRes] = await Promise.all([
        axios.get(`${API_BASE_URL}${Endpoints.transactions.list}?per_page=10`, { headers }),
        axios.get(`${API_BASE_URL}${Endpoints.transactions.summary}?year=${year}&month=${month}`, { headers }),
        axios.get(`${API_BASE_URL}${Endpoints.user.profile}`, { headers }),
      ]);

      // Map transactions to UI format
      const mappedTransactions: Transaction[] = transactionsRes.data.items.map((item: any) => ({
        id: item.id,
        title: item.description || item.category.name,
        category: categoryIcons[item.category.name] || 'dots-horizontal',
        amount: parseFloat(item.amount),
        date: formatDate(item.date),
        type: item.type.toLowerCase() as 'income' | 'expense',
      }));

      setTransactions(mappedTransactions);
      setSummary({
        totalIncome: parseFloat(summaryRes.data.total_income) || 0,
        totalExpense: parseFloat(summaryRes.data.total_expense) || 0,
        balance: parseFloat(summaryRes.data.balance) || 0,
      });
      setUserName(userRes.data.name || 'User');
    } catch (error: any) {
      console.error('Dashboard fetch error:', error.response?.data || error.message);
      if (error.response?.status === 401) {
        router.replace('/auth/login');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchData();
      refreshCurrency(); // Refresh currency in case it changed
    }, [fetchData, refreshCurrency])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, [fetchData]);

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'add':
        router.push('/(app)/add');
        break;
      case 'budget':
        router.push('/(app)/analysis');
        break;
      default:
        console.log('Action:', actionId);
    }
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

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
        {/* Gradient Header with Balance */}
        <GradientHeader height="lg" rounded>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <Text variant="bodyLarge" style={styles.greeting}>
                  {getGreeting()} 👋
                </Text>
                <Text variant="headlineSmall" style={styles.userName}>
                  {userName}
                </Text>
              </View>
              <Pressable onPress={() => router.push('/(app)/profile')}>
                <Avatar.Icon
                  size={48}
                  icon="account"
                  style={styles.avatar}
                />
              </Pressable>
            </View>

            {/* Balance Card */}
            <Animated.View entering={FadeInUp.delay(200).duration(400)}>
              <GlassCard style={styles.balanceCard} variant="default" padding="lg">
                <View style={styles.balanceRow}>
                  <View>
                    <Text style={styles.balanceLabel}>Total Balance</Text>
                    <Text style={styles.balanceAmount}>
                      {currencySymbol}{(summary.balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </Text>
                  </View>
                  <View style={styles.balanceChange}>
                    <MaterialCommunityIcons
                      name={summary.balance >= 0 ? 'trending-up' : 'trending-down'}
                      size={20}
                      color={summary.balance >= 0 ? colors.success : colors.error}
                    />
                  </View>
                </View>
              </GlassCard>
            </Animated.View>
          </View>
        </GradientHeader>

        {/* Main Content */}
        <View style={[styles.content, isDesktop && styles.contentDesktop]}>
          {/* Stats Row */}
          <View style={[styles.statsRow, isDesktop && styles.statsRowDesktop]}>
            <StatCard
              title="Income"
              value={summary.totalIncome}
              formatAsCurrency
              currencySymbol={currencySymbol}
              icon="arrow-down-circle"
              iconColor={colors.success}
              delay={100}
            />
            <StatCard
              title="Expenses"
              value={summary.totalExpense}
              formatAsCurrency
              currencySymbol={currencySymbol}
              icon="arrow-up-circle"
              iconColor={colors.error}
              delay={150}
            />
            {isDesktop && (
              <StatCard
                title="Savings"
                value={summary.balance}
                formatAsCurrency
                currencySymbol={currencySymbol}
                icon="piggy-bank"
                variant="gradient"
                delay={200}
              />
            )}
          </View>

          {/* Quick Actions */}
          <Animated.View entering={FadeInDown.delay(250).duration(400)}>
            <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
              Quick Actions
            </Text>
            <View style={styles.quickActionsRow}>
              {quickActions.map((action) => (
                <Pressable
                  key={action.id}
                  onPress={() => handleQuickAction(action.id)}
                  style={({ pressed }) => [
                    styles.quickActionButton,
                    { opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color + '20' }]}>
                    <MaterialCommunityIcons
                      name={action.icon as any}
                      size={24}
                      color={action.color}
                    />
                  </View>
                  <Text variant="labelSmall" style={[styles.quickActionLabel, { color: colors.text }]}>
                    {action.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>

          {/* Recent Transactions */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={[styles.sectionTitle, { color: colors.text }]}>
                Recent Transactions
              </Text>
              <Pressable onPress={() => router.push('/(app)/history')}>
                <Text variant="labelMedium" style={{ color: colors.primary }}>
                  See All
                </Text>
              </Pressable>
            </View>

            {transactions.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="wallet-outline" size={48} color={colors.textSecondary} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No transactions yet
                </Text>
                <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
                  Tap the + button to add your first transaction
                </Text>
              </View>
            ) : (
              transactions.slice(0, 5).map((transaction, index) => (
                <TransactionItem
                  key={transaction.id}
                  {...transaction}
                  currencySymbol={currencySymbol}
                  delay={index * 50}
                />
              ))
            )}
          </Animated.View>
        </View>
      </ScrollView>

      {/* FAB for adding transaction */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/(app)/add')}
        color="#FFFFFF"
      />
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
    flexGrow: 1,
  },
  headerContent: {
    padding: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  greeting: {
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  avatar: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  balanceCard: {
    marginTop: Spacing.sm,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  content: {
    padding: Spacing.lg,
  },
  contentDesktop: {
    paddingHorizontal: Spacing.xl * 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statsRowDesktop: {
    gap: Spacing.lg,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.xl,
  },
  quickActionButton: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    marginTop: Spacing.xs,
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
  emptySubtext: {
    fontSize: 14,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.lg,
  },
});
