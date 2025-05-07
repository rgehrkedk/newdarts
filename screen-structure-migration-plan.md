# Screen Structure Migration Plan

This document outlines a comprehensive plan for reorganizing the Darts Scorer app's screens into a more maintainable, scalable structure using Expo Router's file-based routing capabilities.

## Target Structure

```
/app/
  /_layout.tsx                  # Root layout with auth & theme providers
  /auth.tsx                     # Authentication screen
  /+not-found.tsx               # 404 page
  
  # Main tab navigation
  /(tabs)/
    /_layout.tsx                # Tab navigation configuration 
    /index.tsx                  # Home screen
    /leaderboard.tsx            # Leaderboard screen
    /play.tsx                   # Game selection screen
    /stats.tsx                  # Statistics screen
    /settings.tsx               # Settings screen
  
  # All application screens grouped by purpose
  /(screens)/
    /_layout.tsx                # Shared layout for all screens
    
    # Game screens
    /(game)/
      /_layout.tsx              # Game screens layout
      
      # X01 game
      /x01/
        /_layout.tsx            # X01 layout
        /setup.tsx              # X01 setup screen
        /play.tsx               # X01 gameplay screen
      
      # Cricket game  
      /cricket/
        /_layout.tsx            # Cricket layout
        /setup.tsx              # Cricket setup screen
        /play.tsx               # Cricket gameplay screen
    
    # Player management screens  
    /(players)/
      /_layout.tsx              # Players layout
      /list.tsx                 # Player listing
      /create.tsx               # Create player
      /edit/[id].tsx            # Edit player by ID
      /stats/[id].tsx           # Player statistics by ID
      
    # Modal screens
    /(modals)/
      /_layout.tsx              # Modal stack configuration 
      /player-details/[id].tsx  # Player details modal
      /game-complete.tsx        # Game completion modal
      /leg-complete.tsx         # Leg completion modal
      /set-complete.tsx         # Set completion modal
      /checkout.tsx             # Checkout modal
```

## Migration Progress

### ✅ Phase 1: Setup Directory Structure (Completed)

1. Created base folder structure:
   ```bash
   mkdir -p app/(screens)/{(game)/x01,(game)/cricket,(players),(modals)}
   ```

2. Created initial layout files in all new directories:
   - `/app/(screens)/_layout.tsx`
   - `/app/(screens)/(game)/_layout.tsx`
   - `/app/(screens)/(game)/x01/_layout.tsx`
   - `/app/(screens)/(game)/cricket/_layout.tsx`
   - `/app/(screens)/(players)/_layout.tsx`
   - `/app/(screens)/(modals)/_layout.tsx`

### ✅ Phase 2: Move Game Screens (Completed)

1. Created new X01 game screens:
   - Created `/app/(screens)/(game)/x01/setup.tsx` with content migrated from `/app/game/setup/index.tsx`
   - Created `/app/(screens)/(game)/x01/play.tsx` with content migrated from `/app/game/index.tsx`

2. Created new Cricket game screens:
   - Created `/app/(screens)/(game)/cricket/setup.tsx` with content migrated from `/app/game/setup/cricket.tsx`
   - Created `/app/(screens)/(game)/cricket/play.tsx` with content migrated from `/app/game/cricket.tsx`

3. Updated import paths in all screens to use absolute imports for components

### ✅ Phase 3: Create Player Screens (Completed)

1. Created player screens from drawer component:
   - Created `/app/(screens)/(players)/list.tsx` with player listing functionality
   - Created `/app/(screens)/(players)/create.tsx` with player creation form
   - Created `/app/(screens)/(players)/edit/[id].tsx` with player editing functionality
   - Created `/app/(screens)/(players)/stats/[id].tsx` with player statistics display

2. Implemented navigation between player screens with proper routing

### ✅ Phase 4: Modal Components Conversion (Completed)

1. Created all modal screens:
   - Created `/app/(screens)/(modals)/game-complete.tsx` based on GameCompletionModal
   - Created `/app/(screens)/(modals)/player-details/[id].tsx` based on PlayerStatsModal
   - Created `/app/(screens)/(modals)/leg-complete.tsx` based on LegCompletionModal
   - Created `/app/(screens)/(modals)/set-complete.tsx` based on SetCompletionModal
   - Created `/app/(screens)/(modals)/checkout.tsx` based on CheckoutModal
   
2. Set up modal layout with animations in `/app/(screens)/(modals)/_layout.tsx`
3. Implemented transitions and animations for modal presentations

### ✅ Phase 5: Updated Navigation (Completed)

1. Updated root layout in `/app/_layout.tsx` to include the new screen structure
2. Updated the game selection in `/app/(tabs)/play.tsx` to navigate to new game setup screens
3. Established proper screen layouts with transitions

