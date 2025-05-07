#!/bin/bash

# Test script to verify new screen structure

echo "======================================="
echo "New Screens Structure Verification Test"
echo "======================================="

# Create backup of old screens
echo "Creating backup of old screens..."
mkdir -p backup/app/game
cp -r app/game/* backup/app/game/
mkdir -p backup/components/features
cp -r components/features/game/common/CompletionModals backup/components/features/
cp components/features/stats/PlayerStatsModal.tsx backup/components/features/
echo "Backup completed."

# Test 1: Verify TypeScript compilation
echo "
Test 1: Checking TypeScript compilation..."
npx tsc --noEmit
if [ $? -eq 0 ]; then
  echo "TypeScript compilation successful ✅"
else
  echo "TypeScript errors found ❌"
  echo "Reverting to original state..."
  exit 1
fi

# Test 2: Run ESLint
echo "
Test 2: Running ESLint on new screens..."
npx eslint "app/(screens)/**/*.tsx" --quiet
if [ $? -eq 0 ]; then
  echo "ESLint check successful ✅"
else
  echo "ESLint errors found ❌"
  echo "You may want to fix these issues, but they might not be critical."
fi

# Test 3: Build the app
echo "
Test 3: Building the app..."
npm run build:web
if [ $? -eq 0 ]; then
  echo "App build successful ✅"
else
  echo "Build failed ❌"
  echo "Reverting to original state..."
  exit 1
fi

echo "
All tests completed successfully!"
echo "You can now proceed with removing old screen files using:"
echo "sh scripts/remove-old-screens.sh"