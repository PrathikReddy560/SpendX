// Premium Sidebar Component (Web/Tablet)
// Navigation sidebar for larger screens

import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { Text, Avatar, useTheme, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../config/colors';
import { Spacing, BorderRadius } from '../../config/theme';

interface NavItem {
    name: string;
    icon: string;
    route: string;
}

const navItems: NavItem[] = [
    { name: 'Dashboard', icon: 'view-dashboard', route: '/(app)' },
    { name: 'History', icon: 'history', route: '/(app)/history' },
    { name: 'AI Chat', icon: 'robot-outline', route: '/(app)/chat' },
    { name: 'Analysis', icon: 'chart-arc', route: '/(app)/analysis' },
    { name: 'Explore', icon: 'compass', route: '/(app)/explore' },
];

const bottomNavItems: NavItem[] = [
    { name: 'Profile', icon: 'account-circle-outline', route: '/(app)/profile' },
    { name: 'About', icon: 'information-outline', route: '/(app)/about' },
];

interface SidebarProps {
    collapsed?: boolean;
    onToggle?: () => void;
}

export default function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
    const theme = useTheme();
    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;

    const isActive = (route: string) => {
        if (route === '/(app)' && pathname === '/') return true;
        return pathname.startsWith(route);
    };

    const NavButton = ({ item }: { item: NavItem }) => {
        const active = isActive(item.route);

        return (
            <Pressable
                onPress={() => router.push(item.route as any)}
                style={({ pressed }) => [
                    styles.navItem,
                    active && { backgroundColor: `${colors.primary}15` },
                    pressed && { opacity: 0.7 },
                    collapsed && styles.navItemCollapsed,
                ]}
            >
                <MaterialCommunityIcons
                    name={item.icon as any}
                    size={22}
                    color={active ? colors.primary : colors.textSecondary}
                />
                {!collapsed && (
                    <Text
                        variant="bodyMedium"
                        style={[
                            styles.navText,
                            { color: active ? colors.primary : colors.text },
                            active && styles.navTextActive,
                        ]}
                    >
                        {item.name}
                    </Text>
                )}
                {active && !collapsed && (
                    <View style={[styles.activeIndicator, { backgroundColor: colors.primary }]} />
                )}
            </Pressable>
        );
    };

    return (
        <Animated.View
            entering={FadeIn.duration(300)}
            style={[
                styles.container,
                {
                    backgroundColor: colors.surface,
                    borderRightColor: colors.border,
                    width: collapsed ? 70 : 240,
                    paddingTop: insets.top + Spacing.md,
                    paddingBottom: insets.bottom + Spacing.md,
                },
            ]}
        >
            {/* Logo */}
            <Pressable style={styles.logoSection} onPress={onToggle}>
                <LinearGradient
                    colors={colors.gradients.primary as [string, string]}
                    style={styles.logoGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <MaterialCommunityIcons name="wallet" size={collapsed ? 24 : 28} color="#FFFFFF" />
                </LinearGradient>
                {!collapsed && (
                    <Text variant="titleLarge" style={[styles.logoText, { color: colors.text }]}>
                        SpendX
                    </Text>
                )}
            </Pressable>

            <Divider style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* Main Navigation */}
            <View style={styles.navSection}>
                {navItems.map((item) => (
                    <NavButton key={item.route} item={item} />
                ))}
            </View>

            {/* Spacer */}
            <View style={styles.spacer} />

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                {bottomNavItems.map((item) => (
                    <NavButton key={item.route} item={item} />
                ))}
            </View>

            <Divider style={[styles.divider, { backgroundColor: colors.border }]} />

            {/* User Section */}
            <Pressable
                style={[styles.userSection, collapsed && styles.userSectionCollapsed]}
                onPress={() => router.push('/(app)/profile')}
            >
                <Avatar.Image
                    size={collapsed ? 36 : 40}
                    source={{ uri: 'https://i.pravatar.cc/150?u=prath' }}
                />
                {!collapsed && (
                    <View style={styles.userInfo}>
                        <Text variant="titleSmall" style={{ color: colors.text }}>
                            Prath
                        </Text>
                        <Text variant="labelSmall" style={{ color: colors.textSecondary }}>
                            Premium
                        </Text>
                    </View>
                )}
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        borderRightWidth: 1,
        paddingHorizontal: Spacing.md,
    },
    logoSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.sm,
    },
    logoGradient: {
        width: 44,
        height: 44,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontWeight: 'bold',
    },
    divider: {
        marginVertical: Spacing.md,
    },
    navSection: {
        gap: Spacing.xs,
    },
    navItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.lg,
        position: 'relative',
    },
    navItemCollapsed: {
        justifyContent: 'center',
        paddingHorizontal: Spacing.sm,
    },
    navText: {
        flex: 1,
    },
    navTextActive: {
        fontWeight: '600',
    },
    activeIndicator: {
        position: 'absolute',
        right: 0,
        width: 3,
        height: 20,
        borderRadius: 2,
    },
    spacer: {
        flex: 1,
    },
    bottomNav: {
        gap: Spacing.xs,
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        padding: Spacing.sm,
        borderRadius: BorderRadius.lg,
    },
    userSectionCollapsed: {
        justifyContent: 'center',
        padding: Spacing.xs,
    },
    userInfo: {
        flex: 1,
    },
});
