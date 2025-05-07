import { View, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@core/atoms/Text';
import { Card } from '@core/atoms/Card';
import { MoveRight, Star, Zap, Hash } from 'lucide-react-native';
import { SavedPlayer } from '@/types/game';
import { Period } from './PeriodFilter';

interface HighlightItemProps {
  icon: typeof MoveRight;
  color: string;
  label: string;
  value: string | number;
  suffix?: string;
}

function HighlightItem({ icon: Icon, color, label, value, suffix }: HighlightItemProps) {
  const colors = useThemeColors();

  return (
    <Card variant="secondary" style={styles.highlightCard}>
      <View style={styles.iconRow}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
          <Icon size={14} color={color} />
        </View>
        <Text variant="secondary" size="xs">{label}</Text>
      </View>
      <View style={styles.valueRow}>
        <Text size="xl" weight="semibold">{value}</Text>
        {suffix && (
          <Text variant="secondary" size="xs" style={styles.suffix}>{suffix}</Text>
        )}
      </View>
    </Card>
  );
}

interface HighlightsProps {
  player: SavedPlayer;
  period?: Period;
}

export function Highlights({ player, period }: HighlightsProps) {
  const colors = useThemeColors();

  return (
    <View>
      <Text size="lg" weight="semibold" style={styles.title}>Highlights</Text>
      <View style={styles.grid}>
        <HighlightItem
          icon={MoveRight}
          color={colors.avatar.colors.purple}
          label="First 9 Avg"
          value={player.avgFirstNine?.toFixed(1) || "0.0"}
          suffix="pts"
        />
        <HighlightItem
          icon={Star}
          color={colors.avatar.colors.yellow}
          label="Highest Checkout"
          value={player.highestCheckout || "0"}
        />
        <HighlightItem
          icon={Zap}
          color={colors.avatar.colors.red}
          label="Best Leg"
          value={player.bestLegAvg?.toFixed(1) || "0.0"}
          suffix="avg"
        />
        <HighlightItem
          icon={Hash}
          color={colors.avatar.colors.blue}
          label="Darts Thrown"
          value="42"
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
  highlightCard: {
    flex: 1,
    minWidth: '45%',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  suffix: {
    marginLeft: spacing.xs,
  },
});