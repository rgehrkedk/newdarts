import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/ui/atoms/Text';
import { Card } from '@/components/ui/atoms/Card';
import { Swords } from 'lucide-react-native';
import { SavedPlayer } from '@/types/game';

interface RecentGameProps {
  player: SavedPlayer;
}

export function RecentGame({ player }: RecentGameProps) {
  const colors = useThemeColors();

  return (
    <View>
      <View style={styles.header}>
        <Text size="lg" weight="semibold">Recent Game</Text>
        <TouchableOpacity>
          <Text variant="brand" size="xs">See All</Text>
        </TouchableOpacity>
      </View>

      <Card variant="secondary">
        <View style={styles.gameHeader}>
          <View style={styles.gameInfo}>
            <View style={[styles.iconContainer, { backgroundColor: colors.background.tertiary }]}>
              <Swords size={16} color={colors.brand.primary} />
            </View>
            <View>
              <Text weight="semibold">501 Game</Text>
              <Text variant="secondary" size="xs">April 29, 2025</Text>
            </View>
          </View>
          <View style={[styles.status, { backgroundColor: `${colors.brand.error}20` }]}>
            <Text size="xs" style={{ color: colors.brand.error }}>Lost</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statRow}>
            <Text variant="secondary" size="xs">Average</Text>
            <Text variant="secondary" size="xs">{player.gameAvg.toFixed(1)}</Text>
          </View>
          <View 
            style={[styles.progressBar, { backgroundColor: colors.background.tertiary }]}
          >
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: colors.brand.primary,
                  width: `${Math.min(player.gameAvg, 100)}%`
                }
              ]} 
            />
          </View>
        </View>

        <View style={styles.players}>
          <View style={styles.playerInfo}>
            <View style={styles.playerRow}>
              <View style={[styles.avatar, { backgroundColor: player.color }]}>
                <Text style={styles.avatarText}>{player.name[0]}</Text>
              </View>
              <Text>{player.name}</Text>
            </View>
            <Text variant="secondary" size="xs" style={styles.playerStatus}>
              167 remaining
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border.primary }]} />

          <View style={[styles.playerInfo, styles.rightAlign]}>
            <View style={[styles.playerRow, styles.rightAlign]}>
              <Text>Michael</Text>
              <View style={[styles.avatar, { backgroundColor: colors.avatar.green }]}>
                <Text style={styles.avatarText}>M</Text>
              </View>
            </View>
            <Text variant="secondary" size="xs" style={styles.playerStatus}>
              Winner
            </Text>
          </View>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  gameInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.full,
  },
  stats: {
    marginBottom: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  players: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerInfo: {
    flex: 1,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rightAlign: {
    alignItems: 'flex-end',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  playerStatus: {
    marginLeft: 32,
  },
  divider: {
    width: 1,
    height: 32,
    marginHorizontal: spacing.md,
  },
});