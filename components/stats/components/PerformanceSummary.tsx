import { View, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/ui/atoms/Text';
import { Card } from '@/components/ui/atoms/Card';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react-native';
import { SavedPlayer } from '@/types/game';

interface StatCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  trend?: 'up' | 'down' | 'stable';
  trendLabel?: string;
}

function StatCard({ title, value, suffix, trend, trendLabel }: StatCardProps) {
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
          <Text size="xs" style={{ color: getTrendColor() }}>{trendLabel}</Text>
        </View>
      )}
    </Card>
  );
}

interface PerformanceSummaryProps {
  player: SavedPlayer;
}

export function PerformanceSummary({ player }: PerformanceSummaryProps) {
  return (
    <View>
      <Text size="lg" weight="semibold" style={styles.title}>Performance Summary</Text>
      <View style={styles.grid}>
        <StatCard
          title="Game Average"
          value={player.gameAvg.toFixed(1)}
          suffix="pts"
          trend="up"
          trendLabel="Improving"
        />
        <StatCard
          title="Checkout %"
          value={player.checkoutPercentage.toFixed(1)}
          suffix="%"
          trend="stable"
          trendLabel="Stable"
        />
        <StatCard
          title="Win Rate"
          value={player.winRate?.toFixed(1) || "0"}
          suffix="%"
          trend={player.winRate > 50 ? 'up' : 'down'}
          trendLabel={player.winRate > 50 ? 'Strong' : 'Needs Work'}
        />
        <View style={styles.comingSoon}>
          <Text variant="secondary" size="xs" align="center">More stats coming soon</Text>
        </View>
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
  comingSoon: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: spacing.lg,
    opacity: 0.5,
  },
});