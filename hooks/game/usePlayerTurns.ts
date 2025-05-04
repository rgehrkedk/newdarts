import { Player } from '@/types/game';
import { calculateAverage, calculateGameAverage, calculateCheckoutPercentage } from './useScoreCalculation';

export function usePlayerTurns() {
  const updatePlayerTurn = (
    players: Player[],
    activePlayerIndex: number,
    score: number,
    totalDartsThrownThisTurn: number,
    dartsUsedForCheckoutAttempt: number
  ): Player[] => {
    const updatedPlayers = [...players];
    const activePlayer = updatedPlayers[activePlayerIndex];

    const previousScore = activePlayer.score;
    const isCheckout = activePlayer.score - score === 0;
    const checkoutAttempted = dartsUsedForCheckoutAttempt > 0;
    const isOneEighty = score === 180;

    activePlayer.score = previousScore - score;
    activePlayer.turns = [score, ...activePlayer.turns];
    activePlayer.legTurns = [score, ...activePlayer.legTurns];
    activePlayer.dartsThrownThisLeg += totalDartsThrownThisTurn;
    activePlayer.totalScoreThrownThisLeg += score;

    if (isOneEighty) {
      activePlayer.oneEighties += 1;
    }

    if (checkoutAttempted || isCheckout) {
      if (isCheckout) {
        activePlayer.totalCheckoutAttempts += dartsUsedForCheckoutAttempt;
        activePlayer.successfulCheckouts += 1;
      } else {
        activePlayer.totalCheckoutAttempts += dartsUsedForCheckoutAttempt;
      }
      activePlayer.checkoutPercentage = calculateCheckoutPercentage(
        activePlayer.successfulCheckouts,
        activePlayer.totalCheckoutAttempts
      );
    }

    activePlayer.legAvg = calculateAverage(
      activePlayer.totalScoreThrownThisLeg,
      activePlayer.dartsThrownThisLeg
    );

    activePlayer.gameAvg = calculateGameAverage(
      activePlayer.turns,
      activePlayer.dartsThrownThisLeg
    );

    return updatedPlayers;
  };

  const switchToNextPlayer = (players: Player[], currentPlayerIndex: number): Player[] => {
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].isActive = false;
    const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
    updatedPlayers[nextPlayerIndex].isActive = true;
    return updatedPlayers;
  };

  return {
    updatePlayerTurn,
    switchToNextPlayer
  };
}