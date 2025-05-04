export const spacing = {
  // Base spacing units
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,

  // Component specific spacing
  container: 16,
  content: 20,
  
  // Card spacing
  card: {
    padding: {
      sm: 12,
      md: 16,
      lg: 20,
    },
    gap: {
      sm: 8,
      md: 12,
      lg: 16,
    },
  },

  // Button spacing
  button: {
    padding: {
      sm: 8,
      md: 12,
      lg: 16,
    },
    gap: {
      sm: 4,
      md: 8,
      lg: 12,
    },
  },

  // Input spacing
  input: {
    padding: {
      sm: 8,
      md: 12,
      lg: 16,
    },
    gap: {
      sm: 4,
      md: 8,
      lg: 12,
    },
  },
} as const;