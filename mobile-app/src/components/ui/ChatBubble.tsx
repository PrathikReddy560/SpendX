// Premium Chat Bubble Component
// Glassmorphism bubbles with typewriter effect option

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { Text, Avatar, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { BorderRadius, Spacing, Shadows } from '../../config/theme';
import { Colors } from '../../config/colors';
import { Animations } from '../../config/animations';

interface ChatBubbleProps {
    message: string;
    sender: 'user' | 'ai';
    timestamp?: string;
    isTyping?: boolean;
    showAvatar?: boolean;
    style?: ViewStyle;
    delay?: number;
}

export default function ChatBubble({
    message,
    sender,
    timestamp,
    isTyping = false,
    showAvatar = true,
    style,
    delay = 0,
}: ChatBubbleProps) {
    const theme = useTheme();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;
    const isAI = sender === 'ai';

    // Typewriter effect state
    const [displayedText, setDisplayedText] = useState(isTyping ? '' : message);

    useEffect(() => {
        if (isTyping && isAI) {
            let index = 0;
            setDisplayedText('');

            const interval = setInterval(() => {
                if (index < message.length) {
                    setDisplayedText(prev => prev + message[index]);
                    index++;
                } else {
                    clearInterval(interval);
                }
            }, Animations.typing.charDelay);

            return () => clearInterval(interval);
        } else {
            setDisplayedText(message);
        }
    }, [message, isTyping, isAI]);

    return (
        <Animated.View
            entering={isAI ? FadeInUp.delay(delay).duration(300) : FadeInDown.delay(delay).duration(300)}
            style={[
                styles.container,
                { justifyContent: isAI ? 'flex-start' : 'flex-end' },
                style,
            ]}
        >
            {isAI && showAvatar && (
                <View style={styles.avatarContainer}>
                    <Avatar.Icon
                        size={36}
                        icon="robot"
                        style={[styles.avatar, { backgroundColor: colors.primary }]}
                    />
                </View>
            )}

            <View style={styles.bubbleWrapper}>
                <View
                    style={[
                        styles.bubble,
                        isAI ? styles.aiBubble : styles.userBubble,
                        {
                            backgroundColor: isAI
                                ? isDark
                                    ? 'rgba(51, 65, 85, 0.9)'
                                    : 'rgba(241, 245, 249, 0.95)'
                                : colors.primary,
                            borderColor: isAI
                                ? isDark
                                    ? 'rgba(255, 255, 255, 0.08)'
                                    : 'rgba(0, 0, 0, 0.05)'
                                : 'transparent',
                        },
                        Platform.OS === 'web' && isAI && styles.webGlassBubble,
                    ]}
                >
                    <Text
                        style={[
                            styles.message,
                            { color: isAI ? colors.text : '#FFFFFF' },
                        ]}
                    >
                        {displayedText}
                        {isTyping && isAI && displayedText.length < message.length && (
                            <Text style={styles.cursor}>|</Text>
                        )}
                    </Text>
                </View>

                {timestamp && (
                    <Text
                        style={[
                            styles.timestamp,
                            {
                                color: colors.textTertiary,
                                alignSelf: isAI ? 'flex-start' : 'flex-end',
                            },
                        ]}
                    >
                        {timestamp}
                    </Text>
                )}
            </View>

            {!isAI && showAvatar && (
                <View style={styles.avatarContainer}>
                    <Avatar.Text
                        size={36}
                        label="U"
                        style={[styles.avatar, { backgroundColor: colors.secondary }]}
                    />
                </View>
            )}
        </Animated.View>
    );
}

// Suggestion Chips Component
interface SuggestionChipsProps {
    suggestions: string[];
    onSelect: (suggestion: string) => void;
}

export function SuggestionChips({ suggestions, onSelect }: SuggestionChipsProps) {
    const theme = useTheme();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;

    return (
        <View style={styles.suggestionsContainer}>
            {suggestions.map((suggestion, index) => (
                <Animated.View
                    key={suggestion}
                    entering={FadeInUp.delay(index * 50).duration(200)}
                >
                    <View
                        style={[
                            styles.suggestionChip,
                            {
                                backgroundColor: isDark
                                    ? 'rgba(99, 102, 241, 0.15)'
                                    : 'rgba(99, 102, 241, 0.1)',
                                borderColor: colors.primary,
                            },
                        ]}
                    >
                        <Text
                            style={[styles.suggestionText, { color: colors.primary }]}
                            onPress={() => onSelect(suggestion)}
                        >
                            {suggestion}
                        </Text>
                    </View>
                </Animated.View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginBottom: Spacing.md,
        paddingHorizontal: Spacing.sm,
    },
    avatarContainer: {
        marginTop: 4,
    },
    avatar: {},
    bubbleWrapper: {
        flex: 1,
        maxWidth: '80%',
        marginHorizontal: Spacing.sm,
    },
    bubble: {
        padding: Spacing.md,
        borderWidth: 1,
        ...Shadows?.xs,
    },
    aiBubble: {
        borderTopLeftRadius: Spacing.xs,
        borderTopRightRadius: BorderRadius.xl,
        borderBottomRightRadius: BorderRadius.xl,
        borderBottomLeftRadius: BorderRadius.xl,
    },
    userBubble: {
        borderTopLeftRadius: BorderRadius.xl,
        borderTopRightRadius: Spacing.xs,
        borderBottomRightRadius: BorderRadius.xl,
        borderBottomLeftRadius: BorderRadius.xl,
    },
    message: {
        fontSize: 15,
        lineHeight: 22,
    },
    cursor: {
        opacity: 0.5,
    },
    timestamp: {
        fontSize: 11,
        marginTop: Spacing.xs,
        paddingHorizontal: Spacing.xs,
    },
    suggestionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.md,
        marginTop: Spacing.sm,
    },
    suggestionChip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
    },
    suggestionText: {
        fontSize: 13,
        fontWeight: '500',
    },
    webGlassBubble: {
        // Web-specific glass effect - these properties are web-only
        // @ts-ignore - backdropFilter is a web CSS property
        backdropFilter: 'blur(10px)',
    },
});

