// Notifications Settings Screen
// Toggle push notification preferences

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Pressable,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { Text, Switch, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ResponsiveContainer from '../../src/components/layout/ResponsiveContainer';
import GlassCard from '../../src/components/ui/GlassCard';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';
import { API_BASE_URL, Endpoints } from '../../src/config/api';

export default function NotificationsScreen() {
    const router = useRouter();
    const theme = useTheme();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const fetchSettings = useCallback(async () => {
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

            setNotificationsEnabled(response.data.notifications_enabled ?? true);
        } catch (error: any) {
            console.error('Fetch settings error:', error);
            if (error.response?.status === 401) {
                router.replace('/auth/login');
            }
        } finally {
            setLoading(false);
        }
    }, [router]);

    useFocusEffect(
        useCallback(() => {
            fetchSettings();
        }, [fetchSettings])
    );

    const handleToggle = async (value: boolean) => {
        setNotificationsEnabled(value);
        setSaving(true);

        try {
            const token = await AsyncStorage.getItem('spendx_access_token');
            if (!token) {
                router.replace('/auth/login');
                return;
            }

            await axios.patch(
                `${API_BASE_URL}${Endpoints.user.updateProfile}`,
                { notifications_enabled: value },
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (error: any) {
            console.error('Update notifications error:', error);
            setNotificationsEnabled(!value); // Revert on error
            Alert.alert('Error', 'Failed to update notification settings');
        } finally {
            setSaving(false);
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
                {/* Header */}
                <LinearGradient
                    colors={colors.gradients.primaryDark as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
                    </Pressable>
                    <Text variant="titleLarge" style={styles.headerTitle}>
                        Notifications
                    </Text>
                    <View style={{ width: 40 }} />
                </LinearGradient>

                {/* Content */}
                <View style={styles.content}>
                    <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                        <GlassCard padding="none">
                            <View style={styles.settingItem}>
                                <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                                    <MaterialCommunityIcons name="bell" size={24} color={colors.primary} />
                                </View>
                                <View style={styles.settingContent}>
                                    <Text variant="bodyLarge" style={[styles.settingTitle, { color: colors.text }]}>
                                        Push Notifications
                                    </Text>
                                    <Text variant="bodySmall" style={{ color: colors.textSecondary }}>
                                        Receive alerts for transactions, budgets, and tips
                                    </Text>
                                </View>
                                <Switch
                                    value={notificationsEnabled}
                                    onValueChange={handleToggle}
                                    color={colors.primary}
                                    disabled={saving}
                                />
                            </View>
                        </GlassCard>
                    </Animated.View>

                    {/* Info */}
                    <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.infoContainer}>
                        <MaterialCommunityIcons name="information-outline" size={20} color={colors.textSecondary} />
                        <Text variant="bodySmall" style={[styles.infoText, { color: colors.textSecondary }]}>
                            When enabled, you'll receive notifications for spending alerts, budget reminders, and personalized savings tips.
                        </Text>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.lg,
        paddingHorizontal: Spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    content: {
        paddingHorizontal: Spacing.md,
        marginTop: Spacing.lg,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        gap: Spacing.md,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        fontWeight: '600',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.sm,
        marginTop: Spacing.lg,
        paddingHorizontal: Spacing.sm,
    },
    infoText: {
        flex: 1,
        lineHeight: 18,
    },
});
