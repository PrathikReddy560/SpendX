// Premium Dashboard Screen
// Hero stats, quick actions, and recent transactions

import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { Text, Avatar, useTheme, FAB, Portal, Modal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import ResponsiveContainer, { useResponsive } from '../../src/components/layout/ResponsiveContainer';
import GradientHeader from '../../src/components/ui/GradientHeader';
import StatCard from '../../src/components/ui/StatCard';
import TransactionItem from '../../src/components/ui/TransactionItem';
import GlassCard from '../../src/components/ui/GlassCard';
import AnimatedButton from '../../src/components/ui/AnimatedButton';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';

// Mock data
const mockTransactions = [
  { id: '1', title: 'Starbucks Coffee', category: 'food', amount: 5.50, date: 'Today', type: 'expense' as const },
  { id: '2', title: 'Netflix Subscription', category: 'entertainment', amount: 15.99, date: 'Yesterday', type: 'expense' as const },
  { id: '3', title: 'Salary Deposit', category: 'income', amount: 4500, date: 'Jan 25', type: 'income' as const },
  { id: '4', title: 'Grocery Store', category: 'food', amount: 85.20, date: 'Jan 24', type: 'expense' as const },
  { id: '5', title: 'Uber Ride', category: 'transport', amount: 24.50, date: 'Jan 23', type: 'expense' as const },
];

const quickActions = [
  { id: 'add', icon: 'plus', label: 'Add', color: '#6366F1' },
  { id: 'transfer', icon: 'swap-horizontal', label: 'Transfer', color: '#10B981' },
  { id: 'budget', icon: 'chart-pie', label: 'Budget', color: '#F59E0B' },
  { id: 'scan', icon: 'qrcode-scan', label: 'Scan', color: '#EC4899' },
];

export default function Dashboard() {
  const theme = useTheme();
  const router = useRouter();
  const { isDesktop, isMobile } = useResponsive();
  const isDark = theme.dark;
  const colors = isDark ? Colors.dark : Colors.light;

  const [fabOpen, setFabOpen] = useState(false);

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'add':
        // Navigate to add expense
        break;
      case 'budget':
        router.push('/(app)/analysis');
        break;
      default:
        console.log('Action:', actionId);
    }
  };

  return (
    <ResponsiveContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Gradient Header with Balance */}
        <GradientHeader height="lg" rounded>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View>
                <Text variant="bodyLarge" style={styles.greeting}>
                  Good morning 👋
                </Text>
                <Text variant="headlineSmall" style={styles.userName}>
                  Prath
                </Text>
              </View>
              <Pressable onPress={() => router.push('/(app)/profile')}>
                <Avatar.Image
                  size={48}
                  source={{ uri: 'https://i.pravatar.cc/150?u=prath' }}
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
                    <Text style={styles.balanceAmount}>$12,450.00</Text>
                  </View>
                  <View style={styles.balanceChange}>
                    <MaterialCommunityIcons name="trending-up" size={20} color={colors.success} />
                    <Text style={[styles.changeText, { color: colors.success }]}>+12.5%</Text>
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
              value={4500}
              formatAsCurrency
              icon="arrow-down-circle"
              trend={{ direction: 'up', value: '+8%' }}
              iconColor={colors.success}
              delay={100}
            />
            <StatCard
              title="Expenses"
              value={1240}
              formatAsCurrency
              icon="arrow-up-circle"
              trend={{ direction: 'down', value: '-3%' }}
              iconColor={colors.error}
              delay={150}
            />
            {isDesktop && (
              <StatCard
                title="Savings"
                value={3260}
                formatAsCurrency
                icon="piggy-bank"
                trend={{ direction: 'up', value: '+15%' }}
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
              {quickActions.map((action, index) => (
                <Pressable
                  key={action.id}
                  onPress={() => handleQuickAction(action.id)}
                  style={({ pressed }) => [
                    styles.quickActionButton,
                    { opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <View
                    style={[
                      styles.quickActionIcon,
                      { backgroundColor: `${action.color}15` },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={action.icon as any}
                      size={24}
                      color={action.color}
                    />
                  </View>
                  <Text
                    variant="labelSmall"
                    style={[styles.quickActionLabel, { color: colors.textSecondary }]}
                  >
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
                <Text style={[styles.seeAllLink, { color: colors.primary }]}>
                  See All
                </Text>
              </Pressable>
            </View>

            <View style={styles.transactionsList}>
              {mockTransactions.map((transaction, index) => (
                <TransactionItem
                  key={transaction.id}
                  {...transaction}
                  delay={index * 50}
                />
              ))}
            </View>
          </Animated.View>

          {/* AI Insight Card */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            <GlassCard
              style={[styles.insightCard, { backgroundColor: `${colors.primary}10` }]}
              variant="outlined"
              onPress={() => router.push('/(app)/analysis')}
            >
              <View style={styles.insightContent}>
                <View style={styles.insightIcon}>
                  <MaterialCommunityIcons name="lightbulb-on" size={28} color={colors.accent} />
                </View>
                <View style={styles.insightText}>
                  <Text variant="titleSmall" style={[styles.insightTitle, { color: colors.text }]}>
                    AI Insight
                  </Text>
                  <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
                    You're spending 20% less on food this week. Keep it up! 🎉
                  </Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textTertiary} />
              </View>
            </GlassCard>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        color="#FFFFFF"
        onPress={() => console.log('Add expense')}
      />
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  headerContent: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.md, // Add padding inside header
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  userName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  avatar: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginBottom: Spacing.xs,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  changeText: {
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    paddingHorizontal: Spacing.md, // Consistent horizontal padding
    paddingTop: Spacing.lg,
    marginTop: -Spacing.lg, // Less negative margin
  },
  contentDesktop: {
    maxWidth: 1000,
    alignSelf: 'center',
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm, // Smaller gap on mobile
    marginBottom: Spacing.lg,
  },
  statsRowDesktop: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  seeAllLink: {
    fontWeight: '600',
    fontSize: 14,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Better spacing
    marginBottom: Spacing.lg,
    flexWrap: 'wrap', // Allow wrapping on very small screens
  },
  quickActionButton: {
    alignItems: 'center',
    gap: Spacing.xs, // Smaller gap
    minWidth: 60, // Ensure minimum width
  },
  quickActionIcon: {
    width: 48, // Smaller icons on mobile
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontWeight: '500',
  },
  transactionsList: {
    gap: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  insightCard: {
    marginBottom: Spacing.lg,
  },
  insightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightText: {
    flex: 1,
  },
  insightTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  fab: {
    position: 'absolute',
    margin: Spacing.lg,
    right: 0,
    bottom: 0,
  },
});
