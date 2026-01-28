# SpendX Architecture Guide

## Overview

This document describes the architectural decisions and folder organization of the SpendX mobile application.

## Directory Structure Philosophy

### `/app` - Expo Router Screens
File-based routing following Expo Router conventions:
- **Route Groups**: `(app)` for authenticated screens, `auth` for authentication
- **Layouts**: `_layout.tsx` files define navigation structure
- **Convention**: This directory ONLY contains route screens, not business logic

### `/src` - Source Code
All reusable code lives here:

#### `/src/components`
| Folder | Purpose |
|--------|---------|
| `common/` | Base components used everywhere (ExternalLink, HapticTab) |
| `layout/` | Page structure components (Footer, Sidebar, ResponsiveContainer) |
| `themed/` | Theme-aware wrappers (ThemedText, ThemedView) |
| `ui/` | Premium UI components with animations (GlassCard, StatCard, etc.) |

#### `/src/config`
Static configuration files:
- `colors.ts` - Color palette for light/dark themes
- `theme.ts` - Typography, spacing, shadows, breakpoints
- `animations.ts` - Reanimated animation presets
- `api.ts` - API endpoints and TypeScript interfaces

#### `/src/hooks`
Custom React hooks encapsulating reusable logic:
- `useApi.ts` - API request handling
- `useAuth.ts` - Authentication state
- `useColorScheme.ts` - System theme detection
- `useThemeColor.ts` - Dynamic theme colors

#### `/src/types`
Shared TypeScript interfaces and type definitions.

#### `/src/utils`
Pure utility functions (formatting, calculations).

## Import Conventions

```typescript
// Config imports
import { Colors } from '../../src/config/colors';
import { Spacing, BorderRadius } from '../../src/config/theme';

// Component imports
import { GlassCard, AnimatedButton } from '../../src/components/ui';
import { ResponsiveContainer } from '../../src/components/layout';

// Hook imports
import { useAuth } from '../../src/hooks';
```

## Component Guidelines

1. **Default exports** for main components
2. **Named exports** for hooks and utilities
3. **Barrel exports** via `index.ts` for clean imports
4. **PascalCase** for component files
5. **camelCase** for hook files

## State Management

- **Local state**: React `useState` for component-level state
- **Theme context**: `ThemeContext` in root layout
- **Future**: Consider Zustand/Redux for complex global state

## Styling Approach

1. All styles use `StyleSheet.create()` for performance
2. Theme values from `src/config/theme.ts`
3. Dynamic colors via `useTheme()` from react-native-paper
4. Responsive values via `useResponsive()` hook
