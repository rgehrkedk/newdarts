# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev` - Start the development server
- `npm run build:web` - Export the app for web
- `npm run lint` - Run ESLint for code quality checks

## App Concept
This is a Darts Scorer App built with Expo and React Native. It features:
- Multiple game variants (X01, Cricket)
- Player management and statistics
- Real-time score tracking and visualization
- Game completion tracking with statistics
- Authentication and data persistence via Supabase

## Code Style Guidelines
- **Formatting**: Use Prettier with 2 space indentation, single quotes, bracket spacing
- **Imports**: Group imports by category (React/React Native, third-party, local), use absolute imports with @/ prefix
- **Types**: Define TypeScript interfaces for props, state, and data models; avoid any; use optional chaining
- **Components**: Use function components with explicit prop interfaces; prefer composition
- **State Management**: Use Zustand for global state; React hooks for component state
- **Error Handling**: Use try/catch with specific error types; show user-friendly messages
- **Naming**: 
  - PascalCase for components, interfaces, types
  - camelCase for variables, functions, hooks (with use prefix)
  - Descriptive, action-based function names (handle*, on*, toggle*)
- **Theme**: Use semantic color system with useThemeColors hook

## Architecture
- **Navigation**: Expo Router with file-based routing and tab navigation
- **UI Design**: Atomic design pattern (atoms → molecules → organisms)
- **Game Logic**: Custom hooks for game mechanics (useGameLogic, useCricketGame)
- **Data Layer**: Supabase for authentication and data persistence
- **Components**: Reusable UI components with consistent styling
- **Animation**: React Native Reanimated for fluid transitions

## Theming System
- **Color Structure**:
  - Base `palette` object in `constants/theme/colors.ts` defines all raw color values
  - `semanticLight` and `semanticDark` objects map UI concepts to palette colors
  - Semantic color categories: background, text, border, brand, score, avatar
- **Theme State**:
  - `useTheme()` hook provides `isDark` state and `toggleTheme()` function
  - Theme Provider in root layout makes theme context available app-wide
- **Using Colors**:
  - Always use `const colors = useThemeColors()` to get current theme colors
  - Reference semantic properties like `colors.background.primary`, `colors.text.secondary`
  - Never use hardcoded color values except through the semantic system
- **Themed Components**:
  - Use conditional colors with the current theme: `{ backgroundColor: colors.background.tertiary }`
  - For BlurView, use `tint={isDark ? 'dark' : 'light'}`
  - Alpha transparency colors are available with format `colors.background.overlay`