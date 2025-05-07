import { View, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme';
import { Users, Plus } from 'lucide-react-native';
import { Card } from '@core/atoms/Card';
import { Button } from '@core/atoms/Button';
import { ListItem } from '@core/molecules/ListItem';
import { Text } from '@core/atoms/Text';
import { useAuth } from '@/hooks/useAuth';

interface PlayerDetailsCardProps {
  players: Array<{ 
    id: string; 
    name: string; 
    color?: string; 
    gameAvg?: number; 
    checkoutPercentage?: number; 
    isGuest?: boolean;
    user_id?: string | null;
  }>;
  error?: string;
  onRemovePlayer: (id: string) => void;
  onEditPlayer: (player: { id: string; name: string; color?: string }) => void;
  onOpenPlayerDrawer: () => void;
}

export function PlayerDetailsCard({
  players,
  error,
  onRemovePlayer,
  onEditPlayer,
  onOpenPlayerDrawer,
}: PlayerDetailsCardProps) {
  const { session } = useAuth();
  const currentUserId = session?.user?.id;

  const formatStats = (gameAvg?: number, checkoutPercentage?: number) => {
    const avg = typeof gameAvg === 'number' ? gameAvg.toFixed(1) : '0.0';
    const checkout = typeof checkoutPercentage === 'number' ? checkoutPercentage.toFixed(1) : '0.0';
    return `${avg} Avg • ${checkout}% Checkout`;
  };

  return (
    <Card
      heading="Player Details"
      subtitle="Select up to 4 players for the game"
      icon={Users}
      showIcon
    >
      <View style={styles.playersContainer}>
        {players.map((player, index) => (
          <ListItem
            key={`player-${player.id}-${index}`}
            title={player.name}
            subtitle={formatStats(player.gameAvg, player.checkoutPercentage)}
            showAvatar
            avatarColor={player.color || '#22C55E'}
            showEdit
            showDelete
            onEdit={() => onEditPlayer(player)}
            onDelete={() => onRemovePlayer(player.id)}
            index={index}
            isOwned={player.user_id === currentUserId}
            isGuest={player.isGuest}
          />
        ))}
      </View>

      {players.length === 0 && (
        <View style={styles.emptyState}>
          <Text variant="secondary" align="center">
            No players selected. Add players to start the game.
          </Text>
        </View>
      )}

      <Button
        onPress={onOpenPlayerDrawer}
        label="Add Player"
        variant="secondary"
        icon={Plus}
        disabled={players.length >= 4}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  playersContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
});