import { View, StyleSheet } from 'react-native';
import { Trophy, ArrowUp, ArrowDown } from 'lucide-react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/ui/atoms/Text';
import { Accordion } from '@/components/ui/molecules/Accordion';
import { Player } from '@/types/game';
import { LinearGradient } from 'expo-linear-gradient';

interface PlayerAccordionProps {
  player: Player;
  index: number;
  isWinner: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  savedGameAvg?: number;
}

export function PlayerAccordion({
  player,
  index,
  isWinner,
  isExpanded,
  onToggle,
  savedGameAvg,
}: PlayerAccordionProps) {
  const colors = useThemeColors();

  const getPerformanceIndicator = () => {
    if (!savedGameAvg) return null;
    
    const difference = player.gameAvg - savedGameAvg;
    if (Math.abs(difference) < 0.1) return null;

    if (difference > 0) {
      return {
        icon: ArrowUp,
        color: colors.brand.success,
        tooltip: `${difference.toFixed(1)} above average`
      };
    }
    return {
      icon: ArrowDown,
      color: colors.brand.error,
      tooltip: `${Math.abs(difference).toFixed(1)} below average`
    };
  };

  const performance = getPerformanceIndicator();

  const header = (
    <>
      <View style={styles.rankContainer}>
        {index === 0 ? (
          <LinearGradient
            colors={[colors.avatar.colors.gold.start, colors.avatar.colors.gold.end]}
            style={styles.rankBadge}
          >
            <Trophy size={16} color={colors.avatar.colors.gold.text} />
          </LinearGradient>
        ) : (
          <View style={[styles.rankBadge, { backgroundColor: colors.background.tertiary }]}>
            <Text style={{ color: colors.text.primary }}>{index + 1}</Text>
          </View>
        )}
      </View>
      <View style={[styles.avatar, { backgroundColor: player.color }]}>
        <Text style={styles.avatarText}>{player.name[0].toUpperCase()}</Text>
      </View>
      <View style={styles.nameContainer}>
        <Text weight="semibold">{player.name}</Text>
        <Text variant="secondary" size="xs">
          {player.sets} sets won
        </Text>
      </View>
      <View style={styles.averageContainer}>
        <View style={styles.averageRow}>
          <Text weight="semibold">{player.gameAvg.toFixed(1)}</Text>
          {performance && (
            <View 
              style={[
                styles.performanceIndicator, 
                { backgroundColor: `${performance.color}20` }
              ]}
            >
              <performance.icon size={16} color={performance.color} />
            </View>
          )}
        </View>
        <Text variant="secondary" size="xs">Average</Text>
      </View>
    </>
  );

  const content = (
    <View style={styles.statsGrid}>
      <View style={[styles.statBox, { backgroundColor: colors.background.tertiary }]}>
        <Text variant="secondary" size="xs">Avg</Text>
        <Text weight="semibold">{player.gameAvg.toFixed(1)}</Text>
      </View>
      <View style={[styles.statBox, { backgroundColor: colors.background.tertiary }]}>
        <Text variant="secondary" size="xs">Checkout %</Text>
        <Text weight="semibold">{player.checkoutPercentage.toFixed(1)}%</Text>
      </View>
      <View style={[styles.statBox, { backgroundColor: colors.background.tertiary }]}>
        <Text variant="secondary" size="xs">180s</Text>
        <Text weight="semibold">{player.oneEighties}</Text>
      </View>
    </View>
  );

  return (
    <Accordion
      index={index}
      isExpanded={isExpanded}
      onToggle={onToggle}
      header={header}
      content={content}
      isHighlighted={isWinner}
      highlightColor={colors.brand.primary}
      animationDelay={index * 100}
    />
  );
}

const styles = StyleSheet.create({
  rankContainer: {
    marginRight: spacing.md,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  nameContainer: {
    flex: 1,
  },
  averageContainer: {
    alignItems: 'flex-end',
  },
  averageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  performanceIndicator: {
    padding: spacing.xxs,
    borderRadius: layout.radius.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statBox: {
    flex: 1,
    borderRadius: layout.radius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
});