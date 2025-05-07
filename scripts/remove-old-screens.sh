#!/bin/bash

# Script to remove old screen files after verification

echo "======================================="
echo "Old Screens Removal Process"
echo "======================================="

# Confirm before proceeding
read -p "Are you sure you want to remove old screen files? This action is irreversible. [y/N] " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Operation canceled."
  exit 0
fi

# Step 1: Remove old game screens
echo "Removing old game screens..."
rm -f app/game/setup/index.tsx
rm -f app/game/index.tsx
rm -f app/game/setup/cricket.tsx
rm -f app/game/cricket.tsx
rm -f app/game/setup/_layout.tsx

# Step 2: Verify that the app still builds
echo "Verifying the app builds correctly after removals..."
npm run build:web

if [ $? -eq 0 ]; then
  echo "✅ App builds successfully after removing old game screens."
  
  # Step 3: Optional - Remove old modal components (comment out if needed)
  echo "Note: NOT removing old modal components yet, as they might be referenced elsewhere."
  echo "If you're sure they're not needed, manually remove them with:"
  echo "- rm -r components/features/game/common/CompletionModals/"
  echo "- rm components/features/stats/PlayerStatsModal.tsx"
  
  # Completion message
  echo "
========================================================
✅ Old screen removal completed successfully!

New Screen Structure is now the primary navigation method.
Next steps:
1. Update any remaining imports or references to old screens
2. Verify all navigation works properly
3. Run final tests on the app
========================================================"

else
  echo "❌ App build failed after removing old screens."
  echo "Restoring backup files..."
  
  # Restore from backup if build fails
  cp -r backup/app/game/* app/game/
  
  echo "Files restored from backup. Please review dependencies before trying again."
  exit 1
fi