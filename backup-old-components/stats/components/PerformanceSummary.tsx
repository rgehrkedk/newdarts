import { View, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@core/atoms/Text';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react-native';
import { SavedPlayer } from '@/types/game';
import { usePlayerTrends } from '@/hooks/usePlayerTrends';
import { Period } from './PeriodFilter';
import { GradientCard } from '@core/molecules/GradientCard';

interface StatCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  trend?: 'up' | 'down' | 'stable';
  trendLabel?: string;
  percentChange?: number | null;
  animationDelay?: number; // Animation delay for staggered appearance
}

function StatCard({ title, value, suffix, trend, trendLabel, percentChange, animationDelay = 0 }: StatCardProps) {
  const colors = useThemeColors();

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return colors.brand.success;
      case 'down': return colors.brand.error;
      default: return colors.text.secondary;
    }
  };
  
  // Generate gradient colors based on trend
  const getGradientColors = () => {
    switch (trend) {
      case 'up':
        return [colors.brand.primary, colors.brand.primaryGradient];
      case 'down':
        return [colors.brand.error, '#DC2626']; // Darker red gradient
      default:
        return [colors.text.secondary, colors.text.secondary + '80']; // Less saturated for stable
    }
  };

  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus;
  
  // Card content to display
  const StatCardContent = () => (
    <View style={styles.statCardContent}>
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
    </View>
  );

  return (
    <GradientCard
      gradientColors={getGradientColors()}
      style={styles.statCard}
      clean={false}
      height={120}
      innerTransparency={colors.transparency.high} // 90% opacity for better readability
      outerTransparency={colors.transparency.faint} // 40% opacity for a subtler gradient effect
      contentAlignment="flex-start"
      animationDelay={animationDelay}
    >
      <StatCardContent />
    </GradientCard>
  );
}

interface PerformanceSummaryProps {
  player: SavedPlayer;
  period?: Period;
}

export function PerformanceSummary({ player, period }: PerformanceSummaryProps) {
  const { gameAverageTrend, checkoutTrend, winRateTrend } = usePlayerTrends(player, period);
  
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
          value={(player.gameAvg || 0).toFixed(1)}
          suffix="pts"
          trend={gameAverageTrend.trend}
          trendLabel={gameAverageTrend.trend === 'up' ? 'Improving' : 
                     gameAverageTrend.trend === 'down' ? 'Declining' : 'Stable'}
          percentChange={gameAverageTrend.percentChange}
          animationDelay={0}
        />
        <StatCard
          title="Checkout %"
          value={(player.checkoutPercentage || 0).toFixed(1)}
          suffix="%"
          trend={checkoutTrend.trend}
          trendLabel={checkoutTrend.trend === 'up' ? 'Improving' : 
                    checkoutTrend.trend === 'down' ? 'Declining' : 'Stable'}
          percentChange={checkoutTrend.percentChange}
          animationDelay={100}
        />
        <StatCard
          title="Win Rate"
          value={(player.winRate || 0).toFixed(1)}
          suffix="%"
          trend={winRateTrend.trend}
          trendLabel={getWinRateLabel(winRateTrend.trend, player.winRate || 0)}
          percentChange={winRateTrend.percentChange}
          animationDelay={200}
        />
        <StatCard
          title="Games Played"
          value={player.gamesPlayed || 0}
          trend="stable"
          trendLabel={`Won: ${player.gamesWon || 0}`}
          animationDelay={300}
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
  statCardContent: {
    flex: 1,
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