import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { Trash2, RotateCcw, ArrowRight } from 'lucide-react-native';
import { spacing, typography, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import haptics from '@/utils/haptics';

const { width } = Dimensions.get('window');

// Calculate button dimensions
const BUTTON_GAP = spacing.sm;
const CONTAINER_PADDING = spacing.container;
const AVAILABLE_WIDTH = width - (CONTAINER_PADDING * 2);
const BUTTON_WIDTH = (AVAILABLE_WIDTH - (BUTTON_GAP * 2)) / 3;
const COMMON_SCORE_SIZE = layout.heights.numpadbutton * 0.8;

interface ScoreInputProps {
  currentScore: string;
  error: string;
  onNumberPress: (num: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  onCommonScorePress: (score: number) => void;
  onUndo: () => void;
  onNextPlayer: () => void;
}

export function ScoreInput({
  currentScore,
  error,
  onNumberPress,
  onDelete,
  onSubmit,
  onCommonScorePress,
  onUndo,
  onNextPlayer,
}: ScoreInputProps) {
  const colors = useThemeColors();
  const commonScores = [26, 41, 45, 60, 85, 100];

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.scoreInputContainer}>
        <View style={styles.scoreInputWrapper}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.background.secondary }]}
            onPress={() => {
              haptics.mediumImpact();
              onUndo();
            }}
          >
            <RotateCcw color={colors.text.primary} size={24} />
          </TouchableOpacity>
          <View style={[styles.scoreInput, { backgroundColor: colors.background.secondary }]}>
            <Text style={[styles.scoreInputText, { color: colors.text.primary }]}>
              {currentScore || 'Enter score'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.background.secondary }]}
            onPress={() => {
              haptics.lightImpact();
              onNextPlayer();
            }}
          >
            <ArrowRight color={colors.text.primary} size={24} />
          </TouchableOpacity>
        </View>
        {error ? <Text style={[styles.errorText, { color: colors.brand.error }]}>{error}</Text> : null}
      </View>

      <View style={styles.commonScores}>
        {commonScores.map((score, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.commonScoreButton, { backgroundColor: colors.background.secondary }]}
            onPress={() => {
              haptics.selectionFeedback();
              onCommonScorePress(score);
            }}>
            <Text style={[styles.commonScoreText, { color: colors.text.primary }]}>{score}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.numpad}>
        <View style={styles.numpadRow}>
          {[1, 2, 3].map((num) => (
            <TouchableOpacity
              key={num}
              style={[styles.numButton, { backgroundColor: colors.background.secondary }]}
              onPress={() => {
                haptics.subtleFeedback();
                onNumberPress(num.toString());
              }}>
              <Text style={[styles.numButtonText, { color: colors.text.primary }]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.numpadRow}>
          {[4, 5, 6].map((num) => (
            <TouchableOpacity
              key={num}
              style={[styles.numButton, { backgroundColor: colors.background.secondary }]}
              onPress={() => {
                haptics.subtleFeedback();
                onNumberPress(num.toString());
              }}>
              <Text style={[styles.numButtonText, { color: colors.text.primary }]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.numpadRow}>
          {[7, 8, 9].map((num) => (
            <TouchableOpacity
              key={num}
              style={[styles.numButton, { backgroundColor: colors.background.secondary }]}
              onPress={() => {
                haptics.subtleFeedback();
                onNumberPress(num.toString());
              }}>
              <Text style={[styles.numButtonText, { color: colors.text.primary }]}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.numpadRow}>
          <TouchableOpacity
            style={[styles.numButton, { backgroundColor: colors.background.secondary }]}
            onPress={() => {
              haptics.errorFeedback();
              onDelete();
            }}
          >
            <Trash2 color={colors.brand.error} size={24} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.numButton, { backgroundColor: colors.background.secondary }]}
            onPress={() => {
              haptics.subtleFeedback();
              onNumberPress('0');
            }}
          >
            <Text style={[styles.numButtonText, { color: colors.text.primary }]}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.numButton, { backgroundColor: colors.brand.success }]}
            onPress={() => {
              haptics.successFeedback();
              onSubmit();
            }}
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  scoreInputContainer: {
    paddingHorizontal: spacing.container,
    paddingTop: spacing.sm,
    alignItems: 'center',
  },
  scoreInputWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  controlButton: {
    width: layout.heights.numpadbutton,
    height: layout.heights.numpadbutton,
    borderRadius: layout.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreInput: {
    flex: 1,
    height: layout.heights.numpadbutton,
    borderRadius: layout.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreInputText: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.families.semiBold,
  },
  errorText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.regular,
    marginTop: spacing.sm,
  },
  commonScores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.container,
    paddingVertical: spacing.lg,
  },
  commonScoreButton: {
    borderRadius: layout.radius.xl,
    height: COMMON_SCORE_SIZE,
    width: COMMON_SCORE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commonScoreText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.families.regular,
  },
  numpad: {
    paddingHorizontal: spacing.container,
    gap: spacing.sm,
  },
  numpadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  numButton: {
    width: BUTTON_WIDTH,
    height: layout.heights.numpadbutton,
    borderRadius: layout.radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  numButtonText: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.families.semiBold,
  },
  submitButtonText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.families.semiBold,
  },
});