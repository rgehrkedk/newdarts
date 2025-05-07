/**
 * Type definitions for application navigation routes.
 * This provides type safety when navigating between screens.
 */

export type AppRoutes = {
  // Auth route
  'auth': undefined;
  
  // Tab navigation routes
  '(tabs)': undefined;
  '(tabs)/index': undefined;
  '(tabs)/leaderboard': undefined;
  '(tabs)/play': undefined;
  '(tabs)/stats': undefined;
  '(tabs)/settings': undefined;
  
  // Game routes
  '(screens)/(game)/x01/setup': { 
    preselectedPlayers?: string; // JSON stringified array of player objects
  };
  '(screens)/(game)/x01/play': { 
    players: string; // JSON stringified array of player objects
    totalLegs: string;
    totalSets: string;
    variant: string;
  };
  '(screens)/(game)/cricket/setup': { 
    preselectedPlayers?: string; // JSON stringified array of player objects
  };
  '(screens)/(game)/cricket/play': { 
    players: string; // JSON stringified array of player objects
    scoringType: string;
    marksRequired: string;
  };
  
  // Player management routes
  '(screens)/(players)/list': undefined;
  '(screens)/(players)/create': undefined;
  '(screens)/(players)/edit/[id]': { id: string };
  '(screens)/(players)/stats/[id]': { id: string };
  
  // Modal routes
  '(screens)/(modals)/player-details/[id]': { id: string };
  '(screens)/(modals)/game-complete': { 
    gameData: string; // JSON stringified game data including players and winner
  };
  '(screens)/(modals)/leg-complete': { 
    gameData: string; // JSON stringified game data
    onContinue?: string; // 'true' to handle continue action
  };
  '(screens)/(modals)/set-complete': { 
    gameData: string; // JSON stringified game data
    onContinue?: string; // 'true' to handle continue action
  };
  '(screens)/(modals)/checkout': { 
    score: string;
    isCheckout: string; // 'true' or 'false'
  };
};