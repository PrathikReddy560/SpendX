// Auth Stack Layout
// Handles login/signup navigation

import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { Colors } from '../../src/config/colors';

export default function AuthLayout() {
    const theme = useTheme();
    const isDark = theme.dark;
    const colors = isDark ? Colors.dark : Colors.light;

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'fade_from_bottom',
                contentStyle: {
                    backgroundColor: colors.background,
                },
            }}
        >
            <Stack.Screen name="login" />
            <Stack.Screen name="signup" />
        </Stack>
    );
}

