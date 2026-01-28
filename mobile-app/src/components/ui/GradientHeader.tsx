// Premium Gradient Header Component
// Animated gradient background with customizable content

import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Spacing, BorderRadius } from '../../config/theme';
import { Colors } from '../../config/colors';

interface GradientHeaderProps {
    title?: string;
    subtitle?: string;
    children?: React.ReactNode;
    gradientColors?: [string, string];
    height?: 'sm' | 'md' | 'lg' | 'auto';
    rounded?: boolean;
    style?: ViewStyle;
    rightContent?: React.ReactNode;
    showBackdrop?: boolean;
}

export default function GradientHeader({
    title,
    subtitle,
    children,
    gradientColors,
    height = 'md',
    rounded = true,
    style,
    rightContent,
    showBackdrop = true,
}: GradientHeaderProps) {
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;

    const defaultGradient = colors.gradients.primaryDark as [string, string];
    const gradient = gradientColors || defaultGradient;

    const heightMap = {
        sm: 120,
        md: 180,
        lg: 260,
        auto: undefined,
    };

    const headerHeight = heightMap[height];

    return (
        <LinearGradient
            colors={gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
                styles.container,
                {
                    paddingTop: insets.top + Spacing.md,
                    minHeight: headerHeight,
                    borderBottomLeftRadius: rounded ? BorderRadius['3xl'] : 0,
                    borderBottomRightRadius: rounded ? BorderRadius['3xl'] : 0,
                },
                style,
            ]}
        >
            {/* Backdrop pattern for depth */}
            {showBackdrop && (
                <View style={styles.backdropPattern}>
                    <View style={[styles.circle, styles.circle1]} />
                    <View style={[styles.circle, styles.circle2]} />
                    <View style={[styles.circle, styles.circle3]} />
                </View>
            )}

            <View style={styles.content}>
                {/* Header with title and right content */}
                {(title || rightContent) && (
                    <Animated.View
                        entering={FadeInDown.delay(100).duration(400)}
                        style={styles.header}
                    >
                        <View style={styles.titleContainer}>
                            {title && (
                                <Text variant="headlineMedium" style={styles.title}>
                                    {title}
                                </Text>
                            )}
                            {subtitle && (
                                <Text variant="bodyLarge" style={styles.subtitle}>
                                    {subtitle}
                                </Text>
                            )}
                        </View>
                        {rightContent && (
                            <View style={styles.rightContent}>
                                {rightContent}
                            </View>
                        )}
                    </Animated.View>
                )}

                {/* Custom children content */}
                {children && (
                    <Animated.View
                        entering={FadeIn.delay(200).duration(400)}
                        style={styles.childrenContainer}
                    >
                        {children}
                    </Animated.View>
                )}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
    },
    backdropPattern: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    circle: {
        position: 'absolute',
        borderRadius: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    circle1: {
        width: 300,
        height: 300,
        top: -100,
        right: -100,
    },
    circle2: {
        width: 200,
        height: 200,
        bottom: -50,
        left: -50,
    },
    circle3: {
        width: 150,
        height: 150,
        top: 50,
        left: '40%',
    },
    content: {
        flex: 1,
        paddingHorizontal: Spacing.md, // Consistent with other content
        paddingTop: Spacing.md,
        paddingBottom: Spacing['2xl'],
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: Spacing.xs,
    },
    rightContent: {
        marginLeft: Spacing.md,
    },
    childrenContainer: {
        marginTop: Spacing.lg,
    },
});

