import { View, StyleSheet } from 'react-native';
import { spacing, layout, typography } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/core/atoms/Text';
import { StatItem } from '@/components/core/atoms/StatItem';
import { Target, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react-native';
import AnimatedNumbers from 'react-native-animated-numbers';
import Animated, { FadeIn } from 'react-native-reanimated';

interface CricketPlayer {
  id: string;
  name: string;
  isActive: boolean;
  color: string;
  scores: {
    20: number;
    19: number;
    18: number;
    17: number;
    16: number;
    15: number;
    25: number;
  };
  totalPoints: number;
}

interface CricketPlayerStatsProps {
  player: CricketPlayer;
  marksRequired: number;
  nextRequiredNumber: number;
  currentMarks: number;
  marksPerTurn: number;
  marksDifference: number;
}

export function CricketPlayerStats({
  player,
  marksRequired,
  nextRequiredNumber,
  marksPerTurn,
  marksDifference,
}: CricketPlayerStatsProps) {
  const colors = useThemeColors();

  const getMarksDifferenceColor = () => {
    if (marksDifference > 0) return colors.brand.success;
    if (marksDifference < 0) return colors.brand.error;
    return colors.text.secondary;
  };

  const getMarksDifferenceIcon = () => {
    if (marksDifference > 0) return ArrowUp;
    if (marksDifference < 0) return ArrowDown;
    return null;
  };

  const MarksDifferenceIcon = getMarksDifferenceIcon();
  const marksNeeded = marksRequired - player.scores[nextRequiredNumber];

  return (
    <Animated.View
      entering={FadeIn}
      style={[styles.container, { backgroundColor: colors.background.card.primary }]}
    >
      <View style={styles.mainStats}>
        <View style={styles.targetContainer}>
          <Text size="lg" weight="semibold" style={{ color: player.color }}>
            {nextRequiredNumber === 25 ? 'Bull' : nextRequiredNumber}
          </Text>
          <Text variant="secondary" size="xs">Target</Text>
        </View>

        <View style={styles.marksContainer}>
          <View style={[styles.marksCircle, { borderColor: player.color }]}>
            <AnimatedNumbers
              includeComma={false}
              animateToNumber={marksNeeded}
              fontStyle={[styles.marksText, { color: colors.text.primary }]}
            />
            <Text variant="secondary" size="xs" style={styles.marksLabel}>marks</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <StatItem
          icon={Target}
          label="Marks/Turn"
          value={marksPerTurn.toFixed(1)}
          color={colors.brand.primary}
        />
        <StatItem
          icon={TrendingUp}
          label="vs Opponents"
          value={Math.abs(marksDifference).toString()}
          color={getMarksDifferenceColor()}
          IconOverride={MarksDifferenceIcon}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.container,
    borderRadius: layout.radius.xl,
    padding: spacing.md,
    marginBottom: spacing.xs,
    gap: spacing.md,
  },
  mainStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  targetContainer: {
    alignItems: 'center',
    width: 50,
  },
  marksContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marksCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marksText: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.families.semiBold,
  },
  marksLabel: {
    marginTop: -spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});