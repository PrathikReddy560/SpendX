// Web-specific Color Scheme Hook
// Handles web-specific color scheme logic

import { useEffect, useState } from 'react';

export function useColorScheme() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Check for system preference
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setColorScheme(darkQuery.matches ? 'dark' : 'light');

    // Listen for changes
    const handler = (e: MediaQueryListEvent) => {
      setColorScheme(e.matches ? 'dark' : 'light');
    };

    darkQuery.addEventListener('change', handler);
    return () => darkQuery.removeEventListener('change', handler);
  }, []);

  return colorScheme;
}

export default useColorScheme;
