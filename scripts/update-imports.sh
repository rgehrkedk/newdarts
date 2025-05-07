#!/bin/bash

# update-imports.sh
# Script to batch update import patterns in the codebase
# Usage: ./scripts/update-imports.sh [--dry-run]

DRY_RUN=false
if [ "$1" = "--dry-run" ]; then
  DRY_RUN=true
  echo "Running in dry run mode (no changes will be made)"
fi

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Import Pattern Update ===${NC}"
echo "This script will update old import patterns to the new component structure."
echo

# Create temp directory for logs
mkdir -p /tmp/import-updates
LOG_FILE="/tmp/import-updates/update-log-$(date +%Y%m%d-%H%M%S).txt"
SUMMARY_FILE="/tmp/import-updates/summary-$(date +%Y%m%d-%H%M%S).txt"

# Log function
log() {
  echo "$1" | tee -a "$LOG_FILE"
}

# Update core atoms imports
update_core_atoms() {
  echo -e "${GREEN}Updating Core Atoms imports...${NC}"
  log "=== Updating Core Atoms imports ==="
  
  # @/components/ui/atoms/* -> @core/atoms/*
  local count=0
  local files=$(grep -r -l --include="*.tsx" --include="*.ts" "@/components/ui/atoms" /workspaces/newdarts | grep -v "node_modules")
  for file in $files; do
    log "Processing file: $file"
    if [ "$DRY_RUN" = false ]; then
      sed -i 's|@/components/ui/atoms/|@core/atoms/|g' "$file"
      count=$((count + 1))
    else
      log "Would replace '@/components/ui/atoms/' with '@core/atoms/' in $file"
    fi
  done
  echo -e "${YELLOW}Updated $count files with @/components/ui/atoms pattern${NC}"
  
  # ../ui/atoms/* -> @core/atoms/*
  count=0
  files=$(grep -r -l --include="*.tsx" --include="*.ts" "../ui/atoms" /workspaces/newdarts | grep -v "node_modules")
  for file in $files; do
    log "Processing file: $file"
    if [ "$DRY_RUN" = false ]; then
      sed -i 's|\.\.\/ui\/atoms\/|@core/atoms/|g' "$file"
      count=$((count + 1))
    else
      log "Would replace '../ui/atoms/' with '@core/atoms/' in $file"
    fi
  done
  echo -e "${YELLOW}Updated $count files with ../ui/atoms pattern${NC}"
  
  # ./ui/atoms/* -> @core/atoms/*
  count=0
  files=$(grep -r -l --include="*.tsx" --include="*.ts" "./ui/atoms" /workspaces/newdarts | grep -v "node_modules")
  for file in $files; do
    log "Processing file: $file"
    if [ "$DRY_RUN" = false ]; then
      sed -i 's|\.\/ui\/atoms\/|@core/atoms/|g' "$file"
      count=$((count + 1))
    else
      log "Would replace './ui/atoms/' with '@core/atoms/' in $file"
    fi
  done
  echo -e "${YELLOW}Updated $count files with ./ui/atoms pattern${NC}"
}

# Update core molecules imports
update_core_molecules() {
  echo -e "${GREEN}Updating Core Molecules imports...${NC}"
  log "=== Updating Core Molecules imports ==="
  
  # @/components/ui/molecules/* -> @core/molecules/*
  local count=0
  local files=$(grep -r -l --include="*.tsx" --include="*.ts" "@/components/ui/molecules" /workspaces/newdarts | grep -v "node_modules")
  for file in $files; do
    log "Processing file: $file"
    if [ "$DRY_RUN" = false ]; then
      sed -i 's|@/components/ui/molecules/|@core/molecules/|g' "$file"
      count=$((count + 1))
    else
      log "Would replace '@/components/ui/molecules/' with '@core/molecules/' in $file"
    fi
  done
  echo -e "${YELLOW}Updated $count files with @/components/ui/molecules pattern${NC}"
  
  # ../ui/molecules/* -> @core/molecules/*
  count=0
  files=$(grep -r -l --include="*.tsx" --include="*.ts" "../ui/molecules" /workspaces/newdarts | grep -v "node_modules")
  for file in $files; do
    log "Processing file: $file"
    if [ "$DRY_RUN" = false ]; then
      sed -i 's|\.\.\/ui\/molecules\/|@core/molecules/|g' "$file"
      count=$((count + 1))
    else
      log "Would replace '../ui/molecules/' with '@core/molecules/' in $file"
    fi
  done
  echo -e "${YELLOW}Updated $count files with ../ui/molecules pattern${NC}"
  
  # ./ui/molecules/* -> @core/molecules/*
  count=0
  files=$(grep -r -l --include="*.tsx" --include="*.ts" "./ui/molecules" /workspaces/newdarts | grep -v "node_modules")
  for file in $files; do
    log "Processing file: $file"
    if [ "$DRY_RUN" = false ]; then
      sed -i 's|\.\/ui\/molecules\/|@core/molecules/|g' "$file"
      count=$((count + 1))
    else
      log "Would replace './ui/molecules/' with '@core/molecules/' in $file"
    fi
  done
  echo -e "${YELLOW}Updated $count files with ./ui/molecules pattern${NC}"
}

