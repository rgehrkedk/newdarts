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

interface LegCompletionModalProps {
  visible: boolean;
  winner: Player;
  players: Player[];
  onContinue: () => void;
}

export function LegCompletionModal({ visible, winner, players, onContinue }: LegCompletionModalProps) {
  return (
    <CompletionModal
      visible={visible}
      title="Leg Complete!"
      winner={winner}
      players={players}
      showStats={true}
      showActions={true}
      onContinue={onContinue}
    />
  );
}