// Premium App Tab Layout
// Enhanced tab bar with animations and custom styling

import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Platform, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, useSharedValue } from 'react-native-reanimated';
import { Colors } from '../../src/config/colors';
import { BorderRadius, Spacing } from '../../src/config/theme';

// Custom Tab Bar Icon with animation
function TabIcon({
  name,
  color,
  size,
  focused
}: {
  name: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
  size: number;
  focused: boolean;
}) {
  const scale = useSharedValue(focused ? 1.15 : 1);

  scale.value = withSpring(focused ? 1.15 : 1, {
    damping: 15,
    stiffness: 200
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <MaterialCommunityIcons name={name} size={size} color={color} />
    </Animated.View>
  );
}

export default function AppLayout() {
  const theme = useTheme();
  const isDark = theme.dark;
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.tabBarBorder,
          borderTopWidth: 1,
          height: Platform.OS === 'ios' ? 80 : 65,
          paddingBottom: Platform.OS === 'ios' ? 24 : 10,
          paddingTop: 8,
          paddingHorizontal: Spacing.xs,
          ...(Platform.OS === 'web' ? {
            maxWidth: 500,
            alignSelf: 'center',
            width: '100%',
            borderRadius: BorderRadius.lg,
            marginBottom: Spacing.sm,
            borderWidth: 1,
            borderColor: colors.border,
          } : {}),
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: {
          fontWeight: '600',
          fontSize: 11,
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="view-dashboard" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="history" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="robot-outline" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: 'Analysis',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="chart-arc" color={color} size={size} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <TabIcon name="account-circle-outline" color={color} size={size} focused={focused} />
          ),
        }}
      />
      {/* Hidden Screens - Not shown in tab bar */}
      <Tabs.Screen name="about" options={{ href: null }} />
      <Tabs.Screen name="explore" options={{ href: null }} />
      <Tabs.Screen name="edit-profile" options={{ href: null }} />
      <Tabs.Screen name="change-password" options={{ href: null }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="language" options={{ href: null }} />
      <Tabs.Screen name="currency" options={{ href: null }} />
      <Tabs.Screen name="rate-app" options={{ href: null }} />
    </Tabs>
  );
}