# Update core organisms imports
update_core_organisms() {
  echo -e "${GREEN}Updating Core Organisms imports...${NC}"
  log "=== Updating Core Organisms imports ==="
  
  # @/components/ui/organisms/* -> @core/organisms/*
  local count=0
  local files=$(grep -r -l --include="*.tsx" --include="*.ts" "@/components/ui/organisms" /workspaces/newdarts | grep -v "node_modules")
  for file in $files; do
    log "Processing file: $file"
    if [ "$DRY_RUN" = false ]; then
      sed -i 's|@/components/ui/organisms/|@core/organisms/|g' "$file"
      count=$((count + 1))
    else
      log "Would replace '@/components/ui/organisms/' with '@core/organisms/' in $file"
    fi
  done
  echo -e "${YELLOW}Updated $count files with @/components/ui/organisms pattern${NC}"
  
  # ../ui/organisms/* -> @core/organisms/*
  count=0
  files=$(grep -r -l --include="*.tsx" --include="*.ts" "../ui/organisms" /workspaces/newdarts | grep -v "node_modules")
  for file in $files; do
    log "Processing file: $file"
    if [ "$DRY_RUN" = false ]; then
      sed -i 's|\.\.\/ui\/organisms\/|@core/organisms/|g' "$file"
      count=$((count + 1))
    else
      log "Would replace '../ui/organisms/' with '@core/organisms/' in $file"
    fi
  done
  echo -e "${YELLOW}Updated $count files with ../ui/organisms pattern${NC}"
  
  # ./ui/organisms/* -> @core/organisms/*
  count=0
  files=$(grep -r -l --include="*.tsx" --include="*.ts" "./ui/organisms" /workspaces/newdarts | grep -v "node_modules")
  for file in $files; do
    log "Processing file: $file"
    if [ "$DRY_RUN" = false ]; then
      sed -i 's|\.\/ui\/organisms\/|@core/organisms/|g' "$file"
      count=$((count + 1))
    else
      log "Would replace './ui/organisms/' with '@core/organisms/' in $file"
    fi
  done
  echo -e "${YELLOW}Updated $count files with ./ui/organisms pattern${NC}"
}

# Update game component imports
update_game_components() {
  echo -e "${GREEN}Updating Game component imports...${NC}"
  log "=== Updating Game component imports ==="
  
  # @/components/game/* -> @features/game/common/*
  local count=0
  local files=$(grep -r -l --include="*.tsx" --include="*.ts" "@/components/game" /workspaces/newdarts | grep -v "node_modules")
  for file in $files; do
    log "Processing file: $file"
    if [ "$DRY_RUN" = false ]; then
      sed -i 's|@/components/game/|@features/game/common/|g' "$file"
      count=$((count + 1))
    else
      log "Would replace '@/components/game/' with '@features/game/common/' in $file"
    fi
  done
  echo -e "${YELLOW}Updated $count files with @/components/game pattern${NC}"
  
  # ../game/* -> @features/game/common/*  
  count=0
  files=$(grep -r -l --include="*.tsx" --include="*.ts" "../game" /workspaces/newdarts | grep -v "node_modules")
  for file in $files; do
    log "Processing file: $file"
    if [ "$DRY_RUN" = false ]; then
      sed -i 's|\.\.\/game\/|@features/game/common/|g' "$file"
      count=$((count + 1))
    else
      log "Would replace '../game/' with '@features/game/common/' in $file"
    fi
  done
  echo -e "${YELLOW}Updated $count files with ../game pattern${NC}"
  
  # ./game/* -> @features/game/common/*  
  count=0
  files=$(grep -r -l --include="*.tsx" --include="*.ts" "./game" /workspaces/newdarts | grep -v "node_modules")
  for file in $files; do
    log "Processing file: $file"
    if [ "$DRY_RUN" = false ]; then
      sed -i 's|\.\/game\/|@features/game/common/|g' "$file"
      count=$((count + 1))
    else
      log "Would replace './game/' with '@features/game/common/' in $file"
    fi
  done
  echo -e "${YELLOW}Updated $count files with ./game pattern${NC}"
}

