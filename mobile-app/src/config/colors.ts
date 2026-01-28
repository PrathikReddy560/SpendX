// Premium Color System for SpendX
// Comprehensive color palette with gradients, glassmorphism, and semantic colors

export const Colors = {
  light: {
    // Core colors
    background: '#FAFBFC',
    surface: '#FFFFFF',
    surfaceVariant: '#F4F6F9',
    surfaceElevated: '#FFFFFF',

    // Primary palette - Indigo
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    primaryContainer: '#E0E7FF',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#312E81',

    // Secondary palette - Emerald
    secondary: '#10B981',
    secondaryLight: '#34D399',
    secondaryDark: '#059669',
    secondaryContainer: '#D1FAE5',
    onSecondary: '#FFFFFF',
    onSecondaryContainer: '#064E3B',

    // Accent palette - Amber
    accent: '#F59E0B',
    accentLight: '#FBBF24',
    accentDark: '#D97706',
    accentContainer: '#FEF3C7',

    // Text colors
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    textInverse: '#FFFFFF',

    // Semantic colors
    success: '#22C55E',
    successContainer: '#DCFCE7',
    warning: '#F59E0B',
    warningContainer: '#FEF3C7',
    error: '#EF4444',
    errorContainer: '#FEE2E2',
    info: '#3B82F6',
    infoContainer: '#DBEAFE',

    // Chart colors
    chart: {
      blue: '#3B82F6',
      green: '#22C55E',
      yellow: '#EAB308',
      red: '#EF4444',
      purple: '#8B5CF6',
      pink: '#EC4899',
      orange: '#F97316',
      teal: '#14B8A6',
    },

    // Category colors
    categories: {
      food: '#EF4444',
      transport: '#3B82F6',
      shopping: '#8B5CF6',
      entertainment: '#EC4899',
      bills: '#F59E0B',
      health: '#22C55E',
      education: '#06B6D4',
      other: '#6B7280',
    },

    // Border & dividers
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    divider: '#E5E7EB',

    // States
    disabled: '#D1D5DB',
    disabledText: '#9CA3AF',

    // Glassmorphism
    glass: 'rgba(255, 255, 255, 0.7)',
    glassLight: 'rgba(255, 255, 255, 0.4)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',

    // Shadows (for web)
    shadow: 'rgba(0, 0, 0, 0.1)',
    shadowDark: 'rgba(0, 0, 0, 0.2)',

    // Tab & Navigation
    tabBar: '#FFFFFF',
    tabBarBorder: '#E5E7EB',
    tabActive: '#6366F1',
    tabInactive: '#9CA3AF',

    // Input
    inputBackground: '#F9FAFB',
    inputBorder: '#D1D5DB',
    inputFocusBorder: '#6366F1',
    placeholder: '#9CA3AF',

    // Card
    card: '#FFFFFF',
    cardElevated: '#FFFFFF',

    // Gradient presets
    gradients: {
      primary: ['#6366F1', '#4F46E5'],
      primaryDark: ['#4F46E5', '#312E81'],
      secondary: ['#10B981', '#059669'],
      accent: ['#F59E0B', '#D97706'],
      sunset: ['#F59E0B', '#EF4444'],
      ocean: ['#06B6D4', '#3B82F6'],
      purple: ['#8B5CF6', '#6366F1'],
      dark: ['#1F2937', '#111827'],
    },
  },

  dark: {
    // Core colors
    background: '#0F172A',
    surface: '#1E293B',
    surfaceVariant: '#334155',
    surfaceElevated: '#1E293B',

    // Primary palette - Indigo
    primary: '#818CF8',
    primaryLight: '#A5B4FC',
    primaryDark: '#6366F1',
    primaryContainer: '#312E81',
    onPrimary: '#1E1B4B',
    onPrimaryContainer: '#E0E7FF',

    // Secondary palette - Emerald
    secondary: '#34D399',
    secondaryLight: '#6EE7B7',
    secondaryDark: '#10B981',
    secondaryContainer: '#064E3B',
    onSecondary: '#022C22',
    onSecondaryContainer: '#D1FAE5',

    // Accent palette - Amber
    accent: '#FBBF24',
    accentLight: '#FCD34D',
    accentDark: '#F59E0B',
    accentContainer: '#78350F',

    // Text colors
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    textInverse: '#0F172A',

    // Semantic colors
    success: '#4ADE80',
    successContainer: '#14532D',
    warning: '#FBBF24',
    warningContainer: '#78350F',
    error: '#F87171',
    errorContainer: '#7F1D1D',
    info: '#60A5FA',
    infoContainer: '#1E3A8A',

    // Chart colors
    chart: {
      blue: '#60A5FA',
      green: '#4ADE80',
      yellow: '#FACC15',
      red: '#F87171',
      purple: '#A78BFA',
      pink: '#F472B6',
      orange: '#FB923C',
      teal: '#2DD4BF',
    },

    // Category colors
    categories: {
      food: '#F87171',
      transport: '#60A5FA',
      shopping: '#A78BFA',
      entertainment: '#F472B6',
      bills: '#FBBF24',
      health: '#4ADE80',
      education: '#22D3EE',
      other: '#94A3B8',
    },

    // Border & dividers
    border: '#334155',
    borderLight: '#475569',
    divider: '#334155',

    // States
    disabled: '#475569',
    disabledText: '#64748B',

    // Glassmorphism
    glass: 'rgba(30, 41, 59, 0.8)',
    glassLight: 'rgba(30, 41, 59, 0.5)',
    glassBorder: 'rgba(255, 255, 255, 0.1)',

    // Shadows (for web)
    shadow: 'rgba(0, 0, 0, 0.3)',
    shadowDark: 'rgba(0, 0, 0, 0.5)',

    // Tab & Navigation
    tabBar: '#1E293B',
    tabBarBorder: '#334155',
    tabActive: '#818CF8',
    tabInactive: '#64748B',

    // Input
    inputBackground: '#1E293B',
    inputBorder: '#475569',
    inputFocusBorder: '#818CF8',
    placeholder: '#64748B',

    // Card
    card: '#1E293B',
    cardElevated: '#334155',

    // Gradient presets
    gradients: {
      primary: ['#818CF8', '#6366F1'],
      primaryDark: ['#6366F1', '#4338CA'],
      secondary: ['#34D399', '#10B981'],
      accent: ['#FBBF24', '#F59E0B'],
      sunset: ['#FBBF24', '#F87171'],
      ocean: ['#22D3EE', '#60A5FA'],
      purple: ['#A78BFA', '#818CF8'],
      dark: ['#334155', '#1E293B'],
    },
  },
};

// Helper to get color based on theme
export const getColors = (isDark: boolean) => isDark ? Colors.dark : Colors.light;