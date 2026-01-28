// Premium Theme System for SpendX
// Typography, spacing, shadows, and design tokens

import { Platform } from 'react-native';

// Typography Scale
export const Typography = {
  // Font Families
  fontFamily: Platform.select({
    ios: {
      regular: 'System',
      medium: 'System',
      semibold: 'System',
      bold: 'System',
    },
    android: {
      regular: 'Roboto',
      medium: 'Roboto-Medium',
      semibold: 'Roboto-Medium',
      bold: 'Roboto-Bold',
    },
    default: {
      regular: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      medium: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      semibold: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      bold: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
  }),

  // Font Sizes
  sizes: {
    displayLarge: 57,
    displayMedium: 45,
    displaySmall: 36,
    headlineLarge: 32,
    headlineMedium: 28,
    headlineSmall: 24,
    titleLarge: 22,
    titleMedium: 16,
    titleSmall: 14,
    bodyLarge: 16,
    bodyMedium: 14,
    bodySmall: 12,
    labelLarge: 14,
    labelMedium: 12,
    labelSmall: 11,
    caption: 10,
  },

  // Line Heights
  lineHeights: {
    displayLarge: 64,
    displayMedium: 52,
    displaySmall: 44,
    headlineLarge: 40,
    headlineMedium: 36,
    headlineSmall: 32,
    titleLarge: 28,
    titleMedium: 24,
    titleSmall: 20,
    bodyLarge: 24,
    bodyMedium: 20,
    bodySmall: 16,
    labelLarge: 20,
    labelMedium: 16,
    labelSmall: 16,
    caption: 14,
  },

  // Font Weights
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },

  // Letter Spacing
  letterSpacing: {
    tight: -0.5,
    normal: 0,
    wide: 0.5,
    wider: 1,
  },
};

// Spacing Scale (4px base unit)
export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '7xl': 80,
  '8xl': 96,
};

// Border Radius
export const BorderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// Shadows
export const Shadows = Platform.select({
  ios: {
    none: {},
    xs: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
    },
    glow: {
      shadowColor: '#6366F1',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
    },
    glowSuccess: {
      shadowColor: '#22C55E',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
    },
    glowError: {
      shadowColor: '#EF4444',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
    },
  },
  android: {
    none: { elevation: 0 },
    xs: { elevation: 1 },
    sm: { elevation: 2 },
    md: { elevation: 4 },
    lg: { elevation: 8 },
    xl: { elevation: 12 },
    glow: { elevation: 8 },
    glowSuccess: { elevation: 8 },
    glowError: { elevation: 8 },
  },
  default: {
    none: {},
    xs: { boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
    sm: { boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.08)' },
    md: { boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.1)' },
    lg: { boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.12)' },
    xl: { boxShadow: '0 12px 24px 0 rgba(0, 0, 0, 0.15)' },
    glow: { boxShadow: '0 4px 20px 0 rgba(99, 102, 241, 0.3)' },
    glowSuccess: { boxShadow: '0 4px 20px 0 rgba(34, 197, 94, 0.3)' },
    glowError: { boxShadow: '0 4px 20px 0 rgba(239, 68, 68, 0.3)' },
  },
});

// Animation Durations
export const Duration = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
  lazy: 750,
};

// Breakpoints for responsive design
export const Breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
  ultraWide: 1536,
};

// Z-Index scale
export const ZIndex = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
};

// Icon Sizes
export const IconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
};

// Button variants configuration
export const ButtonConfig = {
  heights: {
    sm: 36,
    md: 44,
    lg: 52,
    xl: 60,
  },
  paddingHorizontal: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
  fontSize: {
    sm: 13,
    md: 14,
    lg: 16,
    xl: 18,
  },
  iconSize: {
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24,
  },
};

// Input configuration
export const InputConfig = {
  heights: {
    sm: 40,
    md: 48,
    lg: 56,
  },
  fontSize: {
    sm: 14,
    md: 16,
    lg: 18,
  },
  borderWidth: 1,
  focusBorderWidth: 2,
};

// Card configuration
export const CardConfig = {
  padding: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
  },
  borderRadius: BorderRadius.xl,
  borderWidth: 1,
};

// Avatar sizes
export const AvatarSizes = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
  '2xl': 80,
  '3xl': 96,
  '4xl': 128,
};

// Export combined theme object
export const Theme = {
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  duration: Duration,
  breakpoints: Breakpoints,
  zIndex: ZIndex,
  iconSizes: IconSizes,
  buttonConfig: ButtonConfig,
  inputConfig: InputConfig,
  cardConfig: CardConfig,
  avatarSizes: AvatarSizes,
};
