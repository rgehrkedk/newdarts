import { CompletionModal } from '@/components/core/organisms/CompletionModal';
import { PlayerAccordion } from '@/components/features/game/common/PlayerAccordion';
import { usePlayers } from '@/hooks/usePlayers';

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
  const { players: savedPlayers } = usePlayers();
  
  // Custom render function for player accordion
  const renderPlayer = (player: Player, index: number, isExpanded: boolean, onToggle: () => void) => {
    const savedPlayer = savedPlayers.find(p => p.id === player.id);
    
    return (
      <PlayerAccordion
        key={player.id}
        player={player}
        index={index}
        isWinner={player.id === winner.id}
        isExpanded={isExpanded}
        onToggle={onToggle}
        savedGameAvg={savedPlayer?.gameAvg}
      />
    );
  };

  return (
    <CompletionModal
      visible={visible}
      title="Set Complete!"
      winner={winner}
      players={players}
      showStats={true}
      showActions={true}
      onContinue={onContinue}
      renderPlayer={renderPlayer}
      savedPlayers={savedPlayers}
    />
  );
}