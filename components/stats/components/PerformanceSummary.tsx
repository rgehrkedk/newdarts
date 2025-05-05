import { View, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/ui/atoms/Text';
import { Card } from '@/components/ui/atoms/Card';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react-native';
import { SavedPlayer } from '@/types/game';
import { usePlayerTrends } from '@/hooks/usePlayerTrends';

interface StatCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  trend?: 'up' | 'down' | 'stable';
  trendLabel?: string;
  percentChange?: number | null;
}

function StatCard({ title, value, suffix, trend, trendLabel, percentChange }: StatCardProps) {
  const colors = useThemeColors();

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return colors.brand.success;
      case 'down': return colors.brand.error;
      default: return colors.text.secondary;
    }
  };

  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus;

  return (
    <Card variant="secondary" style={styles.statCard}>
      <Text variant="secondary" size="xs">{title}</Text>
      <View style={styles.valueContainer}>
        <Text size="xxl" weight="semibold">{value}</Text>
        {suffix && (
          <Text variant="secondary" size="xs" style={styles.suffix}>{suffix}</Text>
        )}
      </View>
      {trend && (
        <View style={styles.trend}>
          <TrendIcon size={12} color={getTrendColor()} />
          <Text size="xs" style={{ color: getTrendColor() }}>
            {percentChange && percentChange > 0 ? `${percentChange.toFixed(1)}% ` : ''}
            {trendLabel}
          </Text>
        </View>
      )}
    </Card>
  );
}

interface PerformanceSummaryProps {
  player: SavedPlayer;
}

export function PerformanceSummary({ player }: PerformanceSummaryProps) {
  const { gameAverageTrend, checkoutTrend, winRateTrend } = usePlayerTrends(player);
  
  const getWinRateLabel = (trend: 'up' | 'down' | 'stable', winRate: number) => {
    if (winRate >= 60) return 'Excellent';
    if (winRate >= 50) return 'Good';
    if (winRate >= 40) return 'Average';
    return 'Needs work';
  };
  
  return (
    <View>
      <Text size="lg" weight="semibold" style={styles.title}>Performance Summary</Text>
      <View style={styles.grid}>
        <StatCard
          title="Game Average"
          value={player.gameAvg.toFixed(1)}
          suffix="pts"
          trend={gameAverageTrend.trend}
          trendLabel={gameAverageTrend.trend === 'up' ? 'Improving' : 
                     gameAverageTrend.trend === 'down' ? 'Declining' : 'Stable'}
          percentChange={gameAverageTrend.percentChange}
        />
        <StatCard
          title="Checkout %"
          value={player.checkoutPercentage.toFixed(1)}
          suffix="%"
          trend={checkoutTrend.trend}
          trendLabel={checkoutTrend.trend === 'up' ? 'Improving' : 
                    checkoutTrend.trend === 'down' ? 'Declining' : 'Stable'}
          percentChange={checkoutTrend.percentChange}
        />
        <StatCard
          title="Win Rate"
          value={(player.winRate || 0).toFixed(1)}
          suffix="%"
          trend={winRateTrend.trend}
          trendLabel={getWinRateLabel(winRateTrend.trend, player.winRate || 0)}
          percentChange={winRateTrend.percentChange}
        />
        <StatCard
          title="Games Played"
          value={player.gamesPlayed || 0}
          trend="stable"
          trendLabel={`Won: ${player.gamesWon || 0}`}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: spacing.xs,
  },
  suffix: {
    marginLeft: spacing.xs,
  },
  trend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});