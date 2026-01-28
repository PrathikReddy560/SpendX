// Premium Chat Bubble Component
// Glassmorphism bubbles with typewriter effect option

import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useTheme } from 'react-native-paper';
import { Colors } from '../../config/colors';
import { Typography } from '../../config/theme';

type TextVariant = 'displayLarge' | 'displayMedium' | 'displaySmall' |
  'headlineLarge' | 'headlineMedium' | 'headlineSmall' |
  'titleLarge' | 'titleMedium' | 'titleSmall' |
  'bodyLarge' | 'bodyMedium' | 'bodySmall' |
  'labelLarge' | 'labelMedium' | 'labelSmall';

interface ThemedTextProps extends RNTextProps {
  variant?: TextVariant;
  color?: 'primary' | 'secondary' | 'text' | 'textSecondary' | 'textTertiary' | 'error' | 'success';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
}

const variantStyles: Record<TextVariant, { fontSize: number; lineHeight: number; fontWeight: '400' | '500' | '600' | '700' }> = {
  displayLarge: { fontSize: 57, lineHeight: 64, fontWeight: '400' },
  displayMedium: { fontSize: 45, lineHeight: 52, fontWeight: '400' },
  displaySmall: { fontSize: 36, lineHeight: 44, fontWeight: '400' },
  headlineLarge: { fontSize: 32, lineHeight: 40, fontWeight: '600' },
  headlineMedium: { fontSize: 28, lineHeight: 36, fontWeight: '600' },
  headlineSmall: { fontSize: 24, lineHeight: 32, fontWeight: '600' },
  titleLarge: { fontSize: 22, lineHeight: 28, fontWeight: '500' },
  titleMedium: { fontSize: 16, lineHeight: 24, fontWeight: '500' },
  titleSmall: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  bodyLarge: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodyMedium: { fontSize: 14, lineHeight: 20, fontWeight: '400' },
  bodySmall: { fontSize: 12, lineHeight: 16, fontWeight: '400' },
  labelLarge: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  labelMedium: { fontSize: 12, lineHeight: 16, fontWeight: '500' },
  labelSmall: { fontSize: 11, lineHeight: 16, fontWeight: '500' },
};

const weightMap: Record<string, '400' | '500' | '600' | '700'> = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export function ThemedText({
  variant = 'bodyMedium',
  color = 'text',
  weight,
  align,
  style,
  children,
  ...props
}: ThemedTextProps) {
  const theme = useTheme();
  const isDark = theme.dark;
  const colors = isDark ? Colors.dark : Colors.light;

  const colorMap: Record<string, string> = {
    primary: colors.primary,
    secondary: colors.secondary,
    text: colors.text,
    textSecondary: colors.textSecondary,
    textTertiary: colors.textTertiary,
    error: colors.error,
    success: colors.success,
  };

  const fontWeight = weight ? weightMap[weight] : variantStyles[variant].fontWeight;

  return (
    <RNText
      style={[
        {
          fontSize: variantStyles[variant].fontSize,
          lineHeight: variantStyles[variant].lineHeight,
          fontWeight,
          color: colorMap[color],
          textAlign: align,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
}

export default ThemedText;
