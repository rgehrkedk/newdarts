# Darts App Refactoring Proposal

After analyzing the codebase structure and organization, this document outlines a strategy for reorganizing components to better follow the atomic design pattern while separating contextual components from generic ones.

## Proposed File Structure

Here's a revised file structure that better separates contextual components from generic atomic design components:

```
/app                             # Expo Router file-based routing structure (unchanged)

/components
  /core                          # Core atomic design components (truly generic)
    /atoms                       # Fundamental UI elements
      Button.tsx
      Card.tsx
      Input.tsx
      Text.tsx
      IconButton.tsx
      Avatar.tsx
      StatItem.tsx
      ...
    /molecules                   # Combinations of atoms
      Accordion.tsx
      Counter.tsx
      DatePicker.tsx
      Drawer.tsx
      ListItem.tsx
      SegmentedControl.tsx
      ColorPicker.tsx
      ConfirmDialog.tsx
      ...
    /organisms                   # Complex UI components
      BaseModal.tsx              # Foundation for all modals
      CompletionModal.tsx        # Base completion modal
      LoadingScreen.tsx          # Loading screen with variants
      ...

  /features                      # Feature-specific components (contextual)
    /players                     # Player management components
      PlayerDetailsCard.tsx
      PlayerDrawer.tsx
      PlayerForm.tsx
      PlayerList.tsx
      
    /game                        # Game-specific components
      /cricket                   # Cricket game components
        CricketScoreInput.tsx
        CricketPlayerCard.tsx
        CricketPlayerStats.tsx
      /common                    # Shared game components
        ScoreInput.tsx
        PlayerCard.tsx
        PlayerAccordion.tsx
        CompletionModals/        # Game completion modal variants
          GameCompletionModal.tsx
          LegCompletionModal.tsx
          SetCompletionModal.tsx
          CheckoutModal.tsx
      /setup                     # Game setup components
        GameSettingsCard.tsx
        CricketSettingsCard.tsx
        
    /stats                       # Statistics components
      PlayerStats.tsx
      PlayerStatsModal.tsx
      GameHistoryList.tsx
      HighScores.tsx
      Highlights.tsx
      PerformanceSummary.tsx
      TrendChart.tsx
      
    /auth                        # Authentication components
      LoginForm.tsx
      SignupForm.tsx
      
  /layout                        # Layout components
    Header.tsx
    Footer.tsx
    TabBar.tsx
    
/hooks                           # Organized by feature
  /core                          # Generic hooks
    useTheme.ts
    useFrameworkReady.ts
  /auth
    useAuth.ts
  /game
    useGameLogic.ts
    useCricketGame.ts
    ...
  /players
    usePlayers.ts
    usePlayerGameHistory.ts
    ...
    
/contexts                        # Application contexts
  ThemeContext.ts
  AuthContext.ts
  GameContext.ts
  
/services                        # API and external services
  supabase.ts                    # Supabase client
  storage.ts                     # Local storage wrapper
  api/                           # API clients
    players.ts
    games.ts
    auth.ts
    
/utils                           # Utility functions (unchanged)
  dart-utils.ts
  base64url.ts
  
/types                           # Restructured types
  /models                        # Domain models
    player.ts
    game.ts
    cricket.ts
  /api                           # API types
    supabase.ts
  /ui                            # UI-related types
    theme.ts
    navigation.ts
    
/constants                       # Application constants (mostly unchanged)
  /theme
    colors.ts
    spacing.ts
    typography.ts
  game.ts
```

## Implementation Progress and Status

### ✅ Phase 1: Foundational Structure (Completed)

1. **Basic directory structure created**
   - New directory hierarchy established
   - All necessary folders and nested directories in place

2. **Barrel files for clean imports set up**
   - index.ts files created in all major directories
   - Export patterns established for component grouping

3. **Core atoms migration complete**
   - Text.tsx, Button.tsx, Avatar.tsx migrated
   - IconButton.tsx, Card.tsx, Input.tsx, StatItem.tsx migrated
   - All atoms properly exported via index.ts

### ✅ Phase 2: Core Components Migration (Completed)

1. **Core molecules migration complete**
   - Accordion.tsx, Counter.tsx, Drawer.tsx migrated
   - ColorPicker.tsx, ListItem.tsx, ConfirmDialog.tsx migrated
   - SegmentedControl.tsx migrated
   - All molecules properly exported via index.ts

2. **Core organisms migration complete**
   - Created BaseModal.tsx as foundation for all modals
   - Migrated CompletionModal.tsx with adaptations
   - All organisms properly exported via index.ts

3. **Import paths updated within core components**
   - All components using proper path references
   - Path aliases added to tsconfig.json for clean imports

### ✅ Phase 3.1: Player Management Components (Completed)

1. **Player components migration complete**
   - PlayerDetailsCard.tsx migrated with proper imports
   - PlayerDrawer.tsx migrated with proper imports
   - PlayerForm.tsx and PlayerList.tsx migrated
   - All player components properly exported via index.ts

### ✅ Phase 3.2: Game Components (Completed)

1. **Common game components migrated**
   - PlayerAccordion.tsx migrated with updated imports
   - PlayerCard.tsx migrated with updated imports
   - ScoreInput.tsx migrated with updated imports
   - CompletionModals (Game, Leg, Set, Checkout) migrated

2. **Cricket-specific components migrated**
   - CricketPlayerCard.tsx migrated with updated imports
   - CricketPlayerStats.tsx migrated with updated imports
   - CricketScoreInput.tsx migrated with updated imports

3. **Game setup components migrated**
   - GameSettingsCard.tsx migrated with updated imports
   - CricketSettingsCard.tsx migrated with updated imports

## Remaining Implementation Plan

### ✅ Phase 3.3: Stats Components (Completed)

1. **Stats components migration complete**
   - PlayerStats.tsx and PlayerStatsModal.tsx migrated with proper imports
   - All visualization components migrated (GameHistoryList.tsx, HighScores.tsx, etc.)
   - PerformanceSummary.tsx, TrendChart.tsx, and other statistic visualizations migrated
   - All components updated to use correct imports and exported via barrel files

### Phase 3.4: Layout & Auth Components

1. **Layout components migration**
   - Identify and migrate any layout components
   - Ensure proper composition from core components

2. **Auth components migration**
   - Migrate any authentication-specific components
   - Update imports to use new component paths

### Phase 4-6: Hooks, Contexts, Types and Cleanup

1. **Hook reorganization**
   - Move hooks to feature-specific directories
   - Create barrel exports for clean imports

2. **Context extraction**
   - Separate contexts from providers
   - Ensure proper typing and organization

3. **Type reorganization**
   - Split complex type files into domain-specific files
   - Create consistent type patterns across the app

4. **Final import cleanup**
   - Update app pages to use new component imports
   - Verify all screens render correctly
   - Document new architecture

## Benefits of This Approach

1. **Minimal disruption to development workflow**
   - The original files remain functional during transition
   - New files can be tested in isolation
   
2. **Immediate improvements**
   - New components can follow the improved structure immediately
   - Gradual improvement to codebase organization

3. **Verifiable progress**
   - Each phase has clear deliverables that can be tested
   - Progress can be tracked and demonstrated

4. **Risk mitigation**
   - If issues arise, fallback to original files is possible
   - Testing can be done at each step

## Testing Strategy

After each phase or significant component migration:

1. Run the app and verify screens render correctly
2. Check that interactions work as expected
3. Ensure theme switching works properly
4. Validate that game mechanics function correctly
5. Test player management features