## Remaining Tasks

### ✅ Phase 6: Implement Type Safety (Completed)

1. Created centralized route type definitions in `/types/navigation.ts`:
   - Defined types for all navigation routes in the app
   - Added proper parameter types for each route
   - Ensured strict type checking for route parameters

2. Created utility functions for type-safe navigation in `/utils/navigation.ts`:
   - Generic `navigate<T>()` function for type-safe navigation
   - `replaceRoute<T>()` for replacing the current screen
   - `presentModal<T>()` for presenting modal screens
   - `goBack()` for navigating back with optional parameters
   - Game-specific navigation helpers (navigateToGameSetup, showGameCompletionModal, etc.)
   - Player-specific navigation helpers (navigateToPlayerDetails, navigateToPlayerEdit, etc.)

3. Updated key screens to use the new type-safe navigation:
   - `/app/(tabs)/play.tsx` - Using `navigateToGameSetup()`
   - `/app/(screens)/(game)/x01/setup.tsx` - Using typed `navigate()`
   - `/app/(screens)/(modals)/game-complete.tsx` - Using specialized navigation helpers
   - `/app/(screens)/(players)/list.tsx` - Using player navigation utilities

### ✅ Phase 8: Testing & Cleanup (Completed)

1. Created comprehensive testing and cleanup plan:
   - Created `/workspaces/newdarts/old-screens-cleanup.md` to document all duplicated screens
   - Mapped old paths to new paths for verification

2. Implemented testing and removal scripts:
   - Created `/workspaces/newdarts/scripts/test-new-screens.sh` for verification testing
   - Created `/workspaces/newdarts/scripts/remove-old-screens.sh` for safe removal
   - Added safeguards like backups and build verification

3. Created verification process:
   - TypeScript type checking to ensure type correctness
   - ESLint checking for code quality
   - Build testing to verify screens work correctly
   - Documentation for manual testing steps

4. Executed cleanup process:
   - Created backups of all old screen files
   - Verified existence of all new screen files
   - Removed old game screen files:
     - `/app/game/cricket.tsx`
     - `/app/game/index.tsx`
     - `/app/game/setup/cricket.tsx`
     - `/app/game/setup/index.tsx`
     - `/app/game/setup/_layout.tsx`
   - Kept old modal components temporarily as they might be used elsewhere

### ⏳ Phase 7: Enhanced Layouts and Transitions

A detailed plan for this phase has been created in [phase7-layouts-transitions-plan.md](/workspaces/newdarts/phase7-layouts-transitions-plan.md).

Key focus areas include:

1. **Consistent Header Components**
   - Create a shared reusable header component
   - Apply consistent styling and behavior across screens
   - Support customization for different screen contexts

2. **Shared Element Transitions**
   - Implement transitions for player avatars between screens
   - Create smooth transitions between game selection and setup
   - Ensure seamless visual continuity during navigation

3. **Enhanced Modal Animations**
   - Improve modal presentation and dismissal animations
   - Add gesture-based interactions for modals
   - Create visually pleasing staggered animations for content

4. **Gesture-Based Navigation**
   - Implement swipe gestures for back navigation
   - Add drag-to-dismiss functionality for modals
   - Support interactive animations based on gesture progress

5. **Common Animation Patterns**
   - Establish consistent animation patterns across the app
   - Implement reusable animation hooks and components
   - Ensure performance optimization on different devices

## Next Steps

1. **Enhance Layouts and Transitions** (Phase 7)
   - Implement shared element transitions between screens
   - Add consistent header components across screens
   - Fine-tune modal animations and gesture handling

2. **Final Testing**
   - Verify navigation with animations and transitions
   - Test user experience on different devices
   - Run the final build test

3. **Documentation**
   - Finalize documentation for the new screen structure
   - Create examples of proper navigation patterns
   - Update any developer documentation

## Benefits Already Realized

1. **Improved organization**: Screens are now clearly separated by purpose
2. **Cleaner Navigation**: Routing is more intuitive with grouped screens
3. **Better Modularity**: Each screen type has its own dedicated layout
4. **Future-Proofing**: Structure readily supports additional game types or features

## Updated Timeline

| Phase | Description | Status | Completed |
|-------|-------------|--------|-----------|
| 1     | Setup Directory Structure | Complete | ✅ |
| 2     | Move Game Screens | Complete | ✅ |
| 3     | Create Player Screens | Complete | ✅ |
| 4     | Convert Modal Components | Complete | ✅ |
| 5     | Update Navigation | Complete | ✅ |
| 6     | Implement Type Safety | Complete | ✅ |
| 8     | Testing & Cleanup | Complete | ✅ |
| 7     | Enhanced Layouts | Not Started | ⏳ |

Estimated completion of remaining task: 1-2 days