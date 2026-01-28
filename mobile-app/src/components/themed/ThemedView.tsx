// Enhanced Themed View Component
// Container with theme-aware background

import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Colors } from '../../config/colors';
import { BorderRadius, Spacing } from '../../config/theme';

interface ThemedViewProps extends ViewProps {
  variant?: 'default' | 'surface' | 'surfaceVariant' | 'card' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  flex?: boolean;
  center?: boolean;
}

export function ThemedView({
  variant = 'default',
  padding = 'none',
  rounded = 'none',
  flex = false,
  center = false,
  style,
  children,
  ...props
}: ThemedViewProps) {
  const theme = useTheme();
  const isDark = theme.dark;
  const colors = isDark ? Colors.dark : Colors.light;

  const backgroundColors: Record<string, string> = {
    default: colors.background,
    surface: colors.surface,
    surfaceVariant: colors.surfaceVariant,
    card: colors.card,
    elevated: colors.surfaceElevated,
  };

  const paddingValues: Record<string, number> = {
    none: 0,
    sm: Spacing.sm,
    md: Spacing.md,
    lg: Spacing.lg,
    xl: Spacing.xl,
  };

  const borderRadiusValues: Record<string, number> = {
    none: 0,
    sm: BorderRadius.sm,
    md: BorderRadius.md,
    lg: BorderRadius.lg,
    xl: BorderRadius.xl,
    full: BorderRadius.full,
  };

  return (
    <View
      style={[
        {
          backgroundColor: backgroundColors[variant],
          padding: paddingValues[padding],
          borderRadius: borderRadiusValues[rounded],
        },
        flex && styles.flex,
        center && styles.center,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ThemedView;
