import { useState } from 'react';
import { GameState } from '@/types/game';

export function useGameState(initialState: Partial<GameState> = {}) {
  const [state, setState] = useState<GameState>({
    currentScore: '',
    error: '',
    isProcessing: false,
    history: [],
    winner: null,
    legWinner: null,
    setWinner: null,
    gameCompletionVisible: false,
    legCompletionVisible: false,
    setCompletionVisible: false,
    checkoutModalVisible: false,
    pendingScore: null,
    checkoutOptions: [],
    showBust: false,
    message: 'Start match',
    currentLeg: 1,
    currentSet: 1,
    ...initialState
  });

  const updateState = (newState: Partial<GameState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  return {
    state,
    updateState
  };
}