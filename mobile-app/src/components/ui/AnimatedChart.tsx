// Animated Chart Wrapper Component
// Wrapper for charts with animated entrance

import React from 'react';
import { View, StyleSheet, ViewStyle, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { BorderRadius, Spacing, Shadows } from '../../config/theme';
import { Colors } from '../../config/colors';

interface AnimatedChartProps {
    children: React.ReactNode;
    title?: string;
    style?: ViewStyle;
    delay?: number;
    showCard?: boolean;
}

export default function AnimatedChart({
    children,
    title,
    style,
    delay = 0,
    showCard = true,
}: AnimatedChartProps) {
    const theme = useTheme();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;

    if (!showCard) {
        return (
            <Animated.View
                entering={FadeInUp.delay(delay).duration(500)}
                style={style}
            >
                {children}
            </Animated.View>
        );
    }

    return (
        <Animated.View
            entering={FadeInUp.delay(delay).duration(500)}
            style={[
                styles.container,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                },
                style,
            ]}
        >
            {children}
        </Animated.View>
    );
}

// Chart Theme Configuration
export function getChartConfig(isDark: boolean) {
    const colors = isDark ? Colors.dark : Colors.light;

    return {
        backgroundColor: colors.card,
        backgroundGradientFrom: colors.card,
        backgroundGradientTo: colors.card,
        decimalPlaces: 0,
        color: (opacity = 1) => colors.primary,
        labelColor: (opacity = 1) => colors.textSecondary,
        style: {
            borderRadius: BorderRadius.lg,
        },
        propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: colors.border,
            strokeWidth: 1,
        },
        propsForLabels: {
            fontSize: 12,
        },
    };
}

// Pie Chart Colors
export function getPieChartColors(isDark: boolean) {
    const colors = isDark ? Colors.dark : Colors.light;
    return Object.values(colors.chart);
}

const styles = StyleSheet.create({
    container: {
        borderRadius: BorderRadius.xl,
        padding: Spacing.md,
        borderWidth: 1,
        ...Shadows?.sm,
    },
});

