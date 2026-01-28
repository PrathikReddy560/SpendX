// Premium Modal Screen
// Quick add expense modal

import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, TextInput, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlassCard from '../src/components/ui/GlassCard';
import AnimatedButton from '../src/components/ui/AnimatedButton';
import CategoryChip from '../src/components/ui/CategoryChip';
import { Colors } from '../src/config/colors';
import { Spacing, BorderRadius } from '../src/config/theme';

const categories = [
  { id: 'food', label: 'Food', icon: 'food', color: '#EF4444' },
  { id: 'transport', label: 'Transport', icon: 'car', color: '#3B82F6' },
  { id: 'shopping', label: 'Shopping', icon: 'shopping', color: '#8B5CF6' },
  { id: 'bills', label: 'Bills', icon: 'file-document', color: '#F59E0B' },
  { id: 'entertainment', label: 'Entertainment', icon: 'movie', color: '#EC4899' },
  { id: 'health', label: 'Health', icon: 'medical-bag', color: '#10B981' },
];

export default function Modal() {
  const router = useRouter();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const isDark = theme.dark;
  const colors = isDark ? Colors.dark : Colors.light;

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('food');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!amount) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.back();
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
      <Pressable style={styles.backdrop} onPress={() => router.back()} />

      <Animated.View
        entering={SlideInDown.duration(300)}
        style={[styles.modal, { backgroundColor: colors.surface, paddingBottom: insets.bottom + Spacing.lg }]}
      >
        {/* Handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.header}>
          <Text variant="titleLarge" style={{ color: colors.text, fontWeight: 'bold' }}>
            Add Expense
          </Text>
          <Pressable onPress={() => router.back()}>
            <MaterialCommunityIcons name="close" size={24} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Amount */}
        <View style={styles.amountContainer}>
          <Text style={[styles.currencySymbol, { color: colors.textSecondary }]}>$</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
            style={[styles.amountInput, { color: colors.text }]}
            placeholderTextColor={colors.textTertiary}
            mode="flat"
            underlineColor="transparent"
            activeUnderlineColor="transparent"
          />
        </View>

        {/* Description */}
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="What was this for?"
          mode="outlined"
          style={styles.descriptionInput}
          outlineStyle={{ borderRadius: BorderRadius.lg }}
        />

        {/* Categories */}
        <Text variant="labelLarge" style={[styles.categoryLabel, { color: colors.textSecondary }]}>
          Category
        </Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <CategoryChip
              key={category.id}
              id={category.id}
              label={category.label}
              icon={category.icon}
              selected={selectedCategory === category.id}
              onPress={() => setSelectedCategory(category.id)}
            />
          ))}
        </View>

        {/* Save Button */}
        <AnimatedButton
          title="Save Expense"
          onPress={handleSave}
          loading={loading}
          disabled={!amount}
          fullWidth
          size="lg"
          icon="check"
          style={styles.saveButton}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.lg,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '300',
    marginRight: Spacing.sm,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: 'transparent',
    minWidth: 150,
  },
  descriptionInput: {
    marginBottom: Spacing.xl,
  },
  categoryLabel: {
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  saveButton: {
    marginTop: Spacing.md,
  },
});
