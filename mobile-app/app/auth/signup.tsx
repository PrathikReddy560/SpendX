// Premium Signup Screen
// Multi-step signup with password strength and real API auth

import React, { useState } from 'react';
import { View, StyleSheet, Platform, Pressable, KeyboardAvoidingView, ScrollView } from 'react-native';
import { Text, TextInput, useTheme, Checkbox } from 'react-native-paper';
import { useRouter, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { useResponsive } from '../../src/components/layout/ResponsiveContainer';
import AnimatedButton from '../../src/components/ui/AnimatedButton';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';
import { useAuth } from '../../src/hooks/useAuth';

export default function SignupScreen() {
    const router = useRouter();
    const theme = useTheme();
    const { isDesktop } = useResponsive();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;
    const { signup, isLoading } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Password strength calculation
    const getPasswordStrength = () => {
        if (!password) return { level: 0, label: '', color: colors.textTertiary };
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const levels = [
            { level: 1, label: 'Weak', color: colors.error },
            { level: 2, label: 'Fair', color: colors.warning },
            { level: 3, label: 'Good', color: colors.accent },
            { level: 4, label: 'Strong', color: colors.success },
        ];

        return levels[Math.min(strength, 4) - 1] || { level: 0, label: '', color: colors.textTertiary };
    };

    const passwordStrength = getPasswordStrength();
    const passwordsMatch = password === confirmPassword || !confirmPassword;
    const isFormValid = name && email && password && confirmPassword && passwordsMatch && acceptTerms && password.length >= 8;

    const handleSignup = async () => {
        if (!isFormValid) return;
        setError(null);

        const result = await signup({
            email: email.trim(),
            password,
            name: name.trim()
        });

        if (!result.success) {
            setError(result.error || 'Registration failed. Please try again.');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }, isDesktop && styles.containerDesktop]}>
            <LinearGradient
                colors={colors.gradients.secondary as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.gradientBg,
                    isDesktop ? styles.gradientDesktop : styles.gradientMobile,
                ]}
            >
                {/* Decorative circles */}
                <View style={styles.decorativeCircles}>
                    <View style={[styles.circle, styles.circle1]} />
                    <View style={[styles.circle, styles.circle2]} />
                </View>

                {/* Brand Section */}
                <Animated.View
                    entering={FadeInDown.delay(100).duration(600)}
                    style={styles.brandSection}
                >
                    <View style={styles.logoContainer}>
                        <MaterialCommunityIcons name="account-plus" size={isDesktop ? 56 : 44} color="#FFFFFF" />
                    </View>
                    <Text variant={isDesktop ? "displayMedium" : "headlineLarge"} style={styles.brandName}>
                        Join SpendX
                    </Text>
                    <Text variant="titleMedium" style={styles.brandTagline}>
                        Start your financial journey
                    </Text>
                </Animated.View>
            </LinearGradient>

            {/* Form Section */}
            <KeyboardAvoidingView
                style={[styles.formSection, isDesktop && styles.formSectionDesktop]}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={[
                        styles.scrollContent,
                        isDesktop && styles.scrollContentDesktop,
                    ]}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Animated.View
                        entering={FadeInUp.delay(300).duration(500)}
                        style={[styles.formContainer, isDesktop && styles.formContainerDesktop]}
                    >
                        <Text variant="headlineMedium" style={[styles.welcomeText, { color: colors.text }]}>
                            Create Account
                        </Text>
                        <Text variant="bodyMedium" style={[styles.subtitleText, { color: colors.textSecondary }]}>
                            Fill in your details to get started
                        </Text>

                        {/* Error Message */}
                        {error && (
                            <Animated.View entering={FadeIn.duration(300)}>
                                <View style={[styles.errorContainer, { backgroundColor: `${colors.error}15` }]}>
                                    <MaterialCommunityIcons name="alert-circle" size={20} color={colors.error} />
                                    <Text style={[styles.apiErrorText, { color: colors.error }]}>{error}</Text>
                                </View>
                            </Animated.View>
                        )}

                        {/* Name Input */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                label="Full Name"
                                value={name}
                                onChangeText={setName}
                                mode="outlined"
                                left={<TextInput.Icon icon="account-outline" />}
                                style={styles.input}
                                outlineStyle={{ borderRadius: BorderRadius.lg }}
                            />
                        </View>

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                label="Email"
                                value={email}
                                onChangeText={setEmail}
                                mode="outlined"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                left={<TextInput.Icon icon="email-outline" />}
                                style={styles.input}
                                outlineStyle={{ borderRadius: BorderRadius.lg }}
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                label="Password"
                                value={password}
                                onChangeText={setPassword}
                                mode="outlined"
                                secureTextEntry={!showPassword}
                                left={<TextInput.Icon icon="lock-outline" />}
                                right={
                                    <TextInput.Icon
                                        icon={showPassword ? 'eye-off' : 'eye'}
                                        onPress={() => setShowPassword(!showPassword)}
                                    />
                                }
                                style={styles.input}
                                outlineStyle={{ borderRadius: BorderRadius.lg }}
                            />
                            {/* Password Strength Indicator */}
                            {password && (
                                <View style={styles.strengthContainer}>
                                    <View style={styles.strengthBars}>
                                        {[1, 2, 3, 4].map((level) => (
                                            <View
                                                key={level}
                                                style={[
                                                    styles.strengthBar,
                                                    {
                                                        backgroundColor:
                                                            level <= passwordStrength.level
                                                                ? passwordStrength.color
                                                                : colors.border,
                                                    },
                                                ]}
                                            />
                                        ))}
                                    </View>
                                    <Text style={[styles.strengthLabel, { color: passwordStrength.color }]}>
                                        {passwordStrength.label}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {/* Confirm Password Input */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                label="Confirm Password"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                mode="outlined"
                                secureTextEntry={!showPassword}
                                left={<TextInput.Icon icon="lock-check-outline" />}
                                error={!passwordsMatch}
                                style={styles.input}
                                outlineStyle={{ borderRadius: BorderRadius.lg }}
                            />
                            {!passwordsMatch && (
                                <Text style={[styles.errorText, { color: colors.error }]}>
                                    Passwords do not match
                                </Text>
                            )}
                        </View>

                        {/* Terms Checkbox */}
                        <Pressable
                            style={styles.termsRow}
                            onPress={() => setAcceptTerms(!acceptTerms)}
                        >
                            <Checkbox.Android
                                status={acceptTerms ? 'checked' : 'unchecked'}
                                onPress={() => setAcceptTerms(!acceptTerms)}
                            />
                            <Text style={[styles.termsText, { color: colors.textSecondary }]}>
                                I agree to the{' '}
                                <Text style={{ color: colors.primary }}>Terms of Service</Text>
                                {' '}and{' '}
                                <Text style={{ color: colors.primary }}>Privacy Policy</Text>
                            </Text>
                        </Pressable>

                        {/* Signup Button */}
                        <AnimatedButton
                            title="Create Account"
                            onPress={handleSignup}
                            loading={isLoading}
                            disabled={!isFormValid}
                            fullWidth
                            size="lg"
                            icon="account-check"
                            variant="secondary"
                            style={styles.signupButton}
                        />

                        {/* Login Link */}
                        <View style={styles.loginRow}>
                            <Text style={[styles.loginText, { color: colors.textSecondary }]}>
                                Already have an account?{' '}
                            </Text>
                            <Link href="/auth/login" asChild>
                                <Pressable>
                                    <Text style={[styles.loginLink, { color: colors.primary }]}>
                                        Sign In
                                    </Text>
                                </Pressable>
                            </Link>
                        </View>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column', // Mobile: vertical stacking
    },
    containerDesktop: {
        flexDirection: 'row', // Desktop: side by side
    },
    gradientBg: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
    },
    gradientMobile: {
        width: '100%',
        height: 200, // Compact height on mobile
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    gradientDesktop: {
        width: '45%',
        minHeight: '100%',
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    decorativeCircles: {
        ...StyleSheet.absoluteFillObject,
    },
    circle: {
        position: 'absolute',
        borderRadius: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    circle1: {
        width: 180,
        height: 180,
        top: -50,
        right: -50,
    },
    circle2: {
        width: 130,
        height: 130,
        bottom: -30,
        left: -30,
    },
    brandSection: {
        alignItems: 'center',
        zIndex: 1,
        paddingVertical: Spacing.lg,
    },
    logoContainer: {
        width: 72,
        height: 72,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    brandName: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    brandTagline: {
        color: 'rgba(255, 255, 255, 0.85)',
        marginTop: Spacing.xs,
    },
    formSection: {
        flex: 1,
        justifyContent: 'center',
    },
    formSectionDesktop: {
        width: '55%', // Take remaining space
        marginLeft: 'auto', // Push to right
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        padding: Spacing.lg,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing['2xl'],
    },
    scrollContentDesktop: {
        justifyContent: 'center',
        paddingVertical: Spacing['3xl'],
        paddingHorizontal: Spacing['2xl'],
    },
    formContainer: {
        width: '100%',
        maxWidth: 380,
        alignSelf: 'center',
    },
    formContainerDesktop: {
        maxWidth: 420,
    },
    welcomeText: {
        fontWeight: 'bold',
        marginBottom: Spacing.xs,
    },
    subtitleText: {
        marginBottom: Spacing.xl,
    },
    inputContainer: {
        marginBottom: Spacing.md,
    },
    input: {},
    strengthContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.sm,
        gap: Spacing.sm,
    },
    strengthBars: {
        flexDirection: 'row',
        gap: 4,
        flex: 1,
    },
    strengthBar: {
        flex: 1,
        height: 4,
        borderRadius: 2,
    },
    strengthLabel: {
        fontSize: 12,
        fontWeight: '600',
        minWidth: 50,
    },
    errorText: {
        fontSize: 12,
        marginTop: Spacing.xs,
        marginLeft: Spacing.xs,
    },
    termsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.xl,
        marginLeft: -Spacing.sm,
    },
    termsText: {
        flex: 1,
        fontSize: 13,
        lineHeight: 18,
    },
    signupButton: {
        marginBottom: Spacing.xl,
    },
    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loginText: {
        fontSize: 14,
    },
    loginLink: {
        fontWeight: '600',
        fontSize: 14,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.md,
        gap: Spacing.sm,
    },
    apiErrorText: {
        flex: 1,
        fontSize: 14,
    },
});

