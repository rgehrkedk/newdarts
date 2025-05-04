import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { Player } from '@/types/game';
import { useGameCompletion } from './useGameCompletion';
import { usePlayerTurns } from './usePlayerTurns';
import { useGameState } from './useGameState';
import { usePlayerState } from './usePlayerState';
import { useScoreSubmission } from './useScoreSubmission';
import { getCheckoutType } from '@/utils/dart-utils';
import * as Crypto from 'expo-crypto';

export function useGameLogic(
  initialPlayers: Player[] = [],
  totalLegs: number = 1,
  totalSets: number = 1,
  variant: number = 501
) {
  const router = useRouter();
  const { state, updateState } = useGameState();
  const { players, setPlayers, activePlayer } = usePlayerState(initialPlayers, variant);
  const { handleScoreSubmit } = useScoreSubmission(players);
  const [legStarterIndex, setLegStarterIndex] = useState(0);
  const [gameId] = useState(() => Crypto.randomUUID());

  const { initializeGame, handleGameCompletion } = useGameCompletion({
    gameId,
    totalLegs,
    totalSets,
    currentSet: state.currentSet,
    currentLeg: state.currentLeg,
    variant
  });

  useEffect(() => {
    const initGame = async () => {
      await initializeGame(players);
    };
    initGame();
  }, []);

  const { updatePlayerTurn, switchToNextPlayer } = usePlayerTurns();

  const handleNumberPress = (num: string) => {
    if (state.isProcessing) return;
    updateState({ error: '' });
    if (state.currentScore.length < 3) {
      const newScore = state.currentScore + num;
      if (parseInt(newScore, 10) <= 180) {
        updateState({ currentScore: newScore });
      } else {
        updateState({ error: 'Maximum score is 180' });
      }
    }
  };

  const handleDelete = () => {
    if (state.isProcessing) return;
    updateState({
      currentScore: '',
      error: ''
    });
  };

  const updatePlayerScore = async (score: number, totalDartsThrownThisTurn: number, dartsUsedForCheckoutAttempt: number) => {
    if (state.isProcessing) return;
    updateState({ isProcessing: true });

    const activePlayerIndex = players.findIndex(p => p.isActive);
    if (activePlayerIndex === -1) {
      updateState({ isProcessing: false });
      return;
    }

    let updatedPlayers = updatePlayerTurn(
      players,
      activePlayerIndex,
      score,
      totalDartsThrownThisTurn,
      dartsUsedForCheckoutAttempt
    );

    const activePlayer = updatedPlayers[activePlayerIndex];

    if (activePlayer.score === 0) {
      const gameCompleted = await handleGameCompletion(
        activePlayer,
        updatedPlayers,
        setPlayers,
        updateState
      );
      if (gameCompleted) return;
    }

    updatedPlayers = switchToNextPlayer(updatedPlayers, activePlayerIndex);
    setPlayers(updatedPlayers);

    updateState({
      currentScore: '',
      error: '',
      isProcessing: false,
      checkoutModalVisible: false,
      pendingScore: null
    });
  };

  const handleBust = async (updatedPlayers: Player[], activePlayerIndex: number) => {
    if (activePlayerIndex === -1) return;

    const activePlayer = updatedPlayers[activePlayerIndex];
    const scoreBeforeBust = activePlayer.score;

    let updatedPlayersList = updatePlayerTurn(
      updatedPlayers,
      activePlayerIndex,
      0,
      3,
      scoreBeforeBust <= 170 ? 3 : 0
    );

    updateState({
      showBust: true,
      message: `Bust! Score remains ${scoreBeforeBust}. Next player's turn.`
    });

    await new Promise(resolve => setTimeout(resolve, 1500));

    updateState({ showBust: false });

    updatedPlayersList = switchToNextPlayer(updatedPlayersList, activePlayerIndex);
    setPlayers(updatedPlayersList);

    updateState({
      currentScore: '',
      error: '',
      isProcessing: false
    });
  };

  const handleSubmit = async () => {
    if (state.isProcessing) return;
    if (!state.currentScore) {
      updateState({ error: 'Please enter a score' });
      return;
    }

    const result = await handleScoreSubmit(state.currentScore);

    if (result.error) {
      updateState({ error: result.error, currentScore: '' });
      return;
    }

    if (result.bust) {
      const updatedPlayers = [...players];
      const activePlayerIndex = players.findIndex(p => p.isActive);
      handleBust(updatedPlayers, activePlayerIndex);
      return;
    }

    if (result.checkout) {
      updateState({
        checkoutOptions: result.checkout.options,
        pendingScore: result.checkout.pendingScore,
        checkoutModalVisible: true,
        currentScore: '',
        error: ''
      });
      return;
    }

    if (result.normalScore) {
      updatePlayerScore(result.normalScore.scored, 3, 0);
      return;
    }

    updateState({ error: 'Failed to process score submission.', currentScore: '' });
  };

  const handleCheckoutAttempt = (dartsAtDouble: number) => {
    if (!state.pendingScore) return;

    const { scored, previousScore, isCheckout } = state.pendingScore;
    const checkoutType = getCheckoutType(previousScore);
    let totalDartsThrownThisTurn: number;

    if (isCheckout) {
      if (checkoutType === '3dart') {
        totalDartsThrownThisTurn = 3;
      } else if (checkoutType === '2dart') {
        totalDartsThrownThisTurn = dartsAtDouble + 1;
      } else {
        totalDartsThrownThisTurn = dartsAtDouble;
      }
    } else {
      totalDartsThrownThisTurn = 3;
    }

    totalDartsThrownThisTurn = Math.max(1, Math.min(3, totalDartsThrownThisTurn));

    updateState({
      checkoutModalVisible: false,
      pendingScore: null
    });

    updatePlayerScore(scored, totalDartsThrownThisTurn, dartsAtDouble);
  };

  const handleNextPlayer = () => {
    if (state.isProcessing) return;
    updatePlayerScore(0, 3, 0);
  };

  const handleUndo = () => {
    if (state.isProcessing || state.history.length === 0) return;

    const lastState = state.history[state.history.length - 1];

    const restoredPlayers = JSON.parse(JSON.stringify(lastState.players));
    setPlayers(restoredPlayers);

    const activePlayerNow = players.find(p => p.isActive);
    const playerWhoPlayedLastIndex = activePlayerNow
      ? (players.indexOf(activePlayerNow) + players.length - 1) % players.length
      : (legStarterIndex + state.history.length - 1) % players.length;

    updateState(prev => ({
      ...prev,
      history: prev.history.slice(0, -1),
      currentScore: '',
      error: '',
      winner: null,
      legWinner: null,
      setWinner: null,
      gameCompletionVisible: false,
      legCompletionVisible: false,
      setCompletionVisible: false,
      isProcessing: false,
      pendingScore: null,
      checkoutModalVisible: false,
    }));
  };

  const handleCommonScorePress = (score: number) => {
    if (state.isProcessing) return;
    updateState({
      currentScore: score.toString(),
      error: ''
    });
  };

  const handleRestart = async () => {
    const resetPlayers = players.map((player, index) => ({
      ...player,
      score: variant,
      legAvg: 0,
      gameAvg: 0,
      checkoutPercentage: 0,
      isActive: index === 0,
      turns: [],
      legTurns: [],
      legs: 0,
      sets: 0,
      totalCheckoutAttempts: 0,
      successfulCheckouts: 0,
      totalScoreThrownThisLeg: 0,
      dartsThrownThisLeg: 0,
    }));

    setLegStarterIndex(0);
    setPlayers(resetPlayers);

    updateState({
      history: [],
      currentScore: '',
      error: '',
      gameCompletionVisible: false,
      legCompletionVisible: false,
      setCompletionVisible: false,
      checkoutModalVisible: false,
      winner: null,
      legWinner: null,
      setWinner: null,
      message: 'Game restarted. Player 1 starts.',
      currentLeg: 1,
      currentSet: 1,
      isProcessing: false,
      pendingScore: null
    });
  };

  const handleHome = () => {
    router.replace('/');
  };

  const handleContinue = () => {
    const nextStarterIndex = (legStarterIndex + 1) % players.length;
    setLegStarterIndex(nextStarterIndex);

    const resetPlayers = players.map(player => ({
      ...player,
      score: variant,
      legTurns: [],
      legAvg: 0,
      totalScoreThrownThisLeg: 0,
      dartsThrownThisLeg: 0,
      isActive: players.indexOf(player) === nextStarterIndex
    }));

    setPlayers(resetPlayers);

    updateState({
      legCompletionVisible: false,
      setCompletionVisible: false,
      legWinner: null,
      setWinner: null,
      currentScore: '',
      error: '',
      isProcessing: false
    });
  };

  return {
    players,
    activePlayer,
    ...state,
    handleNumberPress,
    handleDelete,
    handleSubmit,
    handleCommonScorePress,
    handleUndo,
    handleNextPlayer,
    handleCheckoutAttempt,
    handleRestart,
    handleHome,
    handleContinue,
  };
}