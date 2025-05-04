import { Player } from '@/types/game';
import { getCheckoutType } from '@/utils/dart-utils';

interface ScoreSubmissionResult {
  error?: string;
  bust?: boolean;
  checkout?: {
    options: number[];
    pendingScore: { scored: number; isCheckout: boolean; previousScore: number };
  };
  normalScore?: {
    scored: number;
    previousScore: number;
  };
}

export function useScoreSubmission(players: Player[]) {
  const handleScoreSubmit = async (score: string): Promise<ScoreSubmissionResult> => {
    const activePlayer = players.find(p => p.isActive);
    if (!activePlayer) {
      return { error: 'No active player' };
    }

    const numericScore = parseInt(score);
    if (isNaN(numericScore)) {
      return { error: 'Invalid score' };
    }

    if (numericScore < 0 || numericScore > 180) {
      return { error: 'Score must be between 0 and 180' };
    }

    const remainingScore = activePlayer.score - numericScore;
    const startScoreForTurn = activePlayer.score;

    if (remainingScore < 0 || remainingScore === 1) {
      return { bust: true };
    }

    if (remainingScore === 0) {
      const checkoutType = getCheckoutType(startScoreForTurn);
      let options: number[];

      if (checkoutType === '3dart') {
        options = [1];
      } else if (checkoutType === '2dart') {
        options = [1, 2];
      } else if (checkoutType === '1dart') {
        options = [1, 2, 3];
      } else {
        options = [1, 2, 3];
      }

      return {
        checkout: {
          options,
          pendingScore: {
            scored: numericScore,
            isCheckout: true,
            previousScore: startScoreForTurn
          }
        }
      };
    }

    if (remainingScore > 1 && remainingScore <= 50) {
      const checkoutType = getCheckoutType(startScoreForTurn);
      let options: number[];

      if (checkoutType === '3dart') {
        options = [0, 1];
      } else if (checkoutType === '2dart') {
        options = [0, 1, 2];
      } else {
        options = [0, 1, 2, 3];
      }

      return {
        checkout: {
          options,
          pendingScore: {
            scored: numericScore,
            isCheckout: false,
            previousScore: startScoreForTurn
          }
        }
      };
    }

    if (remainingScore > 50) {
      return {
        normalScore: {
          scored: numericScore,
          previousScore: startScoreForTurn
        }
      };
    }

    return { error: 'Unexpected score state after checks.' };
  };

  return {
    handleScoreSubmit
  };
}