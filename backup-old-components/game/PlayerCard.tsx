import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { spacing, typography, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';

const { width } = Dimensions.get('window');

interface PlayerCardProps {
  name: string;
  score: number;
  legAvg: number;
  isActive: boolean;
  legs: number;
  sets: number;
}

export function PlayerCard({ name, score, legAvg, isActive, legs = 0, sets = 0 }: PlayerCardProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.card, { backgroundColor: colors.background.secondary }, isActive && { borderColor: colors.brand.primary, borderWidth: 1 }]}>
      <View style={styles.nameContainer}>
        {isActive && <View style={[styles.activeIndicator, { backgroundColor: colors.brand.primary }]} />}
        <Text style={[styles.name, { color: colors.text.secondary }, isActive && { color: colors.text.primary }]}>{name}</Text>
      </View>
      <Text style={[styles.score, { color: colors.text.secondary }, isActive && { color: colors.text.primary }]}>{score}</Text>
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>Avg</Text>
          <Text style={[styles.statValue, { color: colors.text.secondary }]}>{legAvg ? legAvg.toFixed(1) : '-'}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.text.secondary }]}>L/S</Text>
          <Text style={[styles.statValue, { color: colors.text.secondary }]}>{legs}/{sets}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: layout.radius.lg,
    padding: spacing.sm,
    alignItems: 'center',
    minWidth: width * 0.2,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  activeIndicator: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: spacing.xs,
  },
  name: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.regular,
    marginBottom: spacing.xs,
  },
  score: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.families.semiBold,
    marginBottom: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: typography.sizes.xxs,
    fontFamily: typography.families.regular,
  },
  statValue: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.regular,
  },
});