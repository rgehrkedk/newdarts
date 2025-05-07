import { CompletionModal } from '@/components/core/organisms/CompletionModal';

// Define the Player interface within the component file for portability
interface Player {
  id: string;
  name: string;
  color: string;
  score: number;
  gameAvg: number;
  legAvg: number;
  checkoutPercentage: number;
  legs: number;
  sets: number;
  turns: number[];
  oneEighties: number;
  highestCheckout?: number;
}

interface GameCompletionModalProps {
  visible: boolean;
  winner: Player;
  players: Player[];
  onRestart: () => void;
  onHome: () => void;
}

export function GameCompletionModal({ visible, winner, players, onRestart, onHome }: GameCompletionModalProps) {
  return (
    <CompletionModal
      visible={visible}
      title="Game Complete!"
      winner={winner}
      players={players}
      showStats={true}
      showActions={true}
      onRestart={onRestart}
      onHome={onHome}
    />
  );
}