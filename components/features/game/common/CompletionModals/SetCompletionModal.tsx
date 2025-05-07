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

interface SetCompletionModalProps {
  visible: boolean;
  winner: Player;
  players: Player[];
  onContinue: () => void;
}

export function SetCompletionModal({ visible, winner, players, onContinue }: SetCompletionModalProps) {
  return (
    <CompletionModal
      visible={visible}
      title="Set Complete!"
      winner={winner}
      players={players}
      showStats={true}
      showActions={true}
      onContinue={onContinue}
    />
  );
}