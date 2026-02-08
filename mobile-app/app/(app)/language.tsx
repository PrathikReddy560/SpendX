// Language Selection Screen
// Supports English, Hindi, Kannada, Telugu

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

const LANGUAGE_KEY = 'spendx_language';

interface Language {
    code: string;
    name: string;
    nativeName: string;
}

const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
];

export default function LanguageScreen() {
    const router = useRouter();
    const theme = useTheme();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;

    const [selectedLanguage, setSelectedLanguage] = useState('en');

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (saved) setSelectedLanguage(saved);
    };

    const handleLanguageChange = async (code: string) => {
        setSelectedLanguage(code);
        await AsyncStorage.setItem(LANGUAGE_KEY, code);
        // In a full i18n implementation, this would trigger a language change
        // For now, we just save the preference
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
                        Language
                    </Text>
                    <View style={{ width: 40 }} />
                </LinearGradient>

                {/* Language Options */}
                <View style={styles.content}>
                    <Animated.View entering={FadeInDown.delay(100).duration(400)}>
                        <GlassCard padding="none">
                            <RadioButton.Group
                                onValueChange={handleLanguageChange}
                                value={selectedLanguage}
                            >
                                {languages.map((lang, index) => (
                                    <View key={lang.code}>
                                        <Pressable
                                            style={styles.languageItem}
                                            onPress={() => handleLanguageChange(lang.code)}
                                        >
                                            <View style={styles.languageInfo}>
                                                <Text variant="bodyLarge" style={[styles.languageName, { color: colors.text }]}>
                                                    {lang.name}
                                                </Text>
                                                <Text variant="bodyMedium" style={{ color: colors.textSecondary }}>
                                                    {lang.nativeName}
                                                </Text>
                                            </View>
                                            <RadioButton value={lang.code} color={colors.primary} />
                                        </Pressable>
                                        {index < languages.length - 1 && (
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
                            Changing language will update the app interface. Some content may remain in the original language.
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
    languageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
    },
    languageInfo: {
        flex: 1,
    },
    languageName: {
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
