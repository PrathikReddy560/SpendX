// Animated Button Component
// Premium button with micro-interactions and loading states

import React from 'react';
import { StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolate,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { BorderRadius, Spacing, ButtonConfig } from '../../config/theme';
import { Animations } from '../../config/animations';
import { Colors } from '../../config/colors';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface AnimatedButtonProps {
    onPress: () => void;
    title: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: keyof typeof MaterialCommunityIcons.glyphMap;
    iconPosition?: 'left' | 'right';
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    gradient?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AnimatedButton({
    onPress,
    title,
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    loading = false,
    disabled = false,
    fullWidth = false,
    style,
    textStyle,
    gradient = true,
}: AnimatedButtonProps) {
    const theme = useTheme();
    const pressed = useSharedValue(0);
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;

    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            pressed.value,
            [0, 1],
            [1, Animations.button.pressedScale]
        );
        const opacity = interpolate(
            pressed.value,
            [0, 1],
            [1, Animations.button.pressedOpacity]
        );
        return {
            transform: [{ scale }],
            opacity,
        };
    });

    const handlePressIn = () => {
        if (!disabled && !loading) {
            pressed.value = withSpring(1, Animations.spring.snappy);
        }
    };

    const handlePressOut = () => {
        pressed.value = withSpring(0, Animations.spring.snappy);
    };

    const getVariantColors = () => {
        switch (variant) {
            case 'secondary':
                return {
                    bg: colors.secondary,
                    bgGradient: colors.gradients.secondary,
                    text: '#FFFFFF',
                    border: 'transparent',
                };
            case 'outline':
                return {
                    bg: 'transparent',
                    bgGradient: ['transparent', 'transparent'],
                    text: colors.primary,
                    border: colors.primary,
                };
            case 'ghost':
                return {
                    bg: 'transparent',
                    bgGradient: ['transparent', 'transparent'],
                    text: colors.primary,
                    border: 'transparent',
                };
            case 'danger':
                return {
                    bg: colors.error,
                    bgGradient: [colors.error, '#DC2626'],
                    text: '#FFFFFF',
                    border: 'transparent',
                };
            default:
                return {
                    bg: colors.primary,
                    bgGradient: colors.gradients.primary,
                    text: '#FFFFFF',
                    border: 'transparent',
                };
        }
    };

    const variantColors = getVariantColors();
    const height = ButtonConfig.heights[size];
    const paddingHorizontal = ButtonConfig.paddingHorizontal[size];
    const fontSize = ButtonConfig.fontSize[size];
    const iconSize = ButtonConfig.iconSize[size];

    const buttonStyle: ViewStyle[] = [
        styles.button,
        {
            height,
            paddingHorizontal,
            borderColor: variantColors.border,
            borderWidth: variant === 'outline' ? 2 : 0,
            opacity: disabled ? 0.5 : 1,
        },
        fullWidth && styles.fullWidth,
        style,
    ];

    const labelStyle: TextStyle = {
        fontSize,
        fontWeight: '600',
        color: variantColors.text,
        ...textStyle,
    };

    const renderContent = () => (
        <>
            {loading ? (
                <ActivityIndicator color={variantColors.text} size="small" />
            ) : (
                <>
                    {icon && iconPosition === 'left' && (
                        <MaterialCommunityIcons
                            name={icon}
                            size={iconSize}
                            color={variantColors.text}
                            style={styles.iconLeft}
                        />
                    )}
                    <Text style={labelStyle}>{title}</Text>
                    {icon && iconPosition === 'right' && (
                        <MaterialCommunityIcons
                            name={icon}
                            size={iconSize}
                            color={variantColors.text}
                            style={styles.iconRight}
                        />
                    )}
                </>
            )}
        </>
    );

    const useGradient = gradient && (variant === 'primary' || variant === 'secondary' || variant === 'danger');

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled || loading}
            style={[animatedStyle, fullWidth && styles.fullWidth]}
        >
            {useGradient ? (
                <LinearGradient
                    colors={variantColors.bgGradient as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={buttonStyle}
                >
                    {renderContent()}
                </LinearGradient>
            ) : (
                <Animated.View style={[buttonStyle, { backgroundColor: variantColors.bg }]}>
                    {renderContent()}
                </Animated.View>
            )}
        </AnimatedPressable>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.lg,
        gap: Spacing.sm,
    },
    fullWidth: {
        width: '100%',
    },
    iconLeft: {
        marginRight: Spacing.xs,
    },
    iconRight: {
        marginLeft: Spacing.xs,
    },
});

