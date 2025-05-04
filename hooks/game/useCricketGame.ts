import { useState } from 'react';
import { CricketPlayer } from '@/types/cricket';

const ROUTE_ORDER = [20, 19, 18, 17, 16, 15, 25];

export function useCricketGame(
  initialPlayers: CricketPlayer[],
  scoringType: 'cricket' | 'route',
  marksRequired: number
) {
  const [players, setPlayers] = useState<CricketPlayer[]>(initialPlayers);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [currentMarks, setCurrentMarks] = useState(0);

  const activePlayer = players.find(p => p.isActive);

  const getNextRequiredNumber = (player: CricketPlayer): number | null => {
    for (const num of ROUTE_ORDER) {
      if (player.scores[num] < marksRequired) {
        return num;
      }
    }
    return null;
  };

  const calculatePlayerStats = () => {
    if (!activePlayer) return { marksPerTurn: 0, marksDifference: 0 };

    const totalMarks = Object.values(activePlayer.scores).reduce((sum, score) => sum + score, 0);
    const otherPlayers = players.filter(p => p.id !== activePlayer.id);
    const otherPlayersTotalMarks = otherPlayers.map(p => 
      Object.values(p.scores).reduce((sum, score) => sum + score, 0)
    );
    const averageOtherMarks = otherPlayersTotalMarks.length > 0 
      ? otherPlayersTotalMarks.reduce((sum, marks) => sum + marks, 0) / otherPlayersTotalMarks.length
      : 0;

    return {
      marksPerTurn: totalMarks / Math.max(1, Math.floor(totalMarks / 3)),
      marksDifference: totalMarks - averageOtherMarks
    };
  };

  const getAvailableNumbers = (): number[] => {
    if (!activePlayer) return [];

    if (scoringType === 'route') {
      const nextRequired = getNextRequiredNumber(activePlayer);
      if (!nextRequired) return [];
      return [nextRequired];
    }

    return ROUTE_ORDER.filter(num => activePlayer.scores[num] < marksRequired);
  };

  const handleNumberPress = (num: number) => {
    if (!activePlayer) return;
    setSelectedNumber(num);
    setCurrentMarks(prev => prev + 1);
  };

  const handleDelete = () => {
    setSelectedNumber(null);
    setCurrentMarks(0);
  };

  const handleSubmit = () => {
    if (!selectedNumber || !activePlayer) return;

    const updatedPlayers = [...players];
    const activePlayerIndex = updatedPlayers.findIndex(p => p.isActive);
    const player = updatedPlayers[activePlayerIndex];

    // Update marks for the selected number
    const newScore = Math.min(player.scores[selectedNumber] + currentMarks, marksRequired);
    const extraMarks = player.scores[selectedNumber] + currentMarks - marksRequired;
    player.scores[selectedNumber] = newScore;

    // Calculate points if applicable
    if (extraMarks > 0 && scoringType === 'cricket') {
      const isNumberClosedByOthers = updatedPlayers
        .filter(p => p.id !== player.id)
        .every(p => p.scores[selectedNumber] >= marksRequired);

      if (!isNumberClosedByOthers) {
        player.totalPoints += extraMarks * selectedNumber;
      }
    }

    // Check for game completion
    const allNumbersClosed = ROUTE_ORDER.every(num => player.scores[num] >= marksRequired);
    if (allNumbersClosed) {
      // TODO: Implement game completion
      return;
    }

    // Move to next player
    player.isActive = false;
    const nextPlayerIndex = (activePlayerIndex + 1) % players.length;
    updatedPlayers[nextPlayerIndex].isActive = true;

    setPlayers(updatedPlayers);
    setSelectedNumber(null);
    setCurrentMarks(0);
  };

  return {
    players,
    activePlayer,
    selectedNumber,
    currentMarks,
    getNextRequiredNumber,
    calculatePlayerStats,
    getAvailableNumbers,
    handleNumberPress,
    handleDelete,
    handleSubmit,
  };
}