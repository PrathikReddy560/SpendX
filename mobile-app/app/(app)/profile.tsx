// Premium Profile Screen
// User settings with premium styling

import React, { useContext, useState, useCallback } from 'react';
import { View, ScrollView, StyleSheet, Pressable, Alert, ActivityIndicator, Platform } from 'react-native';
import { Text, Avatar, Switch, useTheme, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ResponsiveContainer, { useResponsive } from '../../src/components/layout/ResponsiveContainer';
import GlassCard from '../../src/components/ui/GlassCard';
import AnimatedButton from '../../src/components/ui/AnimatedButton';
import Footer from '../../src/components/layout/Footer';
import { ThemeContext } from '../_layout';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';
import { API_BASE_URL, Endpoints } from '../../src/config/api';

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
      {rightElement}
    </Pressable>
  );
}

interface UserData {
  name: string;
  email: string;
  avatar_url: string | null;
  is_premium: boolean;
}

export default function ProfileScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { isDesktop } = useResponsive();
  const isDark = theme.dark;
  const colors = isDark ? Colors.dark : Colors.light;

  const { toggleTheme, isDark: themeIsDark } = useContext(ThemeContext);

  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData>({
    name: 'User',
    email: '',
    avatar_url: null,
    is_premium: false,
  });

  const fetchUserData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('spendx_access_token');
      if (!token) {
        router.replace('/auth/login');
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}${Endpoints.user.profile}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUserData({
        name: response.data.name || 'User',
        email: response.data.email || '',
        avatar_url: response.data.avatar_url,
        is_premium: response.data.is_premium || false,
      });
    } catch (error: any) {
      console.error('Fetch user data error:', error);
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem('spendx_access_token');
        router.replace('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [fetchUserData])
  );

  const handleAvatarPress = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      console.log('Selected image:', result.assets[0].uri);
      // TODO: Upload to backend
    }
  };

  const handleLogout = async () => {
    console.log('Logout button pressed');

    // Helper function to perform the actual logout
    const performLogout = async () => {
      console.log('Logout confirmed, clearing tokens...');
      try {
        // Clear all auth-related data
        await AsyncStorage.multiRemove([
          'spendx_access_token',
          'spendx_refresh_token',
          'spendx_user'
        ]);
        console.log('Tokens cleared, navigating to signup...');
        // Navigate to signup page
        router.replace('/auth/signup');
        console.log('Navigation called');
      } catch (error) {
        console.error('Logout error:', error);
        if (Platform.OS === 'web') {
          window.alert('Failed to logout. Please try again.');
        } else {
          Alert.alert('Error', 'Failed to logout. Please try again.');
        }
      }
    };

    // Use web-compatible confirm dialog on web, native Alert on mobile
    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Are you sure you want to logout?');
      if (confirmed) {
        await performLogout();
      }
    } else {
      Alert.alert(
        'Logout',
        'Are you sure you want to logout?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: performLogout,
          },
        ]
      );
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

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
              source={{ uri: userData.avatar_url || `https://i.pravatar.cc/300?u=${userData.email}` }}
              style={styles.avatar}
            />
            <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
              <MaterialCommunityIcons name="camera" size={16} color="#FFFFFF" />
            </View>
          </Pressable>
          <Text variant="headlineSmall" style={[styles.userName, { color: colors.text }]}>
            {userData.name}
          </Text>
          {userData.is_premium && (
            <View style={styles.membershipBadge}>
              <MaterialCommunityIcons name="crown" size={16} color={colors.accent} />
              <Text style={[styles.membershipText, { color: colors.accent }]}>
                Premium Member
              </Text>
            </View>
          )}
          <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
            {userData.email}
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
                onPress={() => router.push('/(app)/edit-profile')}
              />
              <Divider style={{ backgroundColor: colors.border }} />
              <SettingItem
                icon="lock"
                title="Security"
                subtitle="Password, 2FA, biometrics"
                onPress={() => router.push('/(app)/change-password')}
              />
              <Divider style={{ backgroundColor: colors.border }} />
              <SettingItem
                icon="bell"
                title="Notifications"
                subtitle="Push, email, reminders"
                onPress={() => router.push('/(app)/notifications')}
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
                icon="currency-inr"
                title="Currency"
                subtitle="INR (₹)"
                onPress={() => router.push('/(app)/currency')}
              />
              <Divider style={{ backgroundColor: colors.border }} />
              <SettingItem
                icon="translate"
                title="Language"
                subtitle="English"
                onPress={() => router.push('/(app)/language')}
              />
            </GlassCard>
          </Animated.View>

          {/* Support */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)}>
            <Text variant="labelLarge" style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              Support
            </Text>
            <GlassCard padding="none" style={styles.settingsCard}>
              <SettingItem
                icon="information"
                title="About SpendX"
                onPress={() => router.push('/(app)/about')}
              />
              <Divider style={{ backgroundColor: colors.border }} />
              <SettingItem
                icon="star"
                title="Rate the App"
                onPress={() => router.push('/(app)/rate-app')}
              />
            </GlassCard>
          </Animated.View>

          {/* Danger Zone */}
          <Animated.View entering={FadeInDown.delay(500).duration(400)}>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
