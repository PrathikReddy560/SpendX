// Premium Profile Screen
// User settings with premium styling

import React, { useContext } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { Text, Avatar, Switch, useTheme, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ResponsiveContainer, { useResponsive } from '../../src/components/layout/ResponsiveContainer';
import GlassCard from '../../src/components/ui/GlassCard';
import AnimatedButton from '../../src/components/ui/AnimatedButton';
import Footer from '../../src/components/layout/Footer';
import { ThemeContext } from '../_layout';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';

interface SettingItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  danger?: boolean;
}

function SettingItem({ icon, title, subtitle, onPress, rightElement, danger }: SettingItemProps) {
  const theme = useTheme();
  const isDark = theme.dark;
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingItem,
        { opacity: pressed && onPress ? 0.7 : 1 },
      ]}
    >
      <View style={[styles.settingIcon, { backgroundColor: danger ? `${colors.error}15` : `${colors.primary}10` }]}>
        <MaterialCommunityIcons
          name={icon as any}
          size={22}
          color={danger ? colors.error : colors.primary}
        />
      </View>
      <View style={styles.settingContent}>
        <Text
          variant="bodyLarge"
          style={[styles.settingTitle, { color: danger ? colors.error : colors.text }]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement || (
        onPress && <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textTertiary} />
      )}
    </Pressable>
  );
}

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { isDesktop } = useResponsive();
  const isDark = theme.dark;
  const colors = isDark ? Colors.dark : Colors.light;

  const { toggleTheme, isDark: themeIsDark } = useContext(ThemeContext);

  const handleAvatarPress = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      console.log('Selected image:', result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => router.replace('/auth/login'),
        },
      ]
    );
  };

  return (
    <ResponsiveContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(400)}
          style={styles.header}
        >
          <Pressable onPress={handleAvatarPress} style={styles.avatarContainer}>
            <Avatar.Image
              size={100}
              source={{ uri: 'https://i.pravatar.cc/300?u=prath' }}
              style={styles.avatar}
            />
            <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
              <MaterialCommunityIcons name="camera" size={16} color="#FFFFFF" />
            </View>
          </Pressable>
          <Text variant="headlineSmall" style={[styles.userName, { color: colors.text }]}>
            Prath
          </Text>
          <View style={styles.membershipBadge}>
            <MaterialCommunityIcons name="crown" size={16} color={colors.accent} />
            <Text style={[styles.membershipText, { color: colors.accent }]}>
              Premium Member
            </Text>
          </View>
          <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
            prath@example.com
          </Text>
        </Animated.View>

        {/* Settings Sections */}
        <View style={[styles.content, isDesktop && styles.contentDesktop]}>
          {/* Account Settings */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)}>
            <Text variant="labelLarge" style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              Account
            </Text>
            <GlassCard padding="none" style={styles.settingsCard}>
              <SettingItem
                icon="account-edit"
                title="Edit Profile"
                subtitle="Update your personal information"
                onPress={() => { }}
              />
              <Divider style={{ backgroundColor: colors.border }} />
              <SettingItem
                icon="lock"
                title="Security"
                subtitle="Password, 2FA, biometrics"
                onPress={() => { }}
              />
              <Divider style={{ backgroundColor: colors.border }} />
              <SettingItem
                icon="bell"
                title="Notifications"
                subtitle="Push, email, reminders"
                onPress={() => { }}
              />
            </GlassCard>
          </Animated.View>

          {/* Preferences */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <Text variant="labelLarge" style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              Preferences
            </Text>
            <GlassCard padding="none" style={styles.settingsCard}>
              <SettingItem
                icon="theme-light-dark"
                title="Dark Mode"
                subtitle="Switch between light and dark"
                rightElement={
                  <Switch
                    value={themeIsDark}
                    onValueChange={toggleTheme}
                    color={colors.primary}
                  />
                }
              />
              <Divider style={{ backgroundColor: colors.border }} />
              <SettingItem
                icon="currency-usd"
                title="Currency"
                subtitle="USD ($)"
                onPress={() => { }}
              />
              <Divider style={{ backgroundColor: colors.border }} />
              <SettingItem
                icon="translate"
                title="Language"
                subtitle="English"
                onPress={() => { }}
              />
            </GlassCard>
          </Animated.View>

          {/* Data & Privacy */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            <Text variant="labelLarge" style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              Data & Privacy
            </Text>
            <GlassCard padding="none" style={styles.settingsCard}>
              <SettingItem
                icon="download"
                title="Export Data"
                subtitle="Download all your data"
                onPress={() => { }}
              />
              <Divider style={{ backgroundColor: colors.border }} />
              <SettingItem
                icon="upload"
                title="Import Data"
                subtitle="Import from other apps"
                onPress={() => { }}
              />
              <Divider style={{ backgroundColor: colors.border }} />
              <SettingItem
                icon="shield-check"
                title="Privacy Policy"
                onPress={() => { }}
              />
            </GlassCard>
          </Animated.View>

          {/* Support */}
          <Animated.View entering={FadeInDown.delay(500).duration(400)}>
            <Text variant="labelLarge" style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              Support
            </Text>
            <GlassCard padding="none" style={styles.settingsCard}>
              <SettingItem
                icon="help-circle"
                title="Help Center"
                onPress={() => { }}
              />
              <Divider style={{ backgroundColor: colors.border }} />
              <SettingItem
                icon="information"
                title="About SpendX"
                onPress={() => router.push('/(app)/about')}
              />
              <Divider style={{ backgroundColor: colors.border }} />
              <SettingItem
                icon="star"
                title="Rate the App"
                onPress={() => { }}
              />
            </GlassCard>
          </Animated.View>

          {/* Danger Zone */}
          <Animated.View entering={FadeInDown.delay(600).duration(400)}>
            <GlassCard padding="none" style={styles.settingsCard}>
              <SettingItem
                icon="logout"
                title="Logout"
                onPress={handleLogout}
                danger
              />
            </GlassCard>
          </Animated.View>

          {/* Footer */}
          <Footer compact style={styles.footer} />
        </View>
      </ScrollView>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100, // More padding for bottom
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing['2xl'], // Smaller top padding on mobile
    paddingBottom: Spacing.lg,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {},
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: Spacing.xs,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  membershipText: {
    fontWeight: '600',
    fontSize: 13,
  },
  content: {
    paddingHorizontal: Spacing.md, // Smaller padding on mobile
  },
  contentDesktop: {
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
  sectionLabel: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
    marginLeft: Spacing.xs,
  },
  settingsCard: {
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  settingIcon: {
    width: 36, // Smaller icons on mobile
    height: 36,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontWeight: '500',
  },
  footer: {
    marginTop: Spacing['2xl'],
  },
});
