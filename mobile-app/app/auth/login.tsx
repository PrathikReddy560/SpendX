// Premium Login Screen
// Enhanced login with glassmorphism, animations, and social auth

import React, { useState, useContext } from 'react';
import { View, StyleSheet, Dimensions, Platform, Pressable, KeyboardAvoidingView, ScrollView } from 'react-native';
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

export default function LoginScreen() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { isMobile, isDesktop } = useResponsive();
  const isDark = theme.dark;
  const colors = isDark ? Colors.dark : Colors.light;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.replace('/(app)');
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    // Implement social auth
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
              loading={loading}
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
                onPress={() => handleSocialLogin('google')}
              >
                <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
              </Pressable>
              <Pressable
                style={[styles.socialButton, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => handleSocialLogin('apple')}
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
    height: 220, // Compact height on mobile
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
    width: '55%', // Take remaining space
    marginLeft: 'auto', // Push to right
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
