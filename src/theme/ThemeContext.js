import React, { useState, useMemo, useEffect, createContext, useContext } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Design tokens
const lightTheme = {
  name: 'light',
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceAlt: '#f6f7f9',
    surfaceElevated: '#FFFFFF',
    text: '#000000',
    textSecondary: '#666666',
    border: '#e2e5e9',
    primary: '#000000',
    accent: '#2563EB',
    danger: '#ff4d4f',
    gradientStart: '#000000',
    gradientEnd: '#404040',
    shadow: '#000000',
  },
  radii: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  typography: { h1: 32, h2: 24, h3: 20, body: 16, small: 14, tiny: 12 },
  elevation: { sm: 2, md: 4, lg: 8 },
};

const darkTheme = {
  name: 'dark',
  colors: {
    background: '#0d0f12',
    surface: '#1a1d21',
    surfaceAlt: '#22262b',
    surfaceElevated: '#262b31',
    text: '#f5f7fa',
    textSecondary: '#9aa3b1',
    border: '#2d3238',
    primary: '#ffffff',
    accent: '#3b82f6',
    danger: '#ff6b6b',
    gradientStart: '#2d2f33',
    gradientEnd: '#121315',
    shadow: '#000000',
  },
  radii: { xs: 4, sm: 8, md: 12, lg: 16, xl: 20 },
  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },
  typography: { h1: 32, h2: 24, h3: 20, body: 16, small: 14, tiny: 12 },
  elevation: { sm: 2, md: 4, lg: 8 },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('light');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('@theme');
        if (stored === 'light' || stored === 'dark') setThemeName(stored);
      } catch (_) {
        // ignore
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (hydrated) AsyncStorage.setItem('@theme', themeName).catch(() => {});
  }, [themeName, hydrated]);

  const toggleTheme = () => setThemeName(prev => (prev === 'light' ? 'dark' : 'light'));
  const setTheme = (name) => setThemeName(name === 'dark' ? 'dark' : 'light');

  const theme = themeName === 'light' ? lightTheme : darkTheme;

  const value = useMemo(() => ({ themeName, theme, toggleTheme, setTheme, hydrated }), [themeName, theme, hydrated]);

  // Render loading view instead of null to prevent context error
  if (!hydrated) {
    return (
      <View style={{ flex: 1, backgroundColor: lightTheme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export { lightTheme, darkTheme, ThemeContext };