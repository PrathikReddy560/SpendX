// Add Transaction Screen
// Create new expense or income with backend integration

import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Pressable,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Text, TextInput, useTheme, SegmentedButtons, Chip } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';
import AnimatedButton from '../../src/components/ui/AnimatedButton';
import { API_BASE_URL, Endpoints, Categories } from '../../src/config/api';
import useCurrency from '../../src/hooks/useCurrency';

type TransactionType = 'expense' | 'income';

export default function AddTransactionScreen() {
    const router = useRouter();
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;

    const [type, setType] = useState<TransactionType>('expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { symbol: currencySymbol } = useCurrency();

    // Filter categories: Income (8) for income type, all others for expense
    const filteredCategories = Categories.filter(cat =>
        type === 'income' ? cat.id === 8 || cat.id === 9 : cat.id !== 8
    );

    const handleSubmit = async () => {
        // Validation
        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }
        if (!category) {
            setError('Please select a category');
            return;
        }
        if (!description.trim()) {
            setError('Please add a description');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const token = await AsyncStorage.getItem('spendx_access_token');
            if (!token) {
                router.replace('/auth/login');
                return;
            }

            const response = await axios.post(
                `${API_BASE_URL}${Endpoints.transactions.create}`,
                {
                    amount: parseFloat(amount),
                    type: type,
                    category_id: category,
                    description: description.trim(),
                    date: new Date().toISOString().split('T')[0],
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setSuccess(true);

            // Reset form after short delay for another entry
            setTimeout(() => {
                setAmount('');
                setDescription('');
                setCategory(null);
                setSuccess(false);
            }, 1500);
        } catch (err: any) {
            console.error('Transaction error:', err.response?.data || err.message);

            // If token expired or invalid, redirect to login
            if (err.response?.status === 401) {
                await AsyncStorage.removeItem('spendx_access_token');
                router.replace('/auth/login');
                return;
            }

            setError(err.response?.data?.detail || 'Failed to save transaction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <LinearGradient
                colors={type === 'expense'
                    ? ['#EF4444', '#DC2626'] as const
                    : ['#10B981', '#059669'] as const
                }
                style={[styles.header, { paddingTop: insets.top + Spacing.md }]}
            >
                <View style={styles.headerContent}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#FFFFFF" />
                    </Pressable>
                    <Text variant="titleLarge" style={styles.headerTitle}>
                        Add {type === 'expense' ? 'Expense' : 'Income'}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Amount Input */}
                <View style={styles.amountContainer}>
                    <Text style={styles.currencySymbol}>{currencySymbol}</Text>
                    <TextInput
                        value={amount}
                        onChangeText={setAmount}
                        placeholder="0.00"
                        placeholderTextColor="rgba(255,255,255,0.5)"
                        keyboardType="decimal-pad"
                        style={styles.amountInput}
                        underlineColor="transparent"
                        activeUnderlineColor="transparent"
                        textColor="#FFFFFF"
                        contentStyle={styles.amountInputContent}
                    />
                </View>
            </LinearGradient>

            <KeyboardAvoidingView
                style={styles.formContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Transaction Type */}
                    <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                        <Text variant="labelLarge" style={[styles.label, { color: colors.text }]}>
                            Transaction Type
                        </Text>
                        <SegmentedButtons
                            value={type}
                            onValueChange={(value) => {
                                setType(value as TransactionType);
                                setCategory(null);
                            }}
                            buttons={[
                                { value: 'expense', label: 'Expense', icon: 'arrow-down' },
                                { value: 'income', label: 'Income', icon: 'arrow-up' },
                            ]}
                            style={styles.segmentedButtons}
                        />
                    </Animated.View>

                    {/* Category Selection */}
                    <Animated.View entering={FadeInDown.delay(200).duration(400)}>
                        <Text variant="labelLarge" style={[styles.label, { color: colors.text }]}>
                            Category
                        </Text>
                        <View style={styles.categoryContainer}>
                            {filteredCategories.map((cat) => (
                                <Chip
                                    key={cat.id}
                                    selected={category === cat.id}
                                    onPress={() => setCategory(cat.id)}
                                    style={[
                                        styles.categoryChip,
                                        category === cat.id && { backgroundColor: cat.color + '20' },
                                    ]}
                                    textStyle={category === cat.id ? { color: cat.color } : undefined}
                                    icon={() => (
                                        <MaterialCommunityIcons
                                            name={cat.icon as any}
                                            size={18}
                                            color={category === cat.id ? cat.color : colors.textSecondary}
                                        />
                                    )}
                                >
                                    {cat.label}
                                </Chip>
                            ))}
                        </View>
                    </Animated.View>

                    {/* Description */}
                    <Animated.View entering={FadeInDown.delay(300).duration(400)}>
                        <Text variant="labelLarge" style={[styles.label, { color: colors.text }]}>
                            Description
                        </Text>
                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            placeholder="What was this for?"
                            mode="outlined"
                            style={styles.descriptionInput}
                            outlineStyle={{ borderRadius: BorderRadius.lg }}
                        />
                    </Animated.View>

                    {/* Error Message */}
                    {error && (
                        <Animated.View entering={FadeIn.duration(300)}>
                            <View style={[styles.errorContainer, { backgroundColor: `${colors.error}15` }]}>
                                <MaterialCommunityIcons name="alert-circle" size={20} color={colors.error} />
                                <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
                            </View>
                        </Animated.View>
                    )}

                    {/* Success Message */}
                    {success && (
                        <Animated.View entering={FadeIn.duration(300)}>
                            <View style={[styles.successContainer, { backgroundColor: `${colors.success}15` }]}>
                                <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />
                                <Text style={[styles.successText, { color: colors.success }]}>
                                    Transaction saved successfully!
                                </Text>
                            </View>
                        </Animated.View>
                    )}

                    {/* Submit Button */}
                    <Animated.View entering={FadeInDown.delay(400).duration(400)}>
                        <AnimatedButton
                            title={`Save ${type === 'expense' ? 'Expense' : 'Income'}`}
                            onPress={handleSubmit}
                            loading={loading}
                            disabled={!amount || !category || !description || success}
                            fullWidth
                            size="lg"
                            icon={type === 'expense' ? 'cash-minus' : 'cash-plus'}
                            variant={type === 'expense' ? 'primary' : 'secondary'}
                            style={styles.submitButton}
                        />
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingBottom: Spacing.xl,
        paddingHorizontal: Spacing.lg,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.xl,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    currencySymbol: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginRight: Spacing.xs,
    },
    amountInput: {
        backgroundColor: 'transparent',
        fontSize: 48,
        fontWeight: 'bold',
        minWidth: 150,
    },
    amountInputContent: {
        paddingVertical: 0,
    },
    formContainer: {
        flex: 1,
        marginTop: -Spacing.lg,
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: BorderRadius.xl,
        overflow: 'hidden',
    },
    scrollContent: {
        padding: Spacing.lg,
        paddingTop: Spacing.xl,
    },
    label: {
        marginBottom: Spacing.sm,
        fontWeight: '600',
    },
    segmentedButtons: {
        marginBottom: Spacing.xl,
    },
    categoryContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        marginBottom: Spacing.xl,
    },
    categoryChip: {
        marginBottom: Spacing.xs,
    },
    descriptionInput: {
        marginBottom: Spacing.xl,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.lg,
        gap: Spacing.sm,
    },
    errorText: {
        flex: 1,
        fontSize: 14,
    },
    successContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.lg,
        gap: Spacing.sm,
    },
    successText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
    },
    submitButton: {
        marginTop: Spacing.md,
    },
});
