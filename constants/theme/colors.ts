import { useColorScheme } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

// Base palette
const palette = {
  neutral: {
    50: '#f4f4f5',
    100: '#e8e9ec',
    200: '#d6d7dc',
    300: '#b9bbc6',
    400: '#9da0ae',
    500: '#70768f',
    600: '#656a81',
    700: '#505363',
    800: '#2d2f39',
    850: '#21232c',
    900: '#16171d',
    950: '#09090c',
    alpha: {
      '850-50': '#21232c80',
      '800-50': '#2d2f3980',
      '800-80': '#2d2f39cc',
      '850-80': '#21232ccc',
      '100-80': '#e3e4e8cc',
      '100-50': '#e3e4e880',
      '200-80': '#d6d7dccc',
      '200-50': '#d6d7dc80',
      '900-80': '#16171dcc',
      '800-30': '#2d2f394d',
      '200-30': '#d6d7dc4d',
      '400-10': '#9da0ae1a',
      '500-10': '#70768f1a',
    },
  },
  brand: {
    secondary: {
      100: '#F4EBFF',
      200: '#E1D5FF',
      300: '#CBB4FF',
      400: '#AD8CFC',
      500: '#8C56F0',
      600: '#7C3AED',
      700: '#6927C8',
      800: '#561CA3',
      900: '#43177F',
      950: '#2C0C57',
      '600-25': '#7C3AED40',
    },
    primary: {
      100: '#ECFDF5',
      200: '#D1FADF',
      300: '#A7F3C8',
      400: '#6EE7B7',
      500: '#4ADE80',
      600: '#22C55E',
      700: '#16A34A',
      800: '#15803D',
      900: '#166534',
      950: '#052E16',
     '600-25': '#7C3AED40',
    },
  },
  avatar: {
    green: '#22C55E',
    greenGradient: '#16A34A',
    blue: '#3B82F6',
    blueGradient: '#1D4ED8',
    purple: '#8B5CF6',
    purpleGradient: '#7C3AED',
    pink: '#EC4899',
    pinkGradient: '#DB2777',
    orange: '#F97316',
    orangeGradient: '#EA580C',
    red: '#EF4444',
    redGradient: '#DC2626',
    yellow: '#EAB308',
    yellowGradient: '#CA8A04',
    teal: '#14B8A6',
    tealGradient: '#0D9488',
    gold: {
      start: '#FFD700',
      end: '#FFA500',
      text: '#121212',
    }
  },
  
  // Transparency values for use with components like GradientCard
  transparency: {
    full: 'FF',      // 100% opacity
    high: 'E6',      // 90% opacity
    medium: 'CC',    // 80% opacity
    mediumLow: 'B3', // 70% opacity
    low: '99',       // 60% opacity
    veryLow: '66',   // 40% opacity
    faint: '4D',     // 30% opacity
    shade: '1A',
    transparent: '00' // 0% opacity
  }
} as const;

const semanticLight = {
  // Base colors
  black: palette.neutral[900],
  white: palette.neutral[50],
  
  // Transparency values
  transparency: palette.transparency,

  // Background colors
  background: {
    primary: palette.neutral[50],
    secondary: palette.neutral[100],
    tertiary: palette.neutral[200],
    overlay: palette.neutral.alpha['200-50'],
    card: {
      primary: palette.neutral.alpha['100-50'],
      secondary: palette.neutral.alpha['200-80'],
    },
    input: palette.neutral[100],
    iconWrapper: palette.neutral.alpha['200-30'],
    button: {
      primary: palette.brand.primary[600],
      secondary: palette.neutral[100],
      ghost: 'transparent',
    },
  },

  // Text colors
  text: {
    primary: palette.neutral[900],
    secondary: palette.neutral[500],
    onPrimary: palette.brand.primary[950],
    onPrimaryGradient: palette.brand.primary[900],
    onSecondary: palette.brand.secondary[900],
    onSecondaryGradient: palette.brand.secondary[900],
    onGhost: palette.neutral[500],
    onBrand: palette.brand.primary[100],
    brand: palette.brand.primary[600],
  },

  // Border colors
  border: {
    primary: palette.neutral[200],
    secondary: palette.neutral[300],
    gradient: '#0000001a',
  },

  // Brand colors
  brand: {
    primary: palette.brand.primary[600],
    primaryGradient: palette.brand.primary[400],
    secondary: palette.brand.secondary[500],
    secondaryGradient: palette.brand.secondary[400],
    success: palette.brand.secondary[500],
    error: '#EF4444',
  },

  // Score colors
  score: {
    hot: '#EF4444',    // 140+
    high: '#F97316',   // 100-139
    medium: '#EAB308', // 80-99
    low: palette.brand.secondary[500],    // 60-79
  },

  // Avatar colors
  avatar: {
    colors: palette.avatar,
    border: palette.neutral[200],
    success: palette.brand.secondary[500],
  },
} as const;

const semanticDark = {
  // Base colors
  black: palette.neutral[950],
  white: palette.neutral[50],
  
  // Transparency values
  transparency: palette.transparency,

  // Background colors
  background: {
    primary: palette.neutral[900],
    secondary: palette.neutral[850],
    tertiary: palette.neutral[800],
    overlay: palette.neutral.alpha['800-50'],
    card: {
      primary: palette.neutral.alpha['800-30'],
      secondary: palette.neutral.alpha['800-80'],
    },
    input: palette.neutral[850],
    iconWrapper: palette.neutral.alpha['800-30'],
    button: {
      primary: palette.brand.primary[600],
      secondary: palette.neutral[850],
      ghost: 'transparent',
    },
  },

  // Text colors
  text: {
    primary: palette.neutral[50],
    secondary: palette.neutral[400],
    onPrimary: palette.neutral[900],
    onPrimaryGradient: palette.brand.primary[300],
    onSecondary: palette.brand.secondary[100],
    onSecondaryGradient: palette.brand.secondary[200],
    onGhost: palette.neutral[400],
    onBrand: palette.brand.primary[800],
    brand: palette.brand.primary[500],
  },

  // Border colors
  border: {
    primary: palette.neutral[700],
    secondary: palette.neutral[600],
    gradient: '#ffffff1a',
  },

  // Brand colors
  brand: {
    primary: palette.brand.primary[600],
    primaryGradient: palette.brand.primary[800],
    secondary: palette.brand.secondary[500],
    secondaryGradient: palette.brand.secondary[700],
    success: palette.brand.secondary[500],
    error: '#EF4444',
  },

  // Score colors
  score: {
    hot: '#EF4444',    // 140+
    high: '#F97316',   // 100-139
    medium: '#EAB308', // 80-99
    low: palette.brand.secondary[500],    // 60-79
  },

  // Avatar colors
  avatar: {
    colors: palette.avatar,
    border: palette.neutral[700],
    success: palette.brand.secondary[500],
  },
} as const;

export type Colors = typeof semanticLight & {
  transparency: typeof palette.transparency;
};

export function useThemeColors() {
  const { isDark } = useTheme();
  return isDark ? semanticDark : semanticLight;
}