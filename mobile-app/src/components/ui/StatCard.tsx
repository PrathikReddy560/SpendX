// Animated Stat Card Component
// Displays statistics with animated number counter and trend indicator

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withDelay,
    FadeInUp,
    interpolate,
    runOnJS,
} from 'react-native-reanimated';
import { BorderRadius, Spacing, Shadows } from '../../config/theme';
import { Animations } from '../../config/animations';
import { Colors } from '../../config/colors';

type TrendDirection = 'up' | 'down' | 'neutral';
type CardVariant = 'default' | 'gradient' | 'outlined';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: keyof typeof MaterialCommunityIcons.glyphMap;
    trend?: {
        direction: TrendDirection;
        value: string;
    };
    variant?: CardVariant;
    gradientColors?: [string, string];
    iconColor?: string;
    style?: ViewStyle;
    delay?: number;
    formatAsCurrency?: boolean;
    currencySymbol?: string;
}

export default function StatCard({
    title,
    value,
    subtitle,
    icon = 'chart-line',
    trend,
    variant = 'default',
    gradientColors,
    iconColor,
    style,
    delay = 0,
    formatAsCurrency = false,
    currencySymbol = '$',
}: StatCardProps) {
    const theme = useTheme();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;

    const displayValue = formatAsCurrency
        ? `${currencySymbol}${Number(value).toLocaleString()}`
        : value.toString();

    const getTrendColor = () => {
        if (!trend) return colors.textSecondary;
        switch (trend.direction) {
            case 'up':
                return colors.success;
            case 'down':
                return colors.error;
            default:
                return colors.textSecondary;
        }
    };

    const getTrendIcon = (): keyof typeof MaterialCommunityIcons.glyphMap => {
        if (!trend) return 'minus';
        switch (trend.direction) {
            case 'up':
                return 'trending-up';
            case 'down':
                return 'trending-down';
            default:
                return 'minus';
        }
    };

    const defaultGradient = colors.gradients.primary as [string, string];

    const renderContent = () => (
        <View style={styles.content}>
            {/* Icon */}
            <View
                style={[
                    styles.iconContainer,
                    {
                        backgroundColor: variant === 'gradient'
                            ? 'rgba(255, 255, 255, 0.2)'
                            : isDark
                                ? 'rgba(99, 102, 241, 0.15)'
                                : 'rgba(99, 102, 241, 0.1)',
                    },
                ]}
            >
                <MaterialCommunityIcons
                    name={icon}
                    size={24}
                    color={variant === 'gradient' ? '#FFFFFF' : iconColor || colors.primary}
                />
            </View>

            {/* Title */}
            <Text
                variant="labelMedium"
                style={[
                    styles.title,
                    { color: variant === 'gradient' ? 'rgba(255,255,255,0.8)' : colors.textSecondary },
                ]}
            >
                {title}
            </Text>

            {/* Value */}
            <Animated.View entering={FadeInUp.delay(delay + 100).duration(400)}>
                <Text
                    variant="headlineSmall"
                    style={[
                        styles.value,
                        { color: variant === 'gradient' ? '#FFFFFF' : colors.text },
                    ]}
                >
                    {displayValue}
                </Text>
            </Animated.View>

            {/* Subtitle or Trend */}
            <View style={styles.footer}>
                {trend ? (
                    <View style={styles.trendContainer}>
                        <MaterialCommunityIcons
                            name={getTrendIcon()}
                            size={16}
                            color={getTrendColor()}
                        />
                        <Text
                            variant="labelSmall"
                            style={[styles.trendText, { color: getTrendColor() }]}
                        >
                            {trend.value}
                        </Text>
                    </View>
                ) : subtitle ? (
                    <Text
                        variant="labelSmall"
                        style={[
                            styles.subtitle,
                            { color: variant === 'gradient' ? 'rgba(255,255,255,0.7)' : colors.textTertiary },
                        ]}
                    >
                        {subtitle}
                    </Text>
                ) : null}
            </View>
        </View>
    );

    if (variant === 'gradient') {
        return (
            <Animated.View
                entering={FadeInUp.delay(delay).duration(400).springify()}
                style={[styles.cardWrapper, style]}
            >
                <LinearGradient
                    colors={gradientColors || defaultGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.card}
                >
                    {renderContent()}
                </LinearGradient>
            </Animated.View>
        );
    }

    return (
        <Animated.View
            entering={FadeInUp.delay(delay).duration(400).springify()}
            style={[
                styles.cardWrapper,
                styles.card,
                {
                    backgroundColor: variant === 'outlined' ? 'transparent' : colors.card,
                    borderWidth: variant === 'outlined' ? 1 : 0,
                    borderColor: colors.border,
                    ...Shadows?.sm,
                },
                style,
            ]}
        >
            {renderContent()}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    cardWrapper: {
        flex: 1,
        minWidth: 120, // Smaller min width for mobile
        maxWidth: '50%', // Don't exceed half screen
    },
    card: {
        borderRadius: BorderRadius.lg, // Smaller radius
        padding: Spacing.md, // Smaller padding
    },
    content: {
        gap: Spacing.sm,
    },
    iconContainer: {
        width: 36, // Smaller icons
        height: 36,
        borderRadius: BorderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.xxs,
    },
    title: {
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontWeight: 'bold',
    },
    footer: {
        marginTop: Spacing.xs,
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xxs,
    },
    trendText: {
        fontWeight: '600',
    },
    subtitle: {},
});

