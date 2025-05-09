export const typography = {
  // Font families
  families: {
    light: undefined, // System font - light weight
    regular: undefined, // System font
    semiBold: undefined, // System font
    bold: undefined,
  },

  // Font sizes
  sizes: {
    xxs: 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 28,
    xxxl: 32,
  },

  // Line heights
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 40,
    xxxl: 56,
  },

  // Letter spacing
  letterSpacing: {
    tighter: -0.8,
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    wider: 0.8,
  },
} as const;