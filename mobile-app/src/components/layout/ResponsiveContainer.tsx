// Premium Responsive Container with Glassmorphism Support
// Enhanced breakpoints and adaptive layouts

import React from 'react';
import { View, StyleSheet, Platform, Dimensions, useWindowDimensions } from 'react-native';
import { useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, getColors } from '../../config/colors';
import { Breakpoints, BorderRadius } from '../../config/theme';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: any;
  withGlass?: boolean;
  noPadding?: boolean;
  fullWidth?: boolean;
  edges?: ('top' | 'right' | 'bottom' | 'left')[];
}

export default function ResponsiveContainer({
  children,
  style,
  withGlass = false,
  noPadding = false,
  fullWidth = true, // Default to true for mobile-first
  edges = ['top', 'bottom', 'left', 'right'], // Include bottom for footer visibility
}: ResponsiveContainerProps) {
  const theme = useTheme();
  const { width } = useWindowDimensions();

  // Responsive breakpoints
  const isMobile = width < Breakpoints.tablet;
  const isTablet = width >= Breakpoints.tablet && width < Breakpoints.desktop;
  const isDesktop = width >= Breakpoints.desktop;

  // Determine max width based on screen size
  const getMaxWidth = () => {
    if (fullWidth || isMobile) return '100%'; // Always full width on mobile
    if (isDesktop) return 1200;
    if (isTablet) return 800;
    return '100%';
  };

  // Determine padding based on screen size
  const getPadding = () => {
    if (noPadding) return 0;
    if (isDesktop) return 32;
    if (isTablet) return 24;
    return 0; // No horizontal padding on mobile - let content control it
  };

  const containerStyle = [
    styles.container,
    {
      maxWidth: getMaxWidth(),
      paddingHorizontal: getPadding(),
      backgroundColor: theme.colors.background,
    },
    isDesktop && styles.desktopContainer,
    isTablet && styles.tabletContainer,
    style,
  ];

  const glassStyle = withGlass ? [
    styles.glassEffect,
    {
      backgroundColor: theme.dark
        ? 'rgba(30, 41, 59, 0.7)'
        : 'rgba(255, 255, 255, 0.7)',
      borderColor: theme.dark
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(255, 255, 255, 0.5)',
    },
  ] : null;

  return (
    <View style={[styles.background, { backgroundColor: theme.colors.background }]}>
      <SafeAreaView
        style={styles.safeArea}
        edges={edges}
      >
        <View style={[containerStyle, glassStyle]}>
          {children}
        </View>
      </SafeAreaView>
    </View>
  );
}

// Hook for responsive values
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return {
    width,
    height,
    isMobile: width < Breakpoints.tablet,
    isTablet: width >= Breakpoints.tablet && width < Breakpoints.desktop,
    isDesktop: width >= Breakpoints.desktop,
    isWide: width >= Breakpoints.wide,
    isLandscape: width > height,

    // Helper to return different values based on breakpoint
    select: <T,>(options: { mobile?: T; tablet?: T; desktop?: T; default: T }): T => {
      if (width >= Breakpoints.desktop && options.desktop !== undefined) {
        return options.desktop;
      }
      if (width >= Breakpoints.tablet && options.tablet !== undefined) {
        return options.tablet;
      }
      if (width < Breakpoints.tablet && options.mobile !== undefined) {
        return options.mobile;
      }
      return options.default;
    },

    // Grid columns based on breakpoint
    gridColumns: width >= Breakpoints.desktop ? 3 : width >= Breakpoints.tablet ? 2 : 1,
  };
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
  tabletContainer: {
    paddingHorizontal: 24,
  },
  desktopContainer: {
    paddingHorizontal: 32,
  },
  glassEffect: {
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    ...(Platform.OS === 'web' ? {
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    } : {}),
  },
});