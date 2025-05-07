import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Trash2 } from 'lucide-react-native';
import { Text } from '@/components/core/atoms/Text';

interface CricketScoreInputProps {
  onNumberPress: (num: number) => void;
  onDelete: () => void;
  onSubmit: () => void;
  selectedNumber: number | null;
  currentMarks: number;
  availableNumbers: number[];
}

export function CricketScoreInput({
  onNumberPress,
  onDelete,
  onSubmit,
  selectedNumber,
  currentMarks,
  availableNumbers,
}: CricketScoreInputProps) {
  const colors = useThemeColors();

  const getButtonStyle = (num: number) => {
    if (!availableNumbers.includes(num)) {
      return { backgroundColor: colors.background.tertiary };
    }
    if (selectedNumber === num) {
      return { backgroundColor: colors.brand.primary };
    }
    return { backgroundColor: colors.background.secondary };
  };

  const getTextStyle = (num: number) => {
    if (!availableNumbers.includes(num)) {
      return { color: colors.text.disabled };
    }
    if (selectedNumber === num) {
      return { color: colors.white };
    }
    return { color: colors.text.primary };
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      {currentMarks > 0 && (
        <View style={[styles.marksIndicator, { backgroundColor: colors.background.secondary }]}>
          <Text style={[styles.marksText, { color: colors.text.primary }]}>
            {currentMarks} {currentMarks === 1 ? 'mark' : 'marks'}
          </Text>
        </View>
      )}

      <View style={styles.grid}>
        <View style={styles.row}>
          {[20, 19, 18].map((num) => (
            <TouchableOpacity
              key={num}
              style={[styles.button, getButtonStyle(num)]}
              onPress={() => onNumberPress(num)}
              disabled={!availableNumbers.includes(num)}
            >
              <Text style={[styles.buttonText, getTextStyle(num)]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.row}>
          {[17, 16, 15].map((num) => (
            <TouchableOpacity
              key={num}
              style={[styles.button, getButtonStyle(num)]}
              onPress={() => onNumberPress(num)}
              disabled={!availableNumbers.includes(num)}
            >
              <Text style={[styles.buttonText, getTextStyle(num)]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.row}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.background.secondary }]} 
            onPress={onDelete}
          >
            <Trash2 color={colors.brand.error} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, getButtonStyle(25)]}
            onPress={() => onNumberPress(25)}
            disabled={!availableNumbers.includes(25)}
          >
            <Text style={[styles.buttonText, getTextStyle(25)]}>Bull</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: colors.brand.success }]} 
            onPress={onSubmit}
            disabled={!selectedNumber || currentMarks === 0}
          >
            <Text style={[styles.submitButtonText, { color: colors.white }]}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: layout.radius.xl,
    borderTopRightRadius: layout.radius.xl,
    paddingTop: spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  marksIndicator: {
    margin: spacing.container,
    padding: spacing.md,
    borderRadius: layout.radius.lg,
    alignItems: 'center',
  },
  marksText: {
    fontSize: 16,
    fontWeight: '600',
  },
  grid: {
    padding: spacing.container,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    height: layout.heights.numpadbutton,
    borderRadius: layout.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '600',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});