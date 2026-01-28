// App Footer Component
// Copyright and version info

import React from 'react';
import { View, StyleSheet, Linking, Pressable, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BorderRadius, Spacing } from '../../config/theme';
import { Colors } from '../../config/colors';

interface FooterProps {
    style?: ViewStyle;
    showSocials?: boolean;
    compact?: boolean;
}

export default function Footer({
    style,
    showSocials = true,
    compact = false,
}: FooterProps) {
    const theme = useTheme();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;

    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: 'twitter', url: 'https://twitter.com/spendx' },
        { icon: 'linkedin', url: 'https://linkedin.com/company/spendx' },
        { icon: 'github', url: 'https://github.com/spendx' },
    ];

    const handleLinkPress = (url: string) => {
        Linking.openURL(url);
    };

    if (compact) {
        return (
            <View style={[styles.compactContainer, { borderTopColor: colors.border }, style]}>
                <Text style={[styles.copyright, { color: colors.textTertiary }]}>
                    © {currentYear} SpendX Inc.
                </Text>
            </View>
        );
    }

    return (
        <View
            style={[
                styles.container,
                { backgroundColor: colors.surfaceVariant, borderTopColor: colors.border },
                style,
            ]}
        >
            {/* Logo and tagline */}
            <View style={styles.brandSection}>
                <View style={styles.logoRow}>
                    <MaterialCommunityIcons
                        name="wallet"
                        size={24}
                        color={colors.primary}
                    />
                    <Text style={[styles.brandName, { color: colors.text }]}>
                        SpendX
                    </Text>
                </View>
                <Text style={[styles.tagline, { color: colors.textSecondary }]}>
                    AI-Powered Smart Finance
                </Text>
            </View>

            {/* Social Links */}
            {showSocials && (
                <View style={styles.socialSection}>
                    {socialLinks.map((social) => (
                        <Pressable
                            key={social.icon}
                            onPress={() => handleLinkPress(social.url)}
                            style={({ pressed }) => [
                                styles.socialButton,
                                {
                                    backgroundColor: isDark
                                        ? 'rgba(255, 255, 255, 0.05)'
                                        : 'rgba(0, 0, 0, 0.03)',
                                    opacity: pressed ? 0.7 : 1,
                                },
                            ]}
                        >
                            <MaterialCommunityIcons
                                name={social.icon as any}
                                size={20}
                                color={colors.textSecondary}
                            />
                        </Pressable>
                    ))}
                </View>
            )}

            {/* Copyright and links */}
            <View style={styles.bottomSection}>
                <Text style={[styles.copyright, { color: colors.textTertiary }]}>
                    © {currentYear} SpendX Inc. All rights reserved.
                </Text>
                <View style={styles.linksRow}>
                    <Pressable onPress={() => handleLinkPress('https://spendx.io/privacy')}>
                        <Text style={[styles.link, { color: colors.textSecondary }]}>
                            Privacy
                        </Text>
                    </Pressable>
                    <Text style={[styles.divider, { color: colors.textTertiary }]}>•</Text>
                    <Pressable onPress={() => handleLinkPress('https://spendx.io/terms')}>
                        <Text style={[styles.link, { color: colors.textSecondary }]}>
                            Terms
                        </Text>
                    </Pressable>
                    <Text style={[styles.divider, { color: colors.textTertiary }]}>•</Text>
                    <Text style={[styles.version, { color: colors.textTertiary }]}>
                        v2.0.0
                    </Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: Spacing.xl,
        borderTopWidth: 1,
        gap: Spacing.lg,
    },
    compactContainer: {
        padding: Spacing.md,
        borderTopWidth: 1,
        alignItems: 'center',
    },
    brandSection: {
        alignItems: 'center',
        gap: Spacing.xs,
    },
    logoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    brandName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    tagline: {
        fontSize: 13,
    },
    socialSection: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.md,
    },
    socialButton: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomSection: {
        alignItems: 'center',
        gap: Spacing.sm,
    },
    copyright: {
        fontSize: 12,
    },
    linksRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    link: {
        fontSize: 12,
        fontWeight: '500',
    },
    divider: {
        fontSize: 10,
    },
    version: {
        fontSize: 11,
    },
});