# Update stats component imports
update_stats_components() {
  echo -e "${GREEN}Updating Stats component imports...${NC}"
  log "=== Updating Stats component imports ==="
  
  # @/components/stats/* -> @features/stats/*
  local count=0
  local files=$(grep -r -l --include="*.tsx" --include="*.ts" "@/components/stats" /workspaces/newdarts | grep -v "node_modules")
  for file in $files; do
    log "Processing file: $file"
    if [ "$DRY_RUN" = false ]; then
      sed -i 's|@/components/stats/|@features/stats/|g' "$file"
      count=$((count + 1))
    else
      log "Would replace '@/components/stats/' with '@features/stats/' in $file"
    fi
  done
  echo -e "${YELLOW}Updated $count files with @/components/stats pattern${NC}"
  
  # ../stats/* -> @features/stats/*  
  count=0
  files=$(grep -r -l --include="*.tsx" --include="*.ts" "../stats" /workspaces/newdarts | grep -v "node_modules")
  for file in $files; do
    log "Processing file: $file"
    if [ "$DRY_RUN" = false ]; then
      sed -i 's|\.\.\/stats\/|@features/stats/|g' "$file"
      count=$((count + 1))
    else
      log "Would replace '../stats/' with '@features/stats/' in $file"
    fi
  done
  echo -e "${YELLOW}Updated $count files with ../stats pattern${NC}"
  
  # ./stats/* -> @features/stats/*  
  count=0
  files=$(grep -r -l --include="*.tsx" --include="*.ts" "./stats" /workspaces/newdarts | grep -v "node_modules")
  for file in $files; do
    log "Processing file: $file"
    if [ "$DRY_RUN" = false ]; then
      sed -i 's|\.\/stats\/|@features/stats/|g' "$file"
      count=$((count + 1))
    else
      log "Would replace './stats/' with '@features/stats/' in $file"
    fi
  done
  echo -e "${YELLOW}Updated $count files with ./stats pattern${NC}"
}

# Update setup component imports
update_setup_components() {
  echo -e "${GREEN}Updating Setup component imports...${NC}"
  log "=== Updating Setup component imports ==="
  
  # @/components/setup/* -> @features/game/setup/*
  local count=0
  local files=$(grep -r -l --include="*.tsx" --include="*.ts" "@/components/setup" /workspaces/newdarts | grep -v "node_modules")
  for file in $files; do
    log "Processing file: $file"
    if [ "$DRY_RUN" = false ]; then
      sed -i 's|@/components/setup/|@features/game/setup/|g' "$file"
      count=$((count + 1))
    else
      log "Would replace '@/components/setup/' with '@features/game/setup/' in $file"
    fi
  done
  echo -e "${YELLOW}Updated $count files with @/components/setup pattern${NC}"
  
  # ../setup/* -> @features/game/setup/*  
  count=0
  files=$(grep -r -l --include="*.tsx" --include="*.ts" "../setup" /workspaces/newdarts | grep -v "node_modules")
  for file in $files; do
    log "Processing file: $file"
    if [ "$DRY_RUN" = false ]; then
      sed -i 's|\.\.\/setup\/|@features/game/setup/|g' "$file"
      count=$((count + 1))
    else
      log "Would replace '../setup/' with '@features/game/setup/' in $file"
    fi
  done
  echo -e "${YELLOW}Updated $count files with ../setup pattern${NC}"
  
  # ./setup/* -> @features/game/setup/*  
  count=0
  files=$(grep -r -l --include="*.tsx" --include="*.ts" "./setup" /workspaces/newdarts | grep -v "node_modules")
  for file in $files; do
    log "Processing file: $file"
    if [ "$DRY_RUN" = false ]; then
      sed -i 's|\.\/setup\/|@features/game/setup/|g' "$file"
      count=$((count + 1))
    else
      log "Would replace './setup/' with '@features/game/setup/' in $file"
    fi
  done
  echo -e "${YELLOW}Updated $count files with ./setup pattern${NC}"
}

# Main execution
echo "Starting import updates at $(date)" > "$LOG_FILE"

echo -e "${YELLOW}Step 1: Updating Core Component Imports${NC}"
update_core_atoms
update_core_molecules
update_core_organisms

echo -e "${YELLOW}Step 2: Updating Feature Component Imports${NC}"
update_game_components
update_stats_components
update_setup_components

# Generate summary
echo -e "${GREEN}=== Import Update Summary ===${NC}" | tee "$SUMMARY_FILE"
if [ "$DRY_RUN" = true ]; then
  echo -e "${YELLOW}Dry run completed. No files were modified.${NC}" | tee -a "$SUMMARY_FILE"
else
  echo -e "${GREEN}Import updates completed successfully!${NC}" | tee -a "$SUMMARY_FILE"
fi

echo -e "${BLUE}Next Steps:${NC}" | tee -a "$SUMMARY_FILE"
echo "1. Run 'npm run dev' to test the app with the updated imports" | tee -a "$SUMMARY_FILE"
echo "2. Use 'scripts/audit-imports.sh' to check for any remaining old patterns" | tee -a "$SUMMARY_FILE"
echo "3. Check log file at $LOG_FILE for details" | tee -a "$SUMMARY_FILE"

echo -e "${BLUE}=== Import Update Complete ===${NC}"