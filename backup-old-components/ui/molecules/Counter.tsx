import { View, Text, StyleSheet } from 'react-native';
import { spacing, layout, typography } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Plus, Minus } from 'lucide-react-native';
import { IconButton } from '../atoms/IconButton';

interface CounterProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  label?: string;
  min?: number;
  max?: number;
}

export function Counter({ 
  value, 
  onIncrement, 
  onDecrement, 
  label,
  min = 1,
  max = 9
}: CounterProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[styles.label, { color: colors.text.secondary }]}>
          {label}
        </Text>
      )}
      <View style={styles.controls}>
        <IconButton
          icon={Minus}
          onPress={onDecrement}
          variant="secondary"
          disabled={value <= min}
        />
        <Text style={[styles.value, { color: colors.text.primary }]}>
          {value}
        </Text>
        <IconButton
          icon={Plus}
          onPress={onIncrement}
          variant="secondary"
          disabled={value >= max}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.regular,
    marginBottom: spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  value: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.families.semiBold,
    minWidth: 30,
    textAlign: 'center',
  },
});