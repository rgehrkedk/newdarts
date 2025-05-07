import { View, StyleSheet } from 'react-native';
import { Card } from '@core/atoms/Card';
import { Text } from '@core/atoms/Text';
import { spacing, typography, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import Svg, { Circle } from 'react-native-svg';

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
    25: number; // Bull
  };
  totalPoints: number;
}

interface CricketPlayerCardProps {
  player: CricketPlayer;
  marksRequired: number;
  nextRequiredNumber: number | null;
}

export function CricketPlayerCard({ player, marksRequired, nextRequiredNumber }: CricketPlayerCardProps) {
  const colors = useThemeColors();
  const numbers = [20, 19, 18, 17, 16, 15, 25];

  const getNumberColor = (number: number) => {
    const score = player.scores[number];
    if (score >= marksRequired) return player.color;
    if (player.isActive && number === nextRequiredNumber) return colors.text.primary;
    return colors.text.secondary;
  };

  const calculateProgress = (score: number) => {
    return (score / marksRequired) * 100;
  };

  const CircularProgress = ({ progress }: { progress: number }) => {
    const size = 28;
    const strokeWidth = 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <View style={styles.progressContainer}>
        <Svg width={size} height={size}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colors.background.tertiary}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
          />
          {/* Progress circle */}
          {progress > 0 && (
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={player.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${circumference} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          )}
        </Svg>
      </View>
    );
  };

  return (
    <Card 
      variant="secondary"
      style={[
        styles.container,
        player.isActive && { borderColor: player.color, borderWidth: 1 }
      ]}
    >
      <View style={styles.header}>
        <Text size="sm" weight="semibold" style={{ color: player.color }} truncate >{player.name}</Text>
        <Text size="sm" variant="secondary">{player.totalPoints}</Text>
      </View>

      <View style={styles.grid}>
        {numbers.slice(0, 6).map((number) => (
          <View 
            key={number} 
            style={styles.numberContainer}
          >
            <CircularProgress progress={calculateProgress(player.scores[number])} />
            <Text 
             size="xs"
             weight="regular"
              style={[
                styles.number,
                { color: getNumberColor(number) }
              ]}
            >
              {number}
            </Text>
          </View>
        ))}
      </View>
      <View 
        style={[
          styles.bullContainer,
        ]}
      >
        <CircularProgress progress={calculateProgress(player.scores[25])} />
        <Text 
           size="xs"
           weight="regular"
          style={[
            styles.number,
            { color: getNumberColor(25), marginLeft: spacing.sm }
          ]}
        >
          Bull
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
    flex: 1,
    gap: spacing.md,
    padding: spacing.md,
    marginHorizontal: spacing.xs, // Add horizontal spacing between cards
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  grid: {
    margin: -spacing.xs,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
        overflow: 'visible',
    flexWrap: 'wrap',
    gap: spacing.sm,
    alignItems: 'flex-start',

  },
  numberContainer: {
    width: '30%',
            overflow: 'visible',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 28,
  },
  bullContainer: {
        height: 28,
    width: '100%',
  flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },
  progressContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',

  },
  number: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',

  },
});
