import { View, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme';
import { SavedPlayer } from '@/types/game';
import { Drawer } from './Drawer';
import { PlayerStats } from '../../setup/drawer/PlayerStats';
import { Text } from '../atoms/Text';

interface PlayerStatsDrawerProps {
  visible: boolean;
  onClose: () => void;
  player: SavedPlayer | null;
}

export function PlayerStatsDrawer({
  visible,
  onClose,
  player
}: PlayerStatsDrawerProps) {
  if (!player) return null;

  const headerContent = (
    <View style={styles.headerContent}>
      <View style={[styles.avatar, { backgroundColor: player.color }]}>
        <Text size="lg" weight="semibold" style={styles.avatarText}>
          {player.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text size="lg" weight="semibold">{player.name}</Text>
    </View>
  );

  return (
    <Drawer
      visible={visible}
      onClose={onClose}
      title="Player Statistics"
      headerContent={headerContent}
    >
      <PlayerStats player={player} />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: 'white',
  },
});