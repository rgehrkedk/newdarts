import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';

interface ColorPickerProps {
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export function ColorPicker({ selectedColor, onSelectColor }: ColorPickerProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      {Object.entries(colors.avatar.colors).map(([name, color]) => (
        <TouchableOpacity
          key={color}
          style={[
            styles.colorOption,
            { backgroundColor: color },
            selectedColor === color && styles.selectedColor,
            selectedColor === color && { borderColor: colors.avatar.border }
          ]}
          onPress={() => onSelectColor(color)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginVertical: spacing.lg,
  },
  colorOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderWidth: 3,
  },
});