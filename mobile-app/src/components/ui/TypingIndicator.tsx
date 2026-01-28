// Typing Indicator Component
// Three-dot bouncing animation for AI thinking state

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withDelay,
    withSequence,
} from 'react-native-reanimated';
import { BorderRadius, Spacing } from '../../config/theme';
import { Colors } from '../../config/colors';
import { Animations } from '../../config/animations';

interface TypingIndicatorProps {
    style?: ViewStyle;
    dotColor?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function TypingIndicator({
    style,
    dotColor,
    size = 'md',
}: TypingIndicatorProps) {
    const theme = useTheme();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;

    const sizeConfig = {
        sm: { dotSize: 6, gap: 4, containerPadding: 10 },
        md: { dotSize: 8, gap: 6, containerPadding: 14 },
        lg: { dotSize: 10, gap: 8, containerPadding: 18 },
    };

    const config = sizeConfig[size];

    // Shared values for each dot
    const dot1 = useSharedValue(0);
    const dot2 = useSharedValue(0);
    const dot3 = useSharedValue(0);

    useEffect(() => {
        const interval = Animations.typing.dotInterval;

        // Create bouncing animation
        const bounce = withRepeat(
            withSequence(
                withTiming(1, { duration: interval / 2 }),
                withTiming(0, { duration: interval / 2 })
            ),
            -1,
            false
        );

        dot1.value = bounce;
        dot2.value = withDelay(interval / 3, bounce);
        dot3.value = withDelay((interval / 3) * 2, bounce);
    }, []);

    const createDotStyle = (animatedValue: { value: number }) => {
        return useAnimatedStyle(() => ({
            transform: [
                { translateY: -animatedValue.value * 6 },
                { scale: 1 + animatedValue.value * 0.2 },
            ],
            opacity: 0.6 + animatedValue.value * 0.4,
        }));
    };

    const dot1Style = createDotStyle(dot1);
    const dot2Style = createDotStyle(dot2);
    const dot3Style = createDotStyle(dot3);

    const effectiveDotColor = dotColor || colors.primary;

    return (
        <View
            style={[
                styles.container,
                {
                    padding: config.containerPadding,
                    gap: config.gap,
                    backgroundColor: isDark
                        ? 'rgba(51, 65, 85, 0.8)'
                        : 'rgba(241, 245, 249, 0.9)',
                },
                style,
            ]}
        >
            <Animated.View
                style={[
                    styles.dot,
                    dot1Style,
                    {
                        width: config.dotSize,
                        height: config.dotSize,
                        backgroundColor: effectiveDotColor,
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.dot,
                    dot2Style,
                    {
                        width: config.dotSize,
                        height: config.dotSize,
                        backgroundColor: effectiveDotColor,
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.dot,
                    dot3Style,
                    {
                        width: config.dotSize,
                        height: config.dotSize,
                        backgroundColor: effectiveDotColor,
                    },
                ]}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.xl,
        alignSelf: 'flex-start',
    },
    dot: {
        borderRadius: BorderRadius.full,
    },
});

