#!/bin/bash

# audit-imports.sh
# Script to audit import patterns in the codebase
# Usage: ./scripts/audit-imports.sh

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Import Pattern Audit ===${NC}"
echo "This script will identify old import patterns that need to be updated."
echo

# Create temporary directory for reports
mkdir -p /tmp/import-audit
rm -f /tmp/import-audit/*.txt

# Patterns to search for
OLD_PATTERNS=(
  "@/components/ui/atoms"
  "components/ui/atoms"
  "../ui/atoms"
  "./ui/atoms"
  "@/components/ui/molecules"
  "components/ui/molecules"
  "../ui/molecules"
  "./ui/molecules"
  "@/components/ui/organisms"
  "components/ui/organisms"
  "../ui/organisms"
  "./ui/organisms"
  "@/components/game"
  "components/game"
  "../game"
  "./game"
  "@/components/stats"
  "components/stats"
  "../stats"
  "./stats"
  "@/components/setup"
  "components/setup"
  "../setup"
  "./setup"
)

# Count total files to process
TOTAL_FILES=$(find /workspaces/newdarts -type f -name "*.tsx" -o -name "*.ts" | grep -v "node_modules" | wc -l)

echo -e "${YELLOW}Scanning $TOTAL_FILES TypeScript/React files...${NC}"
echo

# Function to count occurrences of a pattern
count_occurrences() {
  local pattern="$1"
  local count=$(grep -r --include="*.tsx" --include="*.ts" "$pattern" /workspaces/newdarts | grep "import" | grep -v "node_modules" | wc -l)
  echo "$count"
}

# Function to save files using a pattern
save_files_using_pattern() {
  local pattern="$1"
  local output_file="$2"
  
  grep -r --include="*.tsx" --include="*.ts" "$pattern" /workspaces/newdarts | grep "import" | grep -v "node_modules" | sort > "$output_file"
}

# Summary count
echo -e "${GREEN}Summary of old import patterns:${NC}"
for pattern in "${OLD_PATTERNS[@]}"; do
  count=$(count_occurrences "$pattern")
  if [ "$count" -gt 0 ]; then
    echo -e "${RED}$count${NC} files using ${YELLOW}$pattern${NC}"
    save_files_using_pattern "$pattern" "/tmp/import-audit/${pattern//\//_}.txt"
  fi
done

echo

# Component-specific analysis
echo -e "${GREEN}Top 10 most imported components using old patterns:${NC}"
grep -r --include="*.tsx" --include="*.ts" -A 1 "import.*from.*components/" /workspaces/newdarts | grep -v "node_modules" | grep -v "\--" | sort | uniq -c | sort -nr | head -10

echo

# Directory analysis
echo -e "${GREEN}Files containing the most old import patterns:${NC}"
find /workspaces/newdarts -type f -name "*.tsx" -o -name "*.ts" | grep -v "node_modules" | while read file; do
  old_imports=$(grep -c -E "import.*from.*(components\/|\.\.\/)" "$file")
  if [ "$old_imports" -gt 0 ]; then
    echo "$old_imports $file"
  fi
done | sort -nr | head -10

echo

# Generate action plan
echo -e "${GREEN}=== Action Plan ===${NC}"
echo "Based on the analysis, focus on updating these components first:"
echo

TOTAL_OLD_IMPORTS=0
for pattern in "${OLD_PATTERNS[@]}"; do
  count=$(count_occurrences "$pattern")
  TOTAL_OLD_IMPORTS=$((TOTAL_OLD_IMPORTS + count))
done

if [ "$TOTAL_OLD_IMPORTS" -gt 0 ]; then
  echo -e "1. ${YELLOW}Update core component imports${NC} (atoms, molecules, organisms)"
  echo "   - Replace @/components/ui/atoms with @core/atoms"
  echo "   - Replace @/components/ui/molecules with @core/molecules"
  echo "   - Replace @/components/ui/organisms with @core/organisms"
  echo
  echo -e "2. ${YELLOW}Update feature component imports${NC}"
  echo "   - Replace @/components/game with @features/game"
  echo "   - Replace @/components/stats with @features/stats"
  echo "   - Replace @/components/setup with @features/game/setup"
  echo
  echo -e "3. ${YELLOW}Create unit tests${NC} to ensure components work with new import patterns"
  echo
  echo -e "4. ${YELLOW}Run the app${NC} after each batch of changes to verify functionality"
else
  echo -e "${GREEN}All imports are using the new patterns! No action needed.${NC}"
fi

echo
echo -e "${BLUE}=== Import Audit Complete ===${NC}"
echo "Detailed reports are available in /tmp/import-audit/"