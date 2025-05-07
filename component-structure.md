# Component Structure

This document outlines the new component structure for the Darts Scorer App, following the atomic design pattern with a clean separation between core components and feature-specific components.

## Directory Structure

```
/components
  /core                         # Core atomic design components (generic, reusable)
    /atoms                      # Fundamental UI elements
      Button.tsx
      Card.tsx
      Input.tsx
      Text.tsx
      IconButton.tsx
      Avatar.tsx
      ChipButton.tsx
      StatItem.tsx
      ...
    /molecules                  # Combinations of atoms
      Accordion.tsx
      Counter.tsx
      DateFilter.tsx
      DateRangePicker.tsx
      Drawer.tsx
      ListItem.tsx
      SegmentedControl.tsx
      ColorPicker.tsx
      ConfirmDialog.tsx
      GradientCard.tsx
      LeaderboardItem.tsx
      PlayerStatsListItem.tsx
      SortDropdown.tsx
      ...
    /organisms                  # Complex UI components
      BaseModal.tsx             # Foundation for all modals
      CompletionModal.tsx       # Base completion modal
      BasicLoadingScreen.tsx    # Basic loading screen
      ...

  /features                     # Feature-specific components (contextual)
    /players                    # Player management components
      PlayerDetailsCard.tsx
      PlayerDrawer.tsx
      PlayerForm.tsx
      PlayerList.tsx
      
    /game                       # Game-specific components
      /cricket                  # Cricket game components
        CricketScoreInput.tsx
        CricketPlayerCard.tsx
        CricketPlayerStats.tsx
      /common                   # Shared game components
        ScoreInput.tsx
        PlayerCard.tsx
        PlayerAccordion.tsx
        PlayerStatsCard.tsx
        CompletionModals/       # Game completion modal variants
          GameCompletionModal.tsx
          LegCompletionModal.tsx
          SetCompletionModal.tsx
          CheckoutModal.tsx
      /setup                    # Game setup components
        GameSettingsCard.tsx
        CricketSettingsCard.tsx
        
    /stats                      # Statistics components
      PlayerStats.tsx
      PlayerStatsModal.tsx
      /components
        GameHistoryList.tsx
        HighScores.tsx
        Highlights.tsx
        PerformanceSummary.tsx
        PeriodFilter.tsx
        PlayerStatsOverlay.tsx
        RecentGame.tsx
        StickyHeader.tsx
        TrendChart.tsx
        
    /auth                       # Authentication components
      AuthForm.tsx
      
  /layout                       # Layout components
    Header.tsx
    Container.tsx
    TabBar.tsx
```

## Import Patterns

We use path aliases for cleaner imports, configured in `tsconfig.json`:

```json
"paths": {
  "@/*": ["./*"],
  "@components/*": ["components/*"],
  "@core/*": ["components/core/*"],
  "@features/*": ["components/features/*"],
  "@layout/*": ["components/layout/*"]
}
```

### Examples

```typescript
// Core components (generic, reusable)
import { Text, Button, Card } from '@core/atoms';
import { Accordion, Counter, GradientCard } from '@core/molecules';
import { BaseModal, CompletionModal } from '@core/organisms';

// Feature components (contextual, feature-specific)
import { PlayerCard, ScoreInput } from '@features/game/common';
import { CricketScoreInput } from '@features/game/cricket';
import { GameSettingsCard } from '@features/game/setup';
import { PlayerDetailsCard } from '@features/players';
import { PlayerStats } from '@features/stats';

// Layout components 
import { Header, Container, TabBar } from '@layout';
```

## Component Naming Conventions

- Core components: Generic, focused on UI patterns (Button, Card, Text)
- Feature components: Contextual, domain-specific (PlayerCard, ScoreInput, CricketPlayerStats)
- Layout components: Structure-oriented (Header, Container, TabBar)

## Design Principles

1. **Separation of concerns**: Core UI components are separated from feature-specific components
2. **Reusability**: Core components are designed to be reusable across the application
3. **Composability**: Higher-level components are built by composing lower-level components
4. **Consistent naming**: Components follow a consistent naming pattern within each category
5. **Semantics**: Components are named based on their semantic meaning, not their visual appearance
6. **Minimalism**: Components are designed to do one thing well, following the Single Responsibility Principle

## Barrel Files

Each directory contains an `index.ts` file that exports all components in that directory. This allows for cleaner imports:

```typescript
// Instead of
import { Button } from '@core/atoms/Button';
import { Card } from '@core/atoms/Card';
import { Text } from '@core/atoms/Text';

// You can use
import { Button, Card, Text } from '@core/atoms';
```