import { CompletionModal } from '@core/organisms/CompletionModal';
import { Player } from '@/types/game';

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