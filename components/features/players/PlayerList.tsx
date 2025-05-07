import { View, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme';
import { Plus } from 'lucide-react-native';
import { Text } from '@/components/core/atoms/Text';
import { Button } from '@/components/core/atoms/Button';
import { ListItem } from '@/components/core/molecules/ListItem';

// Define the SavedPlayer interface within the component file for portability
interface SavedPlayer {
  id: string;
  name: string;
  color: string;
  isGuest?: boolean;
  user_id?: string | null;
  gameAvg?: number;
  checkoutPercentage?: number;
}

interface PlayerListProps {
  players: SavedPlayer[];
  loading: boolean;
  error: string | null;
  currentUserId: string | null;
  onSelectPlayer: (player: SavedPlayer) => void;
  onEditPlayer: (player: SavedPlayer) => void;
  onShowStats: (player: SavedPlayer) => void;
  onAddNew: () => void;
}

export function PlayerList({
  players,
  loading,
  error,
  currentUserId,
  onSelectPlayer,
  onEditPlayer,
  onShowStats,
  onAddNew,
}: PlayerListProps) {
  if (loading) {
    return <Text variant="secondary" align="center">Loading players...</Text>;
  }

  if (error) {
    return <Text variant="error" align="center">{error}</Text>;
  }

  if (players.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text variant="secondary" align="center">
          No players found. Create your first player!
        </Text>
        <Button
          label="Add New Player"
          variant="primary"
          icon={Plus}
          onPress={onAddNew}
        />
      </View>
    );
  }

  return (
    <>
      {players.map((player, index) => (
        <ListItem
          key={player.id}
          title={player.name}
          showAvatar
          avatarColor={player.color}
          rightIcon={Plus}
          showEdit
          showStats
          onPress={() => onSelectPlayer(player)}
          onEdit={() => onEditPlayer(player)}
          onStats={() => onShowStats(player)}
          index={index}
          isOwned={player.user_id === currentUserId}
          isGuest={player.isGuest}
        />
      ))}
      <Button
        label="Add New Player"
        variant="secondary"
        icon={Plus}
        onPress={onAddNew}
      />
    </>
  );
}

const styles = StyleSheet.create({
  emptyState: {
    gap: spacing.lg,
    paddingVertical: spacing.xl,
  },
});