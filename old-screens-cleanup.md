# Old Screens Cleanup Plan

This document outlines the process for safely removing old screen files that have been replaced by the new screen structure.

## Duplicated Screens

The following screens have been migrated to the new structure and can be safely removed after verification:

### Game Screens

| Old Path | New Path | Status |
|----------|----------|--------|
| `/app/game/setup/index.tsx` | `/app/(screens)/(game)/x01/setup.tsx` | ✅ Removed |
| `/app/game/index.tsx` | `/app/(screens)/(game)/x01/play.tsx` | ✅ Removed |
| `/app/game/setup/cricket.tsx` | `/app/(screens)/(game)/cricket/setup.tsx` | ✅ Removed |
| `/app/game/cricket.tsx` | `/app/(screens)/(game)/cricket/play.tsx` | ✅ Removed |
| `/app/game/setup/_layout.tsx` | `/app/(screens)/(game)/x01/_layout.tsx` and `/app/(screens)/(game)/cricket/_layout.tsx` | ✅ Removed |

### Modal Components (Now Screen-Based)

| Old Component | New Screen | Status |
|---------------|------------|--------|
| `/components/features/game/common/CompletionModals/GameCompletionModal.tsx` | `/app/(screens)/(modals)/game-complete.tsx` | ⏳ To Verify |
| `/components/features/game/common/CompletionModals/LegCompletionModal.tsx` | `/app/(screens)/(modals)/leg-complete.tsx` | ⏳ To Verify |
| `/components/features/game/common/CompletionModals/SetCompletionModal.tsx` | `/app/(screens)/(modals)/set-complete.tsx` | ⏳ To Verify |
| `/components/features/game/common/CompletionModals/CheckoutModal.tsx` | `/app/(screens)/(modals)/checkout.tsx` | ⏳ To Verify |
| `/components/features/stats/PlayerStatsModal.tsx` | `/app/(screens)/(modals)/player-details/[id].tsx` | ⏳ To Verify |

## Verification Process

For each screen to be removed, we'll:

1. **Build Check**: Run a build to ensure the new screen is properly integrated
2. **Functionality Test**: Verify that all features work correctly in the new screen
3. **Navigation Test**: Confirm that navigation to/from the screen works as expected
4. **Data Passing**: Verify that parameters are correctly passed to the screen
5. **UI/UX Verification**: Ensure the user experience is consistent or improved

## Safe Removal Process

1. **Backup**: Create a backup of the old screen before removal
2. **Removal**: Remove the old screen file
3. **Build Check**: Run another build to verify no issues
4. **Update References**: Ensure no references to the old screen remain

## Implementation

### Backup Method

Before removing any files, create backups with:

```bash
# Create backup directory
mkdir -p backup/app/game

# Backup game screens
cp -r app/game/* backup/app/game/

# Backup modal components
mkdir -p backup/components/features
cp -r components/features/game/common/CompletionModals backup/components/features/
cp components/features/stats/PlayerStatsModal.tsx backup/components/features/
```

### Removal Method

After verification, remove old files with:

```bash
# Remove old game screens
rm app/game/setup/index.tsx
rm app/game/index.tsx
rm app/game/setup/cricket.tsx
rm app/game/cricket.tsx
rm app/game/setup/_layout.tsx

# Note: We'll keep the modal components for now as they might be imported elsewhere
# We'll handle those after verifying all screen behavior
```

## Next Steps

After removing old screens:

1. Update any remaining imports or references to old screens
2. Update navigation patterns across the app
3. Verify the app functions correctly with only the new screens