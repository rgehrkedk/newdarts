import { View, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme';
import { Settings2 } from 'lucide-react-native';
import { Card } from '@core/atoms/Card';
import { Text } from '@core/atoms/Text';
import { SegmentedControl } from '@core/molecules/SegmentedControl';
import { Counter } from '@core/molecules/Counter';

interface CricketSettingsCardProps {
  scoringType: 'cricket' | 'route';
  marksRequired: number;
  onScoringTypeChange: (value: 'cricket' | 'route') => void;
  onMarksRequiredChange: (value: number) => void;
}

export function CricketSettingsCard({
  scoringType,
  marksRequired,
  onScoringTypeChange,
  onMarksRequiredChange,
}: CricketSettingsCardProps) {
  return (
    <Card
      heading="Game Settings"
      icon={Settings2}
      showIcon
    >
      <View style={styles.gameSettings}>
        <Text variant="secondary">Scoring Type</Text>
        <SegmentedControl
          options={[
            { label: 'Cricket', value: 'cricket' },
            { label: 'Route', value: 'route' },
          ]}
          value={scoringType}
          onChange={onScoringTypeChange}
        />

        <View style={styles.counterSection}>
          <Text variant="secondary">Marks Required</Text>
          <Counter
            value={marksRequired}
            onIncrement={() => onMarksRequiredChange(marksRequired + 1)}
            onDecrement={() => onMarksRequiredChange(marksRequired - 1)}
            min={2}
            max={5}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  gameSettings: {
    gap: spacing.lg,
  },
  counterSection: {
    gap: spacing.sm,
  },
});