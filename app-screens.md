# Darts App Screens

This document provides an overview of all screens, modals, drawers, and overlays used in the Darts Scorer application.

## Main Navigation Screens

These screens are accessed via the main tab navigation.

### Home Screen
- **Path**: `/app/(tabs)/index.tsx`
- **Description**: The primary landing screen that displays welcome message, game options, recent activity, quick stats, last match information, and a mini leaderboard of top players.
- **Key Features**: Animated UI elements, quick game access, recent progress visualization.

### Leaderboard Screen
- **Path**: `/app/(tabs)/leaderboard.tsx`
- **Description**: Displays player rankings with various filtering and sorting options.
- **Key Features**: Date range filters, stat category selection, animated transitions to player details.

### Play Screen
- **Path**: `/app/(tabs)/play.tsx` 
- **Description**: Game selection interface with visually distinct options for different game types.
- **Key Features**: Gradient cards for X01 and Cricket game modes.

### Stats Screen
- **Path**: `/app/(tabs)/stats.tsx`
- **Description**: Comprehensive statistics view with player selection dropdown.
- **Key Features**: Detailed performance metrics, historical data visualization, trend analysis.

### Settings Screen
- **Path**: `/app/(tabs)/settings.tsx`
- **Description**: Application settings organized into categories for appearance, notifications, game settings, support, and account management.
- **Key Features**: Theme toggle, notification preferences, account options.

## Game Screens

These screens are used during game setup and gameplay.

### X01 Game Setup
- **Path**: `/app/game/setup/index.tsx`
- **Description**: Configuration screen for X01 games.
- **Key Features**: Player selection, game variant options (301, 501, etc.), sets/legs configuration.

### Cricket Game Setup
- **Path**: `/app/game/setup/cricket.tsx`
- **Description**: Configuration screen for Cricket games.
- **Key Features**: Player selection, cricket-specific settings like scoring type and marks required.

### X01 Game Screen
- **Path**: `/app/game/index.tsx`
- **Description**: Main gameplay screen for X01 games.
- **Key Features**: Player cards with scores, score input pad, checkout suggestions, statistics tracking.

### Cricket Game Screen
- **Path**: `/app/game/cricket.tsx`
- **Description**: Main gameplay screen for Cricket games. 
- **Key Features**: Cricket-specific score tracking, specialized UI for marking numbers, player stats display.

## Authentication

### Auth Screen
- **Path**: `/app/auth.tsx`
- **Description**: Combined login and signup screen.
- **Key Features**: Form toggle between login/signup modes, demo account access, password recovery.

## Modals & Overlays

These components appear on top of other screens.

### Game Completion Modal
- **Path**: `/components/features/game/common/CompletionModals/GameCompletionModal.tsx`
- **Description**: Appears when a game is finished to show results and offer next actions.
- **Key Features**: Winner highlight, game statistics, options to restart or return home.

### Leg Completion Modal
- **Path**: `/components/features/game/common/CompletionModals/LegCompletionModal.tsx`
- **Description**: Appears when a leg is completed but the match continues.
- **Key Features**: Leg statistics, player performance comparison, continue button.

### Set Completion Modal
- **Path**: `/components/features/game/common/CompletionModals/SetCompletionModal.tsx`
- **Description**: Appears when a set is completed but the match continues.
- **Key Features**: Set statistics, player performance comparison, continue button.

### Checkout Modal
- **Path**: `/components/features/game/common/CompletionModals/CheckoutModal.tsx`
- **Description**: Appears when a player attempts a checkout.
- **Key Features**: Options for number of darts used, checkout success/fail recording.

### Player Stats Modal
- **Path**: `/components/features/stats/PlayerStatsModal.tsx`
- **Description**: Full-screen detailed statistics for a selected player.
- **Key Features**: Comprehensive statistics view, game history, performance trends.

### Player Stats Overlay
- **Path**: `/components/features/stats/components/PlayerStatsOverlay.tsx`
- **Description**: Animated overlay that expands from a leaderboard item to show player stats.
- **Key Features**: Smooth animation transitions, contextual player information.

## Drawers

These are slide-in panels used for specific tasks.

### Player Drawer
- **Path**: `/components/features/players/PlayerDrawer.tsx`
- **Description**: Multi-purpose drawer for player management.
- **Key Features**: 
  - Player selection list
  - New player creation form
  - Player editing form
  - Player deletion confirmation

## Layout Components

These components define the structural layout of the application.

### Tab Navigation Layout
- **Path**: `/app/(tabs)/_layout.tsx`
- **Description**: Configures the main tab navigation structure.
- **Key Features**: Custom tab bar, animated center play button, authentication protection.

