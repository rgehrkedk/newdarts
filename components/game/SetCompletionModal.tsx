import { CompletionModal } from '@/components/ui/organisms/CompletionModal';
import { Player } from '@/types/game';

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