// Premium About Screen
// About page with UPI integration concept

import React from 'react';
import { View, ScrollView, StyleSheet, Linking, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import ResponsiveContainer, { useResponsive } from '../../src/components/layout/ResponsiveContainer';
import GlassCard from '../../src/components/ui/GlassCard';
import Footer from '../../src/components/layout/Footer';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';

const features = [
  {
    icon: 'robot',
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms analyze your spending patterns and provide personalized insights.',
    gradient: ['#6366F1', '#4F46E5'],
  },
  {
    icon: 'chart-arc',
    title: 'Smart Budgeting',
    description: 'Automatically categorize transactions and track budget progress with beautiful visualizations.',
    gradient: ['#10B981', '#059669'],
  },
  {
    icon: 'shield-check',
    title: 'Bank-Grade Security',
    description: 'Your financial data is encrypted with AES-256 and stored securely with SOC 2 compliance.',
    gradient: ['#F59E0B', '#D97706'],
  },
  {
    icon: 'cellphone-link',
    title: 'UPI Auto-Detection',
    description: 'Seamlessly detect and categorize UPI transactions from SMS (Android) for effortless tracking.',
    gradient: ['#EC4899', '#DB2777'],
  },
];

const upiApps = [
  { name: 'Google Pay', icon: 'google', color: '#4285F4' },
  { name: 'PhonePe', icon: 'cellphone', color: '#5F259F' },
  { name: 'Paytm', icon: 'wallet', color: '#00BAF2' },
  { name: 'BHIM', icon: 'bank', color: '#00A0E3' },
];

const team = [
  { name: 'Prath', role: 'Founder & Developer', avatar: '👨‍💻' },
];

export default function AboutScreen() {
  const theme = useTheme();
  const { isDesktop } = useResponsive();
  const isDark = theme.dark;
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <ResponsiveContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          style={styles.hero}
        >
          <View style={[styles.logoContainer, { backgroundColor: `${colors.primary}15` }]}>
            <MaterialCommunityIcons name="wallet" size={48} color={colors.primary} />
          </View>
          <Text variant="displaySmall" style={[styles.appName, { color: colors.text }]}>
            SpendX
          </Text>
          <Text variant="titleMedium" style={[styles.tagline, { color: colors.primary }]}>
            AI-Powered Smart Finance
          </Text>
          <Text variant="bodyMedium" style={[styles.description, { color: colors.textSecondary }]}>
            Take control of your finances with intelligent insights, automated tracking, and personalized budgeting powered by AI.
          </Text>
        </Animated.View>

        {/* Content */}
        <View style={[styles.content, isDesktop && styles.contentDesktop]}>
          {/* Features */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: colors.text }]}>
              Key Features
            </Text>
            <View style={[styles.featuresGrid, isDesktop && styles.featuresGridDesktop]}>
              {features.map((feature, index) => (
                <GlassCard
                  key={feature.title}
                  style={styles.featureCard}
                  delay={index * 50}
                  padding="lg"
                >
                  <LinearGradient
                    colors={feature.gradient as [string, string]}
                    style={styles.featureIcon}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <MaterialCommunityIcons
                      name={feature.icon as any}
                      size={24}
                      color="#FFFFFF"
                    />
                  </LinearGradient>
                  <Text variant="titleMedium" style={[styles.featureTitle, { color: colors.text }]}>
                    {feature.title}
                  </Text>
                  <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
                    {feature.description}
                  </Text>
                </GlassCard>
              ))}
            </View>
          </Animated.View>

          {/* UPI Integration Section */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            <GlassCard
              style={[styles.upiCard, { borderColor: colors.primary }]}
              variant="outlined"
              padding="lg"
            >
              <View style={styles.upiHeader}>
                <MaterialCommunityIcons name="cellphone-nfc" size={32} color={colors.primary} />
                <View style={styles.upiBadge}>
                  <Text style={styles.upiBadgeText}>Coming Soon</Text>
                </View>
              </View>
              <Text variant="titleLarge" style={[styles.upiTitle, { color: colors.text }]}>
                UPI Auto-Transaction Integration
              </Text>
              <Text variant="bodyMedium" style={[styles.upiDescription, { color: colors.textSecondary }]}>
                Soon SpendX will automatically detect and categorize your UPI payments from popular apps, making expense tracking completely effortless.
              </Text>
              <View style={styles.upiAppsRow}>
                {upiApps.map((app) => (
                  <View key={app.name} style={styles.upiAppItem}>
                    <View style={[styles.upiAppIcon, { backgroundColor: `${app.color}15` }]}>
                      <MaterialCommunityIcons name={app.icon as any} size={20} color={app.color} />
                    </View>
                    <Text variant="labelSmall" style={{ color: colors.textSecondary }}>
                      {app.name}
                    </Text>
                  </View>
                ))}
              </View>
            </GlassCard>
          </Animated.View>

          {/* Tech Stack */}
          <Animated.View entering={FadeInDown.delay(500).duration(400)}>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: colors.text }]}>
              Built With
            </Text>
            <GlassCard padding="lg">
              <View style={styles.techGrid}>
                {[
                  { name: 'React Native', icon: 'react' },
                  { name: 'Expo', icon: 'cellphone' },
                  { name: 'FastAPI', icon: 'api' },
                  { name: 'Gemini AI', icon: 'brain' },
                ].map((tech) => (
                  <View key={tech.name} style={styles.techItem}>
                    <MaterialCommunityIcons name={tech.icon as any} size={24} color={colors.primary} />
                    <Text variant="labelMedium" style={{ color: colors.text }}>
                      {tech.name}
                    </Text>
                  </View>
                ))}
              </View>
            </GlassCard>
          </Animated.View>

          {/* Team */}
          <Animated.View entering={FadeInDown.delay(600).duration(400)}>
            <Text variant="titleLarge" style={[styles.sectionTitle, { color: colors.text }]}>
              Meet the Creator
            </Text>
            {team.map((member) => (
              <GlassCard key={member.name} padding="lg" style={styles.teamCard}>
                <View style={styles.teamMember}>
                  <Text style={styles.teamAvatar}>{member.avatar}</Text>
                  <View>
                    <Text variant="titleMedium" style={{ color: colors.text, fontWeight: 'bold' }}>
                      {member.name}
                    </Text>
                    <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
                      {member.role}
                    </Text>
                  </View>
                </View>
              </GlassCard>
            ))}
          </Animated.View>

          {/* Version Info */}
          <Animated.View entering={FadeInDown.delay(700).duration(400)}>
            <View style={styles.versionInfo}>
              <Text variant="titleMedium" style={{ color: colors.text }}>
                Version 2.0.0
              </Text>
              <Text variant="bodySmall" style={{ color: colors.textTertiary }}>
                Build 2026.01.28
              </Text>
            </View>
          </Animated.View>

          {/* Footer */}
          <Footer style={styles.footer} />
        </View>
      </ScrollView>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    alignItems: 'center',
    padding: Spacing.xl,
    paddingTop: Spacing['4xl'],
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  appName: {
    fontWeight: 'bold',
  },
  tagline: {
    fontWeight: '600',
    marginTop: Spacing.xs,
  },
  description: {
    textAlign: 'center',
    marginTop: Spacing.md,
    maxWidth: 400,
    lineHeight: 22,
  },
  content: {
    paddingHorizontal: Spacing.md, // Smaller padding on mobile
  },
  contentDesktop: {
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: Spacing.lg,
    marginTop: Spacing.xl,
  },
  featuresGrid: {
    gap: Spacing.sm, // Smaller gap on mobile
  },
  featuresGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  featureCard: {
    flex: 1,
    minWidth: 0, // Allow full width on mobile
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  featureTitle: {
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  upiCard: {
    marginTop: Spacing.xl,
  },
  upiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  upiBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.full,
  },
  upiBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  upiTitle: {
    fontWeight: 'bold',
    marginBottom: Spacing.sm,
  },
  upiDescription: {
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  upiAppsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  upiAppItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  upiAppIcon: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: Spacing.lg,
  },
  techItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  teamCard: {
    marginBottom: Spacing.md,
  },
  teamMember: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  teamAvatar: {
    fontSize: 40,
  },
  versionInfo: {
    alignItems: 'center',
    marginTop: Spacing['2xl'],
  },
  footer: {
    marginTop: Spacing.xl,
  },
});
