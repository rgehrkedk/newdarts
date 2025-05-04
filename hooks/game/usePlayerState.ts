import { useState, useEffect } from 'react';
import { Player } from '@/types/game';

export function usePlayerState(
  initialPlayers: Player[] = [],
  initialScore: number = 501
) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers.map(player => ({
    ...player,
    score: initialScore,
    legTurns: [],
    turns: [],
    totalCheckoutAttempts: 0,
    successfulCheckouts: 0,
    totalScoreThrownThisLeg: 0,
    dartsThrownThisLeg: 0,
    legAvg: 0,
    gameAvg: 0,
    checkoutPercentage: 0,
    legs: 0,
    sets: 0,
    oneEighties: 0, // Initialize oneEighties counter
    isActive: player.isActive !== undefined ? player.isActive : false
  })));

  useEffect(() => {
    setPlayers(currentPlayers => {
      const activePlayerExists = currentPlayers.some(p => p.isActive);
      if (!activePlayerExists && currentPlayers.length > 0) {
        return currentPlayers.map((p, index) => ({
          ...p,
          isActive: index === 0
        }));
      }
      return currentPlayers;
    });
  }, []);

  return {
    players,
    setPlayers,
    activePlayer: players.find(p => p.isActive)
  };
}