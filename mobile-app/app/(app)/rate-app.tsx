// Rate the App Screen
// 5-star rating with feedback

import React, { useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Pressable,
    Alert,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import ResponsiveContainer from '../../src/components/layout/ResponsiveContainer';
import GlassCard from '../../src/components/ui/GlassCard';
import AnimatedButton from '../../src/components/ui/AnimatedButton';
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';

const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

export default function RateAppScreen() {
    const router = useRouter();
    const theme = useTheme();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;

    const [rating, setRating] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (rating === 0) {
            Alert.alert('Please Rate', 'Tap on the stars to rate the app');
            return;
        }
        setSubmitted(true);
        // In production, send to analytics/store
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
                        Rate SpendX
                    </Text>
                    <View style={{ width: 40 }} />
                </LinearGradient>

                {/* Content */}
                <View style={styles.content}>
                    {!submitted ? (
                        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                            <GlassCard padding="lg">
                                {/* Icon */}
                                <View style={styles.iconContainer}>
                                    <View style={[styles.iconCircle, { backgroundColor: `${colors.accent}15` }]}>
                                        <MaterialCommunityIcons name="star" size={50} color={colors.accent} />
                                    </View>
                                </View>

                                <Text variant="headlineSmall" style={[styles.title, { color: colors.text }]}>
                                    Enjoying SpendX?
                                </Text>
                                <Text variant="bodyMedium" style={[styles.subtitle, { color: colors.textSecondary }]}>
                                    Your feedback helps us improve! Tap the stars below to rate.
                                </Text>

                                {/* Stars */}
                                <View style={styles.starsContainer}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Pressable
                                            key={star}
                                            onPress={() => setRating(star)}
                                            style={styles.starButton}
                                        >
                                            <MaterialCommunityIcons
                                                name={star <= rating ? 'star' : 'star-outline'}
                                                size={48}
                                                color={star <= rating ? colors.accent : colors.textTertiary}
                                            />
                                        </Pressable>
                                    ))}
                                </View>

                                {/* Rating Label */}
                                {rating > 0 && (
                                    <Text variant="titleMedium" style={[styles.ratingLabel, { color: colors.accent }]}>
                                        {ratingLabels[rating]}
                                    </Text>
                                )}

                                {/* Submit Button */}
                                <View style={styles.buttonContainer}>
                                    <AnimatedButton
                                        onPress={handleSubmit}
                                        title="Submit Rating"
                                        icon="send"
                                        fullWidth
                                    />
                                </View>
                            </GlassCard>
                        </Animated.View>
                    ) : (
                        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                            <GlassCard padding="lg">
                                <View style={styles.iconContainer}>
                                    <View style={[styles.iconCircle, { backgroundColor: `${colors.success}15` }]}>
                                        <MaterialCommunityIcons name="check-circle" size={50} color={colors.success} />
                                    </View>
                                </View>

                                <Text variant="headlineSmall" style={[styles.title, { color: colors.text }]}>
                                    Thank You! 🎉
                                </Text>
                                <Text variant="bodyMedium" style={[styles.subtitle, { color: colors.textSecondary }]}>
                                    Your {rating}-star rating means a lot to us. We appreciate your support!
                                </Text>

                                {/* Show stars */}
                                <View style={styles.starsContainer}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <MaterialCommunityIcons
                                            key={star}
                                            name={star <= rating ? 'star' : 'star-outline'}
                                            size={36}
                                            color={star <= rating ? colors.accent : colors.textTertiary}
                                        />
                                    ))}
                                </View>

                                <View style={styles.buttonContainer}>
                                    <AnimatedButton
                                        onPress={() => router.push('/(app)/profile')}
                                        title="Back to Profile"
                                        icon="arrow-left"
                                        variant="outline"
                                        fullWidth
                                    />
                                </View>
                            </GlassCard>
                        </Animated.View>
                    )}
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
    iconContainer: {
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: Spacing.xs,
    },
    subtitle: {
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: Spacing.lg,
    },
    starsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    starButton: {
        padding: Spacing.xs,
    },
    ratingLabel: {
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: Spacing.lg,
    },
    buttonContainer: {
        marginTop: Spacing.md,
    },
});
