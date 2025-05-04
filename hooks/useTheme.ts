import { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type ThemeContextType = {
  toggleTheme: () => void;
  isDark: boolean;
};

export const ThemeContext = createContext<ThemeContextType>({
  toggleTheme: () => {},
  isDark: false,
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function useThemeProvider() {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDark(prev => !prev);
  };

  return {
    isDark,
    toggleTheme,
  };
}