import { View, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/ui/atoms/Text';
import { Card } from '@/components/ui/atoms/Card';
import { SegmentedControl } from '@/components/ui/molecules/SegmentedControl';
import { useState } from 'react';

type Period = '7d' | '30d' | 'all';
type StatType = 'gameAverage' | 'checkoutPercent' | 'winRate';

export function TrendChart() {
  const colors = useThemeColors();
  const [period, setPeriod] = useState<Period>('7d');
  const [statType, setStatType] = useState<StatType>('gameAverage');

  return (
    <View>
      <Text size="lg" weight="semibold" style={styles.title}>Trend</Text>
      
      <View style={styles.controls}>
        <SegmentedControl
          options={[
            { label: '7 Days', value: '7d' },
            { label: '30 Days', value: '30d' },
            { label: 'All Time', value: 'all' },
          ]}
          value={period}
          onChange={(value) => setPeriod(value as Period)}
        />

        <SegmentedControl
          options={[
            { label: 'Game Average', value: 'gameAverage' },
            { label: 'Checkout %', value: 'checkoutPercent' },
            { label: 'Win Rate', value: 'winRate' },
          ]}
          value={statType}
          onChange={(value) => setStatType(value as StatType)}
        />
      </View>

      <Card variant="secondary">
        <View style={[styles.chartPlaceholder, { backgroundColor: colors.background.tertiary }]}>
          <Text variant="secondary" size="xs">Chart coming soon</Text>
        </View>
        <Text variant="secondary" size="xs" align="center" style={styles.chartLabel}>
          Play more games to see your performance trend
        </Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.md,
  },
  controls: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  chartPlaceholder: {
    height: 200,
    borderRadius: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  chartLabel: {
    marginTop: spacing.sm,
  },
});