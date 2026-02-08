// Premium Login Screen - API Connected
// Enhanced login with real authentication

import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Platform, Pressable, KeyboardAvoidingView, ScrollView, Alert } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import { useRouter, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ResponsiveContainer, { useResponsive } from '../../src/components/layout/ResponsiveContainer';
import AnimatedButton from '../../src/components/ui/AnimatedButton';
import GlassCard from '../../src/components/ui/GlassCard';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';
import { useAuth } from '../../src/hooks/useAuth';

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { isMobile, isDesktop } = useResponsive();
  const isDark = theme.dark;
  const colors = isDark ? Colors.dark : Colors.light;
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);

    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    const result = await login({ email: email.trim(), password });

    if (!result.success) {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert(
      'Coming Soon',
      `${provider} login will be available in a future update.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }, isDesktop && styles.containerDesktop]}>
      {/* Gradient Brand Section */}
      <LinearGradient
        colors={colors.gradients.primaryDark as [string, string]}
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
          <View style={[styles.circle, styles.circle3]} />
        </View>

        {/* Brand Section */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(600)}
          style={styles.brandSection}
        >
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="wallet" size={isDesktop ? 56 : 44} color="#FFFFFF" />
          </View>
          <Text variant={isDesktop ? "displayMedium" : "headlineLarge"} style={styles.brandName}>
            SpendX
          </Text>
          <Text variant="titleMedium" style={styles.brandTagline}>
            AI-Powered Smart Finance
          </Text>
        </Animated.View>
      </LinearGradient>

      {/* Form Section */}
      <KeyboardAvoidingView
        style={[
          styles.formSection,
          isDesktop && styles.formSectionDesktop,
        ]}
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
            <Text
              variant="headlineMedium"
              style={[styles.welcomeText, { color: colors.text }]}
            >
              Welcome Back
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.subtitleText, { color: colors.textSecondary }]}
            >
              Sign in to continue managing your finances
            </Text>

            {/* Error Message */}
            {error && (
              <Animated.View entering={FadeIn.duration(300)}>
                <View style={[styles.errorContainer, { backgroundColor: `${colors.error}15` }]}>
                  <MaterialCommunityIcons name="alert-circle" size={20} color={colors.error} />
                  <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
                </View>
              </Animated.View>
            )}

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Email"
                value={email}
                onChangeText={(text) => { setEmail(text); setError(null); }}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                left={<TextInput.Icon icon="email-outline" />}
                style={styles.input}
                outlineStyle={{ borderRadius: BorderRadius.lg }}
                error={!!error && !email.trim()}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <TextInput
                label="Password"
                value={password}
                onChangeText={(text) => { setPassword(text); setError(null); }}
                mode="outlined"
                secureTextEntry={!showPassword}
                autoComplete="password"
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
                style={styles.input}
                outlineStyle={{ borderRadius: BorderRadius.lg }}
                error={!!error && !password.trim()}
              />
            </View>

            {/* Forgot Password */}
            <Pressable style={styles.forgotPassword}>
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                Forgot Password?
              </Text>
            </Pressable>

            {/* Login Button */}
            <AnimatedButton
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              size="lg"
              icon="login"
              style={styles.loginButton}
            />

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textTertiary }]}>
                or continue with
              </Text>
              <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            </View>

            {/* Social Buttons */}
            <View style={styles.socialRow}>
              <Pressable
                style={[styles.socialButton, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => handleSocialLogin('Google')}
              >
                <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
              </Pressable>
              <Pressable
                style={[styles.socialButton, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => handleSocialLogin('Apple')}
              >
                <MaterialCommunityIcons
                  name="apple"
                  size={24}
                  color={isDark ? '#FFFFFF' : '#000000'}
                />
              </Pressable>
            </View>

            {/* Sign Up Link */}
            <View style={styles.signupRow}>
              <Text style={[styles.signupText, { color: colors.textSecondary }]}>
                Don't have an account?{' '}
              </Text>
              <Link href="/auth/signup" asChild>
                <Pressable>
                  <Text style={[styles.signupLink, { color: colors.primary }]}>
                    Sign Up
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
    flexDirection: 'column',
  },
  containerDesktop: {
    flexDirection: 'row',
  },
  gradientBg: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  gradientMobile: {
    width: '100%',
    height: 220,
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
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  circle1: {
    width: 200,
    height: 200,
    top: -60,
    right: -60,
  },
  circle2: {
    width: 150,
    height: 150,
    bottom: -30,
    left: -40,
  },
  circle3: {
    width: 80,
    height: 80,
    top: '40%',
    left: '30%',
  },
  brandSection: {
    alignItems: 'center',
    zIndex: 1,
    paddingVertical: Spacing.xl,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  brandName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  brandTagline: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: Spacing.xs,
  },
  formSection: {
    flex: 1,
    justifyContent: 'center',
  },
  formSectionDesktop: {
    width: '55%',
    marginLeft: 'auto',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
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
    marginBottom: Spacing['2xl'],
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: Spacing.md,
  },
  input: {},
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: Spacing.xl,
  },
  forgotPasswordText: {
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    marginBottom: Spacing.xl,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: Spacing.md,
    fontSize: 13,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing['2xl'],
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontWeight: '600',
    fontSize: 14,
  },
});
