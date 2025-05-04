import { View, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme';
import { Text } from '@/components/ui/atoms/Text';
import { StatItem } from '../ui/atoms/StatItem';
import { Trophy, Target, Award, Crown, Hash, Percent, Zap, TrendingUp, Timer, BarChart as BarChart3 } from 'lucide-react-native';
import { useThemeColors } from '@/constants/theme/colors';
import { Player } from '@/types/game';
import Animated, { FadeIn } from 'react-native-reanimated';

interface PlayerStatsProps {
  player: Player;
  showHeader?: boolean;
}

export function PlayerStats({ player, showHeader = true }: PlayerStatsProps) {
  const colors = useThemeColors();

  const StatGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.statGroup}>
      <Text variant="secondary" size="sm" style={styles.groupTitle}>{title}</Text>
      <View style={styles.groupContent}>
        {children}
      </View>
    </View>
  );

  return (
    <Animated.View entering={FadeIn}>
      {showHeader && (
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
      )}

      <View style={styles.statsGrid}>
        <StatGroup title="Game Performance">
          <View style={styles.statsRow}>
            <StatItem
              icon={Trophy}
              label="Game Avg"
              value={player.gameAvg.toFixed(1)}
              color={colors.brand.success}
            />
            <StatItem
              icon={Timer}
              label="First 9"
              value={player.firstNine?.toFixed(1) || '0.0'}
              color={colors.brand.success}
            />
          </View>
          <View style={styles.statsRow}>
            <StatItem
              icon={Award}
              label="Best Leg"
              value={player.bestLegAvg?.toFixed(1) || '0.0'}
              color={colors.brand.success}
            />
            <StatItem
              icon={Crown}
              label="Highest CO"
              value={player.highestCheckout?.toString() || '0'}
              color={colors.brand.success}
            />
          </View>
        </StatGroup>

        <StatGroup title="Win Statistics">
          <View style={styles.statsRow}>
            <StatItem
              icon={Percent}
              label="Win Rate"
              value={`${player.winRate?.toFixed(1)}%`}
              color={colors.brand.primary}
            />
            <StatItem
              icon={Hash}
              label="Games Won"
              value={`${player.gamesWon}/${player.gamesPlayed}`}
              color={colors.brand.primary}
            />
          </View>
          <View style={styles.statsRow}>
            <StatItem
              icon={Target}
              label="Checkout %"
              value={`${player.checkoutPercentage.toFixed(1)}%`}
              color={colors.brand.primary}
            />
          </View>
        </StatGroup>

        <StatGroup title="Scoring Breakdown">
          <View style={styles.statsRow}>
            <StatItem
              icon={BarChart3}
              label="60+"
              value={player.totalSixtyPlus?.toString() || '0'}
              color={colors.avatar.orange}
            />
            <StatItem
              icon={BarChart3}
              label="80+"
              value={player.totalEightyPlus?.toString() || '0'}
              color={colors.avatar.orange}
            />
          </View>
          <View style={styles.statsRow}>
            <StatItem
              icon={BarChart3}
              label="100+"
              value={player.totalTonPlus?.toString() || '0'}
              color={colors.avatar.orange}
            />
            <StatItem
              icon={Zap}
              label="180s"
              value={player.totalOneEighties?.toString() || '0'}
              color={colors.avatar.orange}
            />
          </View>
        </StatGroup>
      </View>
    </Animated.View>
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
    gap: spacing.xl,
  },
  statGroup: {
    gap: spacing.md,
  },
  groupTitle: {
    marginBottom: spacing.xs,
  },
  groupContent: {
    gap: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});