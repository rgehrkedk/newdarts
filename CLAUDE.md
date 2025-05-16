# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev` - Start the development server
- `npm run build:web` - Export the app for web
- `npm run lint` - Run ESLint for code quality checks
- `npm run start:tunnel` - Start the development server with tunnel for testing on physical devices
- `npx tsc --noEmit` - Check TypeScript types without generating output files
- `sh scripts/audit-imports.sh` - Audit and identify outdated import patterns
- `sh scripts/update-imports.sh` - Batch update import patterns to new component structure
- `sh scripts/test-new-screens.sh` - Test new screen structure for TypeScript errors
- `sh scripts/remove-old-screens.sh` - Remove outdated screen files after migration
- `npx eslint "app/**/*.tsx" --quiet` - Lint specific app components

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

## Game Logic Structure
The dart game logic is structured as a composition of specialized hooks:

- **Core Game Hooks**:
  - `useGameLogic` - Orchestrates X01 game variants
  - `useCricketGame` - Manages cricket-specific game logic
  - `useGameState` - Maintains game state (scores, errors, modals)
  - `usePlayerState` - Manages player data and turns
  - `useScoreSubmission` - Processes and validates score inputs
  - `useGameCompletion` - Handles leg/set/game completion logic

- **Game Flow**:
  1. Initialize players and game state
  2. Process score inputs through validation
  3. Update player statistics and state
  4. Handle leg/set completions when applicable
  5. End game with final statistics

- **Game Variants**:
  - X01: Standard countdown from starting score (101, 201, 301, 501, 701)
  - Cricket: Mark numbers 15-20 and bullseye with different scoring modes

## Component Library Structure
The app follows atomic design principles with components organized by hierarchy:

- **Atoms** (`components/core/atoms`): 
  - Basic UI building blocks (Text, Button, Card, Input)
  - Highly configurable with typed props
  - Implement theming via useThemeColors()

- **Molecules** (`components/core/molecules`): 
  - Composed of multiple atoms
  - Implement more complex interactions
  - Examples: GradientCard, Accordion, ConfirmDialog

- **Organisms** (`components/core/organisms`):
  - Complex UI components for specific features
  - Examples: BaseModal, CompletionModal
  
- **Feature Components** (`components/features`):
  - Domain-specific components grouped by feature
  - Built on core atomic components (atoms, molecules, organisms)
  - Organized by logical domains (game, players, stats, auth)
  - Examples: game/cricket, game/setup, players
  
  **Feature Components Structure:**
  - **auth/**:
    - Authentication-related components like AuthForm
    - Handles login, registration, and account management UIs
  
  - **game/**:
    - **common/**: Shared game components used across variants
      - **CompletionModals/**: Modals for different game completion states
        - CheckoutModal, GameCompletionModal, LegCompletionModal, SetCompletionModal
      - Player components (PlayerCard, PlayerAccordion, PlayerStatsCard)
      - Score input components (ScoreInput)
      - Special effects (ConfettiExplosion, OneEightyConfetti)
    - **cricket/**: Cricket-specific game components
      - CricketPlayerCard, CricketPlayerStats, CricketScoreInput
    - **setup/**: Game configuration components
      - GameSettingsCard, CricketSettingsCard
  
  - **players/**:
    - Player management components
    - PlayerDrawer - Modal drawer for player selection and creation
    - PlayerForm - Form for creating/editing player profiles
    - PlayerList - Scrollable list of available players
    - PlayerDetailsCard - Display card for player information
  
  - **stats/**:
    - Statistics visualization components
    - PlayerStats - Main statistics view
    - PlayerStatsModal - Modal for displaying detailed stats
    - **components/**: Building blocks for stats visualization
      - Various charts, tables, and specialized displays
      - Includes performance visualizations (TrendChart, HighScores)
      - Date filtering (PeriodFilter)
      - Layout elements (StickyHeader, PlayerOverlay)
      
  **Feature Component Integration Pattern:**
  - Components compose atomic elements (atoms, molecules) into domain-specific interfaces
  - Use custom hooks from `/hooks` directory for business logic
  - Pass domain-specific props rather than generic styling props
  - Connect to global state through hook calls inside components
  - Use shared styling constants from theme system

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

## File Structure Overview
- **app/**: Expo Router file-based screens and navigation
  - **(tabs)**: Main tab navigation screens
  - **(screens)**: Game and player-related screens
  - **(modals)**: Modal screens for game events
- **components/**: Reusable UI components
  - **core/**: Atomic design components (atoms, molecules, organisms)
  - **features/**: Domain-specific components (game, players, stats)
  - **layout/**: Structural components (Container, Header)
- **hooks/**: Custom React hooks for business logic
  - **game/**: Game mechanics hooks
- **constants/**: Application constants and theme definitions
- **providers/**: Context providers for state management
- **stores/**: Zustand stores for global state
- **types/**: TypeScript type definitions
- **utils/**: Utility functions
- **lib/**: Third-party service integrations (Supabase)

## Important Types
- **Player**: Core player data structure with scores and statistics
- **GameState**: State for X01 game variants
- **CricketGameState**: State for Cricket game variant
- **CheckoutType**: Categorizes checkout attempts ("1dart", "2dart", etc.)
- **SortCategory**: Player sorting categories for leaderboards
- **PendingScore**: Represents a score being entered but not yet submitted

## Environment Configuration
Create a `.env` file with Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_SITE_URL=your_site_url
```

## Testing & Verification
- TypeScript type checking: `npx tsc --noEmit`
- ESLint for code quality: `npm run lint`
- Specific component linting: `npx eslint "app/**/*.tsx" --quiet`
- Manual testing on simulator and devices
- Performance testing of animations with React Native Reanimated

## Migration Notes
The codebase appears to be transitioning from an older structure to a new Expo Router-based architecture. Work with files in `/app` directory rather than legacy files in `/backup` or `/backup-old-components` directories. When making changes to existing features, ensure the changes follow the new file-based routing pattern in the `/app` directory.

## Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI
- Supabase account

## Performance Optimization
The app implements several performance optimizations:
- Memoization of expensive calculations with useMemo and useCallback
- React.memo for optimal re-rendering
- Optimized animations using React Native Reanimated
- Proper list virtualization for scrollable content
- Efficient state management with Zustand
- Shared element transitions between screens