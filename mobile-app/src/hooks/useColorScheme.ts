// Enhanced Color Scheme Hook
// Returns color scheme with persistence support

import { useColorScheme as useRNColorScheme } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../app/_layout';

export function useColorScheme() {
    const systemScheme = useRNColorScheme();
    const { isDark } = useContext(ThemeContext);

    // User preference takes precedence over system
    return isDark ? 'dark' : 'light';
}

export default useColorScheme;
