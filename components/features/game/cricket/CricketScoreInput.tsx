import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { useTheme } from '@/hooks/useTheme';
import { Trash2 } from 'lucide-react-native';
import { Text } from '@/components/core/atoms/Text';
import { LinearGradient } from 'expo-linear-gradient';

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
  const { isDark } = useTheme();

  // Define gradient colors based on theme
  const gradientColors = [
    colors.brand.primary,
    colors.brand.primaryGradient
  ];

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
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={gradientColors.map(color => color + colors.transparency.low)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
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
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginTop: spacing.lg,
    borderRadius: layout.radius.xxxl,
  },
  gradientContainer: {
    borderTopLeftRadius: layout.radius.xxxl,
    borderTopRightRadius: layout.radius.xxxl,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingBottom: 0, // Border thickness
    paddingTop: 2,
    paddingHorizontal: 2,
    overflow: 'hidden',
  },
  container: {
    borderTopLeftRadius: layout.radius.xxxl,
    borderTopRightRadius: layout.radius.xxxl,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: spacing.md,
    marginLeft: -1,
    marginRight: -1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  marksIndicator: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: layout.radius.lg,
    alignItems: 'center',
  },
  marksText: {
    fontSize: 16,
    fontWeight: '600',
  },
  grid: {
    padding: spacing.md,
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