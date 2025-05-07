import { View, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme';
import { Settings2 } from 'lucide-react-native';
import { Card } from '@/components/core/atoms/Card';
import { Counter } from '@/components/core/molecules/Counter';
import { SegmentedControl } from '@/components/core/molecules/SegmentedControl';
import { Text } from '@/components/core/atoms/Text';

interface GameSettingsCardProps {
  gameVariant: number;
  legs: number;
  sets: number;
  onGameVariantChange: (value: number) => void;
  onLegsChange: (value: number) => void;
  onSetsChange: (value: number) => void;
}

const GAME_VARIANTS = [
  { label: '101', value: 101 },
  { label: '201', value: 201 },
  { label: '301', value: 301 },
  { label: '501', value: 501 },
  { label: '701', value: 701 },
];

export function GameSettingsCard({
  gameVariant,
  legs,
  sets,
  onGameVariantChange,
  onLegsChange,
  onSetsChange,
}: GameSettingsCardProps) {
  return (
    <Card
      heading="Game Settings"
      icon={Settings2}
      showIcon
    >
      <View style={styles.gameSettings}>
        <Text variant="secondary">Game Type</Text>
        
        {/* Updated SegmentedControl implementation */}
        <SegmentedControl
          options={GAME_VARIANTS}
          value={gameVariant}
          onChange={onGameVariantChange}
          size="md"
        />
        
        <View style={styles.counterRow}>
          <Counter
            label="Legs"
            value={legs}
            onIncrement={() => onLegsChange(legs + 1)}
            onDecrement={() => onLegsChange(Math.max(1, legs - 1))}
          />
          <Counter
            label="Sets"
            value={sets}
            onIncrement={() => onSetsChange(sets + 1)}
            onDecrement={() => onSetsChange(Math.max(1, sets - 1))}
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
  counterRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    justifyContent: 'space-between',
  },
});