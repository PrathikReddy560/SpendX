// Change Password Screen
// Secure password change with validation

import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Pressable,
    Alert,
} from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ResponsiveContainer from '../../src/components/layout/ResponsiveContainer';
import GlassCard from '../../src/components/ui/GlassCard';
import AnimatedButton from '../../src/components/ui/AnimatedButton';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';
import { API_BASE_URL } from '../../src/config/api';

export default function ChangePasswordScreen() {
    const router = useRouter();
    const theme = useTheme();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validatePassword = (password: string): string[] => {
        const errors: string[] = [];
        if (password.length < 8) errors.push('At least 8 characters');
        if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
        if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
        if (!/[0-9]/.test(password)) errors.push('One number');
        return errors;
    };

    const getPasswordStrength = (password: string): { level: string; color: string; widthPercent: number } => {
        const errors = validatePassword(password);
        if (password.length === 0) return { level: '', color: colors.textSecondary, widthPercent: 0 };
        if (errors.length >= 3) return { level: 'Weak', color: colors.error, widthPercent: 25 };
        if (errors.length === 2) return { level: 'Fair', color: '#F59E0B', widthPercent: 50 };
        if (errors.length === 1) return { level: 'Good', color: '#3B82F6', widthPercent: 75 };
        return { level: 'Strong', color: colors.success, widthPercent: 100 };
    };

    const handleChangePassword = async () => {
        setError(null);

        if (!currentPassword) {
            setError('Please enter your current password');
            return;
        }

        const passwordErrors = validatePassword(newPassword);
        if (passwordErrors.length > 0) {
            setError('New password must have: ' + passwordErrors.join(', '));
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        if (currentPassword === newPassword) {
            setError('New password must be different from current password');
            return;
        }

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('spendx_access_token');
            if (!token) {
                router.replace('/auth/login');
                return;
            }

            await axios.post(
                `${API_BASE_URL}/api/users/me/change-password`,
                {
                    current_password: currentPassword,
                    new_password: newPassword,
                    confirm_password: confirmPassword,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Alert.alert(
                'Success',
                'Password changed successfully. Please log in with your new password.',
                [
                    {
                        text: 'OK',
                        onPress: async () => {
                            await AsyncStorage.removeItem('spendx_access_token');
                            router.replace('/auth/login');
                        }
                    }
                ]
            );
        } catch (err: any) {
            console.error('Change password error:', err);
            setError(err.response?.data?.detail || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const strength = getPasswordStrength(newPassword);

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
                    <Pressable onPress={() => router.push('/(app)/profile')} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
                    </Pressable>
                    <Text variant="titleLarge" style={styles.headerTitle}>
                        Change Password
                    </Text>
                    <View style={{ width: 40 }} />
                </LinearGradient>

                {/* Form */}
                <View style={styles.content}>
                    <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                        <GlassCard padding="lg">
                            {/* Security Icon */}
                            <View style={styles.iconContainer}>
                                <View style={[styles.iconCircle, { backgroundColor: `${colors.primary}15` }]}>
                                    <MaterialCommunityIcons name="lock" size={40} color={colors.primary} />
                                </View>
                                <Text variant="bodyMedium" style={[styles.description, { color: colors.textSecondary }]}>
                                    Create a strong password with at least 8 characters including uppercase, lowercase, and numbers.
                                </Text>
                            </View>

                            {/* Error Message */}
                            {error && (
                                <View style={[styles.errorContainer, { backgroundColor: `${colors.error}15` }]}>
                                    <MaterialCommunityIcons name="alert-circle" size={20} color={colors.error} />
                                    <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
                                </View>
                            )}

                            {/* Current Password */}
                            <Text variant="labelMedium" style={[styles.label, { color: colors.textSecondary }]}>
                                Current Password
                            </Text>
                            <View style={[styles.inputContainer, { backgroundColor: colors.surfaceVariant }]}>
                                <MaterialCommunityIcons name="lock-outline" size={20} color={colors.textSecondary} />
                                <TextInput
                                    value={currentPassword}
                                    onChangeText={setCurrentPassword}
                                    secureTextEntry={!showCurrent}
                                    placeholder="Enter current password"
                                    style={[styles.input, { color: colors.text }]}
                                    placeholderTextColor={colors.placeholder}
                                />
                                <Pressable onPress={() => setShowCurrent(!showCurrent)}>
                                    <MaterialCommunityIcons
                                        name={showCurrent ? 'eye-off' : 'eye'}
                                        size={20}
                                        color={colors.textSecondary}
                                    />
                                </Pressable>
                            </View>

                            {/* New Password */}
                            <Text variant="labelMedium" style={[styles.label, { color: colors.textSecondary }]}>
                                New Password
                            </Text>
                            <View style={[styles.inputContainer, { backgroundColor: colors.surfaceVariant }]}>
                                <MaterialCommunityIcons name="lock" size={20} color={colors.textSecondary} />
                                <TextInput
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry={!showNew}
                                    placeholder="Enter new password"
                                    style={[styles.input, { color: colors.text }]}
                                    placeholderTextColor={colors.placeholder}
                                />
                                <Pressable onPress={() => setShowNew(!showNew)}>
                                    <MaterialCommunityIcons
                                        name={showNew ? 'eye-off' : 'eye'}
                                        size={20}
                                        color={colors.textSecondary}
                                    />
                                </Pressable>
                            </View>

                            {/* Password Strength */}
                            {newPassword.length > 0 && (
                                <View style={styles.strengthContainer}>
                                    <View style={[styles.strengthBar, { backgroundColor: colors.border }]}>
                                        <Animated.View
                                            style={[
                                                styles.strengthFill,
                                                { width: `${strength.widthPercent}%` as any, backgroundColor: strength.color }
                                            ]}
                                        />
                                    </View>
                                    <Text style={[styles.strengthText, { color: strength.color }]}>
                                        {strength.level}
                                    </Text>
                                </View>
                            )}

                            {/* Confirm Password */}
                            <Text variant="labelMedium" style={[styles.label, { color: colors.textSecondary }]}>
                                Confirm New Password
                            </Text>
                            <View style={[styles.inputContainer, { backgroundColor: colors.surfaceVariant }]}>
                                <MaterialCommunityIcons name="lock-check" size={20} color={colors.textSecondary} />
                                <TextInput
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirm}
                                    placeholder="Confirm new password"
                                    style={[styles.input, { color: colors.text }]}
                                    placeholderTextColor={colors.placeholder}
                                />
                                <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                                    <MaterialCommunityIcons
                                        name={showConfirm ? 'eye-off' : 'eye'}
                                        size={20}
                                        color={colors.textSecondary}
                                    />
                                </Pressable>
                            </View>

                            {/* Match indicator */}
                            {confirmPassword.length > 0 && (
                                <View style={styles.matchContainer}>
                                    <MaterialCommunityIcons
                                        name={newPassword === confirmPassword ? 'check-circle' : 'close-circle'}
                                        size={16}
                                        color={newPassword === confirmPassword ? colors.success : colors.error}
                                    />
                                    <Text style={{ color: newPassword === confirmPassword ? colors.success : colors.error, fontSize: 12 }}>
                                        {newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                                    </Text>
                                </View>
                            )}
                        </GlassCard>
                    </Animated.View>

                    {/* Submit Button */}
                    <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.buttonContainer}>
                        <AnimatedButton
                            onPress={handleChangePassword}
                            loading={loading}
                            icon="lock-reset"
                            style={styles.submitButton}
                            title="Update Password"
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
    iconContainer: {
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    description: {
        textAlign: 'center',
        lineHeight: 20,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.sm,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.md,
        gap: Spacing.xs,
    },
    errorText: {
        flex: 1,
        fontSize: 13,
    },
    label: {
        marginBottom: Spacing.xs,
        marginTop: Spacing.md,
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        gap: Spacing.sm,
    },
    input: {
        flex: 1,
        paddingVertical: Spacing.sm,
        fontSize: 16,
        backgroundColor: 'transparent',
    },
    strengthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.xs,
        gap: Spacing.sm,
    },
    strengthBar: {
        flex: 1,
        height: 4,
        borderRadius: 2,
        overflow: 'hidden',
    },
    strengthFill: {
        height: '100%',
        borderRadius: 2,
    },
    strengthText: {
        fontSize: 12,
        fontWeight: '600',
        width: 50,
    },
    matchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        marginTop: Spacing.xs,
    },
    buttonContainer: {
        marginTop: Spacing.xl,
    },
    submitButton: {
        borderRadius: BorderRadius.lg,
    },
});
