// Root Layout with Theme Persistence
// Enhanced theme context and splash screen handling

import React, { useState, useMemo, useEffect, createContext } from 'react';
import { Stack } from 'expo-router';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { DarkTheme as NavDarkTheme, DefaultTheme as NavDefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '../src/config/colors';

// Keep splash screen visible while loading
SplashScreen.preventAutoHideAsync();

// Theme Context
export const ThemeContext = createContext({
  toggleTheme: () => { },
  isDark: false,
  setTheme: (dark: boolean) => { },
});

export default function RootLayout() {
  const [isDark, setIsDark] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // Load theme preference (could use AsyncStorage in production)
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // In production, load from AsyncStorage:
        // const savedTheme = await AsyncStorage.getItem('theme');
        // setIsDark(savedTheme === 'dark');
        setIsReady(true);
        await SplashScreen.hideAsync();
      } catch (e) {
        console.error('Failed to load theme:', e);
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newValue = !prev;
      // In production, save to AsyncStorage:
      // AsyncStorage.setItem('theme', newValue ? 'dark' : 'light');
      return newValue;
    });
  };

  const setTheme = (dark: boolean) => {
    setIsDark(dark);
    // AsyncStorage.setItem('theme', dark ? 'dark' : 'light');
  };

  // Custom Paper Theme
  const paperTheme = useMemo(() => {
    const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
    const customColors = isDark ? Colors.dark : Colors.light;

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: customColors.primary,
        primaryContainer: customColors.primaryContainer,
        secondary: customColors.secondary,
        secondaryContainer: customColors.secondaryContainer,
        background: customColors.background,
        surface: customColors.surface,
        surfaceVariant: customColors.surfaceVariant,
        error: customColors.error,
        errorContainer: customColors.errorContainer,
        onPrimary: customColors.onPrimary,
        onPrimaryContainer: customColors.onPrimaryContainer,
        onSecondary: customColors.onSecondary,
        onSecondaryContainer: customColors.onSecondaryContainer,
        onBackground: customColors.text,
        onSurface: customColors.text,
        onSurfaceVariant: customColors.textSecondary,
        outline: customColors.border,
        outlineVariant: customColors.borderLight,
      },
      dark: isDark,
    };
  }, [isDark]);

  // Navigation Theme
  const navTheme = useMemo(() => {
    const customColors = isDark ? Colors.dark : Colors.light;
    const baseNavTheme = isDark ? NavDarkTheme : NavDefaultTheme;

    return {
      ...baseNavTheme,
      colors: {
        ...baseNavTheme.colors,
        primary: customColors.primary,
        background: customColors.background,
        card: customColors.surface,
        text: customColors.text,
        border: customColors.border,
      },
    };
  }, [isDark]);

  if (!isReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeContext.Provider value={{ toggleTheme, isDark, setTheme }}>
          <PaperProvider theme={paperTheme}>
            <ThemeProvider value={navTheme}>
              <StatusBar style={isDark ? 'light' : 'dark'} />
              <Stack
                screenOptions={{
                  headerShown: false,
                  animation: 'fade',
                  contentStyle: {
                    backgroundColor: isDark ? Colors.dark.background : Colors.light.background,
                  },
                }}
              >
                <Stack.Screen name="auth" />
                <Stack.Screen name="(app)" />
                <Stack.Screen
                  name="modal"
                  options={{
                    presentation: 'modal',
                    animation: 'slide_from_bottom',
                  }}
                />
              </Stack>
            </ThemeProvider>
          </PaperProvider>
        </ThemeContext.Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}