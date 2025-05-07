import { CompletionModal } from '@core/organisms/CompletionModal';
import { Player } from '@/types/game';

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