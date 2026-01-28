// Enhanced Theme Color Hook
// Returns specific theme colors

import { useTheme } from 'react-native-paper';
import { Colors } from '../config/colors';

/**
 * Returns a specific color from the current theme
 */
export function useThemeColor(
  colorName: keyof typeof Colors.light,
  props?: { light?: string; dark?: string }
) {
  const theme = useTheme();
  const isDark = theme.dark;
  const colors = isDark ? Colors.dark : Colors.light;

  // If custom colors provided, use them
  if (props) {
    const colorFromProps = isDark ? props.dark : props.light;
    if (colorFromProps) return colorFromProps;
  }

  return colors[colorName] as string;
}

/**
 * Returns all theme colors
 */
export function useColors() {
  const theme = useTheme();
  const isDark = theme.dark;
  return isDark ? Colors.dark : Colors.light;
}

export default useThemeColor;
