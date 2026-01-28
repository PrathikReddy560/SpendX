// Premium Glass Card Component
// Frosted glass effect card with blur and animations

import React from 'react';
import { View, StyleSheet, Platform, Pressable, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolate,
    FadeInDown,
} from 'react-native-reanimated';
import { BorderRadius, Shadows, Spacing } from '../../config/theme';
import { Animations } from '../../config/animations';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
    variant?: 'default' | 'elevated' | 'outlined';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    animated?: boolean;
    delay?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function GlassCard({
    children,
    style,
    onPress,
    variant = 'default',
    padding = 'md',
    animated = true,
    delay = 0,
}: GlassCardProps) {
    const theme = useTheme();
    const pressed = useSharedValue(0);
    const hovered = useSharedValue(0);

    const paddingMap = {
        none: 0,
        sm: Spacing.md,
        md: Spacing.lg,
        lg: Spacing.xl,
    };

    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            pressed.value,
            [0, 1],
            [1, Animations.card.pressScale]
        );

        const translateY = interpolate(
            hovered.value,
            [0, 1],
            [0, Animations.card.hoverLift]
        );

        return {
            transform: [
                { scale },
                { translateY },
            ],
        };
    });

    const handlePressIn = () => {
        pressed.value = withSpring(1, Animations.spring.snappy);
    };

    const handlePressOut = () => {
        pressed.value = withSpring(0, Animations.spring.snappy);
    };

    const handleHoverIn = () => {
        hovered.value = withSpring(1, Animations.spring.gentle);
    };

    const handleHoverOut = () => {
        hovered.value = withSpring(0, Animations.spring.gentle);
    };

    const getVariantStyle = (): ViewStyle => {
        const isDark = theme.dark;

        switch (variant) {
            case 'elevated':
                return {
                    backgroundColor: isDark ? 'rgba(51, 65, 85, 0.9)' : 'rgba(255, 255, 255, 0.95)',
                    ...Shadows?.lg,
                };
            case 'outlined':
                return {
                    backgroundColor: 'transparent',
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)',
                };
            default:
                return {
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.5)',
                };
        }
    };

    const cardStyle: ViewStyle[] = [
        styles.card,
        getVariantStyle(),
        { padding: paddingMap[padding] },
        style,
    ];

    const content = (
        <View style={cardStyle}>
            {children}
        </View>
    );

    if (onPress) {
        return (
            <AnimatedPressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onHoverIn={handleHoverIn}
                onHoverOut={handleHoverOut}
                style={animatedStyle}
                entering={animated ? FadeInDown.delay(delay).duration(400).springify() : undefined}
            >
                {content}
            </AnimatedPressable>
        );
    }

    return (
        <Animated.View
            style={animatedStyle}
            entering={animated ? FadeInDown.delay(delay).duration(400).springify() : undefined}
        >
            {content}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        borderRadius: BorderRadius.lg, // Smaller radius for mobile
        overflow: 'hidden',
        ...(Platform.OS === 'web' ? {
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
        } : {}),
    },
});

