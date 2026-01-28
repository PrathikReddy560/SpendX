// Category Chip Component
// Selectable category pills with icons

import React from 'react';
import { StyleSheet, Pressable, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    interpolateColor,
} from 'react-native-reanimated';
import { BorderRadius, Spacing } from '../../config/theme';
import { Colors } from '../../config/colors';
import { Animations } from '../../config/animations';

interface CategoryChipProps {
    id: string;
    label: string;
    icon: string;
    color: string;
    selected?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
    size?: 'sm' | 'md' | 'lg';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function CategoryChip({
    id,
    label,
    icon,
    color,
    selected = false,
    onPress,
    style,
    size = 'md',
}: CategoryChipProps) {
    const theme = useTheme();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;
    const pressed = useSharedValue(0);

    const sizeConfig = {
        sm: { height: 32, iconSize: 14, fontSize: 12, padding: 10 },
        md: { height: 40, iconSize: 18, fontSize: 14, padding: 14 },
        lg: { height: 48, iconSize: 22, fontSize: 16, padding: 18 },
    };

    const config = sizeConfig[size];

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: 1 - pressed.value * 0.05 }],
    }));

    const handlePressIn = () => {
        pressed.value = withSpring(1, Animations.spring.snappy);
    };

    const handlePressOut = () => {
        pressed.value = withSpring(0, Animations.spring.snappy);
    };

    const backgroundColor = selected
        ? color
        : isDark
            ? `${color}20`
            : `${color}10`;

    const textColor = selected ? '#FFFFFF' : color;

    return (
        <AnimatedPressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[
                animatedStyle,
                styles.chip,
                {
                    height: config.height,
                    paddingHorizontal: config.padding,
                    backgroundColor,
                    borderColor: selected ? color : 'transparent',
                    borderWidth: 1,
                },
                style,
            ]}
        >
            <MaterialCommunityIcons
                name={icon as any}
                size={config.iconSize}
                color={textColor}
            />
            <Text
                style={[
                    styles.label,
                    {
                        fontSize: config.fontSize,
                        color: textColor,
                    },
                ]}
            >
                {label}
            </Text>
        </AnimatedPressable>
    );
}

// Category Chip List Component
interface CategoryChipListProps {
    categories: Array<{
        id: string;
        label: string;
        icon: string;
        color: string;
    }>;
    selectedId?: string;
    onSelect?: (id: string) => void;
    multiSelect?: boolean;
    selectedIds?: string[];
    size?: 'sm' | 'md' | 'lg';
}

export function CategoryChipList({
    categories,
    selectedId,
    onSelect,
    multiSelect = false,
    selectedIds = [],
    size = 'md',
}: CategoryChipListProps) {
    const isSelected = (id: string) => {
        if (multiSelect) {
            return selectedIds.includes(id);
        }
        return selectedId === id;
    };

    return (
        <Animated.View style={styles.chipList}>
            {categories.map((category) => (
                <CategoryChip
                    key={category.id}
                    {...category}
                    selected={isSelected(category.id)}
                    onPress={() => onSelect?.(category.id)}
                    size={size}
                    style={styles.chipItem}
                />
            ))}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: BorderRadius.full,
        gap: Spacing.xs,
    },
    label: {
        fontWeight: '600',
    },
    chipList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    chipItem: {
        marginBottom: Spacing.xs,
    },
});

