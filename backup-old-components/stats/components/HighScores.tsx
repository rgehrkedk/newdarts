import { View, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@core/atoms/Text';
import { Card } from '@core/atoms/Card';
import { Award } from 'lucide-react-native';
import { SavedPlayer } from '@/types/game';
import { Period } from './PeriodFilter';

interface ScoreBarProps {
  label: string;
  value: number;
  color: string;
  total: number;
}

function ScoreBar({ label, value, color, total }: ScoreBarProps) {
  const colors = useThemeColors();
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <View style={styles.scoreBar}>
      <Text size="xl" weight="semibold">{value}</Text>
      <View style={[styles.barContainer, { backgroundColor: colors.background.tertiary }]}>
        <View 
          style={[
            styles.barFill, 
            { backgroundColor: color, width: `${percentage}%` }
          ]} 
        />
      </View>
      <Text variant="secondary" size="xs">{label}</Text>
    </View>
  );
}

interface HighScoresProps {
  player: SavedPlayer;
  period?: Period;
}

export function HighScores({ player, period }: HighScoresProps) {
  const colors = useThemeColors();
  
  const totalScores = (player.totalSixtyPlus || 0) + 
    (player.totalEightyPlus || 0) + 
    (player.totalTonPlus || 0);

  return (
    <View>
      <Text size="lg" weight="semibold" style={styles.title}>High Scores</Text>
      <Card variant="secondary">
        <View style={[styles.header, { borderBottomColor: colors.border.primary }]}>
          <Award size={32} color={colors.avatar.purple} style={styles.icon} />
          <View>
            <Text size="xxxl" weight="semibold">{player.totalOneEighties || 0}</Text>
            <Text variant="secondary" size="xs" style={styles.subtitle}>180s Scored</Text>
          </View>
        </View>
        <View style={styles.scoreGrid}>
          <ScoreBar
            label="60+"
            value={player.totalSixtyPlus || 0}
            color={colors.brand.primary}
            total={totalScores}
          />
          <ScoreBar
            label="80+"
            value={player.totalEightyPlus || 0}
            color={colors.avatar.blue}
            total={totalScores}
          />
          <ScoreBar
            label="100+"
            value={player.totalTonPlus || 0}
            color={colors.avatar.purple}
            total={totalScores}
          />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
  },
  icon: {
    marginRight: spacing.md,
  },
  subtitle: {
    marginTop: -spacing.xs,
  },
  scoreGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: spacing.xl,
  },
  scoreBar: {
    alignItems: 'center',
    flex: 1,
  },
  barContainer: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    marginVertical: spacing.xs,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
});