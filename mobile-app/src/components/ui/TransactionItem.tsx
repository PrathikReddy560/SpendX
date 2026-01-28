// Premium Transaction Item Component
// Sleek transaction list item with swipe actions and category colors

import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { BorderRadius, Spacing, Shadows } from '../../config/theme';
import { Colors } from '../../config/colors';
import { Categories } from '../../config/api';

interface TransactionItemProps {
    id: string;
    title: string;
    category: string;
    amount: number;
    date: string;
    type: 'income' | 'expense';
    description?: string;
    onPress?: () => void;
    style?: ViewStyle;
    delay?: number;
}

export default function TransactionItem({
    id,
    title,
    category,
    amount,
    date,
    type,
    description,
    onPress,
    style,
    delay = 0,
}: TransactionItemProps) {
    const theme = useTheme();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;

    // Get category info
    const categoryInfo = Categories.find(c => c.id === category) || Categories[Categories.length - 1];
    const categoryColor = colors.categories[category as keyof typeof colors.categories] || colors.textSecondary;

    const formattedAmount = type === 'income'
        ? `+$${amount.toLocaleString()}`
        : `-$${amount.toLocaleString()}`;

    const amountColor = type === 'income' ? colors.success : colors.error;

    return (
        <Animated.View
            entering={FadeInRight.delay(delay).duration(300)}
            exiting={FadeOutLeft.duration(200)}
        >
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    styles.container,
                    {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        opacity: pressed ? 0.9 : 1,
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                    },
                    style,
                ]}
            >
                {/* Category Icon */}
                <View
                    style={[
                        styles.iconContainer,
                        { backgroundColor: `${categoryColor}15` },
                    ]}
                >
                    <MaterialCommunityIcons
                        name={categoryInfo.icon as any}
                        size={22}
                        color={categoryColor}
                    />
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.titleRow}>
                        <Text
                            variant="titleSmall"
                            style={[styles.title, { color: colors.text }]}
                            numberOfLines={1}
                        >
                            {title}
                        </Text>
                    </View>
                    <View style={styles.subtitleRow}>
                        <Text
                            variant="labelSmall"
                            style={[styles.category, { color: categoryColor }]}
                        >
                            {categoryInfo.label}
                        </Text>
                        <View style={styles.dot} />
                        <Text
                            variant="labelSmall"
                            style={[styles.date, { color: colors.textTertiary }]}
                        >
                            {date}
                        </Text>
                    </View>
                </View>

                {/* Amount */}
                <View style={styles.amountContainer}>
                    <Text
                        variant="titleSmall"
                        style={[styles.amount, { color: amountColor }]}
                    >
                        {formattedAmount}
                    </Text>
                </View>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.sm, // Smaller padding
        borderRadius: BorderRadius.md, // Smaller radius
        borderWidth: 1,
        marginBottom: Spacing.xs, // Smaller margin
        ...Shadows?.xs,
    },
    iconContainer: {
        width: 40, // Smaller icon container
        height: 40,
        borderRadius: BorderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0, // Don't shrink
    },
    content: {
        flex: 1,
        marginLeft: Spacing.sm, // Smaller margin
        marginRight: Spacing.sm, // Add right margin before amount
        minWidth: 0, // Allow shrinking
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontWeight: '600',
        flex: 1,
    },
    subtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Spacing.xxs,
    },
    category: {
        fontWeight: '500',
    },
    dot: {
        width: 3,
        height: 3,
        borderRadius: 2,
        backgroundColor: '#9CA3AF',
        marginHorizontal: Spacing.xs,
    },
    date: {},
    amountContainer: {
        alignItems: 'flex-end',
        flexShrink: 0, // Don't shrink amount
        minWidth: 70, // Ensure minimum width for amount
    },
    amount: {
        fontWeight: 'bold',
        fontSize: 14, // Slightly smaller font
    },
});

