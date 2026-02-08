// Currency Selection Screen
// Supports USD and INR

import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Pressable,
} from 'react-native';
import { Text, RadioButton, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ResponsiveContainer from '../../src/components/layout/ResponsiveContainer';
import GlassCard from '../../src/components/ui/GlassCard';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';

const CURRENCY_KEY = 'spendx_currency';

interface Currency {
    code: string;
    name: string;
    symbol: string;
    icon: string;
}

const currencies: Currency[] = [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', icon: 'currency-inr' },
    { code: 'USD', name: 'US Dollar', symbol: '$', icon: 'currency-usd' },
];

export default function CurrencyScreen() {
    const router = useRouter();
    const theme = useTheme();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;

    const [selectedCurrency, setSelectedCurrency] = useState('INR');

    useEffect(() => {
        loadCurrency();
    }, []);

    const loadCurrency = async () => {
        const saved = await AsyncStorage.getItem(CURRENCY_KEY);
        if (saved) setSelectedCurrency(saved);
    };

    const handleCurrencyChange = async (code: string) => {
        setSelectedCurrency(code);
        await AsyncStorage.setItem(CURRENCY_KEY, code);
    };

    return (
        <ResponsiveContainer>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <LinearGradient
                    colors={colors.gradients.primaryDark as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.header}
                >
                    <Pressable onPress={() => router.push('/(app)/profile')} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
                    </Pressable>
                    <Text variant="titleLarge" style={styles.headerTitle}>
                        Currency
                    </Text>
                    <View style={{ width: 40 }} />
                </LinearGradient>

                {/* Currency Options */}
                <View style={styles.content}>
                    <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                        <GlassCard padding="none">
                            <RadioButton.Group
                                onValueChange={handleCurrencyChange}
                                value={selectedCurrency}
                            >
                                {currencies.map((currency, index) => (
                                    <View key={currency.code}>
                                        <Pressable
                                            style={styles.currencyItem}
                                            onPress={() => handleCurrencyChange(currency.code)}
                                        >
                                            <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}15` }]}>
                                                <MaterialCommunityIcons
                                                    name={currency.icon as any}
                                                    size={24}
                                                    color={colors.primary}
                                                />
                                            </View>
                                            <View style={styles.currencyInfo}>
                                                <Text variant="bodyLarge" style={[styles.currencyName, { color: colors.text }]}>
                                                    {currency.name}
                                                </Text>
                                                <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
                                                    {currency.code} ({currency.symbol})
                                                </Text>
                                            </View>
                                            <RadioButton value={currency.code} color={colors.primary} />
                                        </Pressable>
                                        {index < currencies.length - 1 && (
                                            <View style={[styles.divider, { backgroundColor: colors.border }]} />
                                        )}
                                    </View>
                                ))}
                            </RadioButton.Group>
                        </GlassCard>
                    </Animated.View>

                    {/* Info */}
                    <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.infoContainer}>
                        <MaterialCommunityIcons name="information-outline" size={20} color={colors.textSecondary} />
                        <Text variant="bodySmall" style={[styles.infoText, { color: colors.textSecondary }]}>
                            This changes how amounts are displayed throughout the app. Existing transactions will be shown in the new currency format.
                        </Text>
                    </Animated.View>
                </View>
            </ScrollView>
        </ResponsiveContainer>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingBottom: 100,
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.lg,
        paddingHorizontal: Spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    content: {
        paddingHorizontal: Spacing.md,
        marginTop: Spacing.lg,
    },
    currencyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        gap: Spacing.md,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    currencyInfo: {
        flex: 1,
    },
    currencyName: {
        fontWeight: '600',
    },
    divider: {
        height: 1,
        marginHorizontal: Spacing.md,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.sm,
        marginTop: Spacing.lg,
        paddingHorizontal: Spacing.sm,
    },
    infoText: {
        flex: 1,
        lineHeight: 18,
    },
});