### Root Layout
- **Path**: `/app/_layout.tsx`
- **Description**: Root component that wraps the entire application.
- **Key Features**: Authentication provider, theme context setup, navigation stack configuration.

### Game Setup Layout
- **Path**: `/app/game/setup/_layout.tsx`
- **Description**: Layout wrapper for game setup screens.
- **Key Features**: Common header and navigation options for setup screens.

## Proposed Screen Structure Improvements

After analyzing the current screen structure, here are suggestions for improving organization and maintainability:

### 1. File-Based Routing Refinements

#### Current Issues:
- Game screens are at different nesting levels
- Mixed usage of index.tsx and named files
- Incomplete use of Expo Router's grouping capabilities

#### Recommended Structure:
```
/app/
  /_layout.tsx                  # Root layout with auth & theme providers
  /auth.tsx                     # Authentication screen
  
  # Main tab navigation
  /(tabs)/
    /_layout.tsx                # Tab navigation configuration
    /index.tsx                  # Home screen
    /leaderboard.tsx            # Leaderboard screen
    /play.tsx                   # Game selection screen
    /stats.tsx                  # Statistics screen
    /settings.tsx               # Settings screen
  
  # Game flows using nested navigation
  /(game)/
    /_layout.tsx                # Shared game layout with common transitions
    
    # X01 game flow
    /x01/
      /_layout.tsx              # X01-specific layout
      /setup.tsx                # X01 setup screen
      /play.tsx                 # X01 gameplay screen
    
    # Cricket game flow  
    /cricket/
      /_layout.tsx              # Cricket-specific layout
      /setup.tsx                # Cricket setup screen
      /play.tsx                 # Cricket gameplay screen
  
  # Player management (could be modal stack group)
  /(players)/
    /_layout.tsx                # Player management layout
    /list.tsx                   # Player list/selection screen
    /create.tsx                 # Create player screen
    /edit/[id].tsx              # Edit player by ID
    /stats/[id].tsx             # Player statistics by ID
```

### 2. Component Organization Recommendations

#### Move Modal and Drawer Components to Better Locations:
- Move UI modals into screens when they represent a complete view
- Create a clear distinction between feature components and full screens

#### Recommended Approach:
1. **Modal Screens**: Implement modals that represent full views as screens in the navigation stack
   ```
   /app/(modals)/
     /_layout.tsx                # Modal group configuration
     /player-stats/[id].tsx      # Player stats as modal screen
     /game-completed.tsx         # Game completion as modal screen
   ```

2. **Contextual Modals**: Keep truly contextual modals as components within feature directories
   ```
   /components/features/game/
     /modals/
       /CheckoutModal.tsx         # During-gameplay modals stay as components
   ```

### 3. Shared Element Transitions

Define a consistent approach for shared element transitions between screens:

```typescript
// In _layout.tsx files
export default function GameLayout() {
  return (
    <Stack
      screenOptions={{
        animation: 'fade_from_bottom',
        // Configure shared element transitions
        customAnimationOnSwipe: true,
      }}
    >
      <Stack.Screen name="x01/setup" options={{
        sharedElements: (route) => ['player-card-avatar']
      }}/>
      <Stack.Screen name="x01/play" />
    </Stack>
  );
}
```

### 4. Navigation Type Safety

Add type safety to navigation with a centralized route definition:

```typescript
// /types/navigation.ts
export type AppRoutes = {
  // Tab routes
  '(tabs)': undefined;
  '(tabs)/index': undefined;
  '(tabs)/leaderboard': undefined;
  
  // Game routes
  '(game)/x01/setup': undefined;
  '(game)/x01/play': { gameId?: string };
  '(game)/cricket/setup': undefined;
  '(game)/cricket/play': { gameId?: string };
  
  // Modal routes
  '(modals)/player-stats/[id]': { id: string };
};

// Usage with router.navigate
router.navigate('(game)/x01/play', { gameId: 'new-game' });
```

### 5. Screen-Specific Component Colocation

For components that are only used in a single screen, consider colocating them with their screen:

```
/app/(tabs)/stats.tsx
/app/(tabs)/stats/
  components/
    StatChart.tsx
    StatFilter.tsx
```

This approach keeps related components close to their usage point while maintaining feature-specific components for reusable items.

### 6. Benefits of Proposed Structure

1. **Improved navigation flows**: Group related screens logically
2. **Better type safety**: Centralized route definitions 
3. **Clearer screen transitions**: Consistent shared element animation patterns
4. **Simplified imports**: Colocated components reduce import complexity
5. **Enhanced maintainability**: Clear distinction between full screens and components
6. **Future-proof**: Better supports additional game types or features