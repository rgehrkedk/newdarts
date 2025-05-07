import { router } from 'expo-router';
import { AppRoutes } from '@/types/navigation';

/**
 * Type-safe navigation function that ensures correct route parameters.
 * 
 * @param route The navigation route path
 * @param params Optional route parameters
 */
export function navigate<T extends keyof AppRoutes>(
  route: T,
  params?: AppRoutes[T]
): void {
  router.push({
    pathname: route as string,
    params: params as Record<string, string>,
  });
}

/**
 * Type-safe navigation replacement (replaces current route in history).
 * 
 * @param route The navigation route path
 * @param params Optional route parameters
 */
export function replaceRoute<T extends keyof AppRoutes>(
  route: T,
  params?: AppRoutes[T]
): void {
  router.replace({
    pathname: route as string,
    params: params as Record<string, string>,
  });
}

/**
 * Type-safe modal presentation.
 * 
 * @param route The modal route to present
 * @param params Optional modal parameters
 */
export function presentModal<T extends keyof AppRoutes>(
  route: T,
  params?: AppRoutes[T]
): void {
  router.push({
    pathname: route as string,
    params: params as Record<string, string>,
  });
}

/**
 * Type-safe navigation back with optional parameters.
 * 
 * @param params Optional parameters to pass back to the previous screen
 */
export function goBack(params?: Record<string, string>): void {
  router.back(params);
}

/**
 * Navigate to the game setup screen for a specific game type.
 * 
 * @param gameType The type of game ('x01' or 'cricket')
 * @param preselectedPlayers Optional preselected players
 */
export function navigateToGameSetup(
  gameType: 'x01' | 'cricket',
  preselectedPlayers?: any[]
): void {
  const route = gameType === 'x01' 
    ? '(screens)/(game)/x01/setup' 
    : '(screens)/(game)/cricket/setup';
    
  navigate(route as any, {
    preselectedPlayers: preselectedPlayers 
      ? JSON.stringify(preselectedPlayers) 
      : undefined
  });
}

/**
 * Present a game completion modal.
 * 
 * @param gameData Game data including players and winner
 */
export function showGameCompletionModal(gameData: any): void {
  presentModal('(screens)/(modals)/game-complete', {
    gameData: JSON.stringify(gameData)
  });
}

/**
 * Present a leg completion modal.
 * 
 * @param gameData Game data including players and winner
 * @param onContinue Set to true to enable continue functionality
 */
export function showLegCompletionModal(gameData: any, onContinue: boolean = true): void {
  presentModal('(screens)/(modals)/leg-complete', {
    gameData: JSON.stringify(gameData),
    onContinue: onContinue ? 'true' : 'false'
  });
}

/**
 * Present a set completion modal.
 * 
 * @param gameData Game data including players and winner
 * @param onContinue Set to true to enable continue functionality
 */
export function showSetCompletionModal(gameData: any, onContinue: boolean = true): void {
  presentModal('(screens)/(modals)/set-complete', {
    gameData: JSON.stringify(gameData),
    onContinue: onContinue ? 'true' : 'false'
  });
}

/**
 * Present a checkout modal.
 * 
 * @param score The score value
 * @param isCheckout Whether this is a successful checkout
 */
export function showCheckoutModal(score: number, isCheckout: boolean): void {
  presentModal('(screens)/(modals)/checkout', {
    score: score.toString(),
    isCheckout: isCheckout ? 'true' : 'false'
  });
}

/**
 * Navigate to player details screen.
 * 
 * @param playerId The ID of the player to view
 */
export function navigateToPlayerDetails(playerId: string): void {
  navigate('(screens)/(players)/stats/[id]', { id: playerId });
}

/**
 * Navigate to player edit screen.
 * 
 * @param playerId The ID of the player to edit
 */
export function navigateToPlayerEdit(playerId: string): void {
  navigate('(screens)/(players)/edit/[id]', { id: playerId });
}

/**
 * Present a player details modal.
 * 
 * @param playerId The ID of the player to view
 */
export function showPlayerDetailsModal(playerId: string): void {
  presentModal('(screens)/(modals)/player-details/[id]', { id: playerId });
}

/**
 * Navigate to the home screen.
 */
export function navigateToHome(): void {
  navigate('(tabs)/index');
}

/**
 * Navigate to the player list screen.
 */
export function navigateToPlayerList(): void {
  navigate('(screens)/(players)/list');
}

/**
 * Navigate to the create player screen.
 */
export function navigateToCreatePlayer(): void {
  navigate('(screens)/(players)/create');
}