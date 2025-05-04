import { View, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme';
import { Text } from '@/components/ui/atoms/Text';
import { Card } from '@/components/ui/atoms/Card';
import { StatItem } from '@/components/ui/atoms/StatItem';
import { SavedPlayer } from '@/types/game';
import { Trophy, Target, Award, Crown, Hash, Percent, Zap } from 'lucide-react-native';
import { useThemeColors } from '@/constants/theme/colors';

interface PlayerStatsProps {
  player: SavedPlayer;
}

export function PlayerStats({ player }: PlayerStatsProps) {
  const colors = useThemeColors();

  return (
    <>
      <View style={styles.header}>
        <View style={styles.nameContainer}>
          <View style={[styles.colorIndicator, { backgroundColor: player.color }]} />
          <View>
            <Text size="lg" weight="semibold">{player.name}</Text>
            <Text variant="secondary" size="sm">
              {player.isGuest ? 'Guest Player' : 'Registered Player'}
            </Text>
          </View>
        </View>
      </View>

      <Card variant="secondary">
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatItem
              icon={Percent}
              label="Win Rate"
              value={`${player.winRate?.toFixed(1)}%`}
              color={colors.brand.primary}
            />
            <StatItem
              icon={Hash}
              label="Games"
              value={`${player.gamesWon}/${player.gamesPlayed}`}
              color={colors.brand.primary}
            />
          </View>

          <View style={styles.statsRow}>
            <StatItem
              icon={Trophy}
              label="Game Avg"
              value={player.gameAvg.toFixed(1)}
              color={colors.brand.primary}
            />
            <StatItem
              icon={Target}
              label="Checkout %"
              value={`${player.checkoutPercentage.toFixed(1)}%`}
              color={colors.brand.primary}
            />
          </View>

          <View style={styles.statsRow}>
            <StatItem
              icon={Award}
              label="Best Leg"
              value={player.bestLegAvg?.toFixed(1) || '0.0'}
              color={colors.brand.primary}
            />
            <StatItem
              icon={Crown}
              label="Highest CO"
              value={player.highestCheckout?.toString() || '0'}
              color={colors.brand.primary}
            />
          </View>

          <View style={styles.statsRow}>
            <StatItem
              icon={Zap}
              label="180s"
              value={player.totalOneEighties?.toString() || '0'}
              color={colors.brand.primary}
            />
          </View>
        </View>
      </Card>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  colorIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  statsGrid: {
    gap: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});