import { View, StyleSheet } from 'react-native';
import { spacing, layout, colors } from '@/constants/theme';
import { Text } from '@/components/ui/atoms/Text';
import { useThemeColors } from '@/constants/theme/colors';
import { Player } from '@/types/game';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

interface PlayerStatsCardProps {
  player: Player;
}

export function PlayerStatsCard({ player }: PlayerStatsCardProps) {
  const colors = useThemeColors();

  // Helper function to get gradient colors based on player color
  const getGradientColors = (baseColor: string) => {
    return [
      `${baseColor}40`, // 25% opacity
      `${baseColor}10`  // 10% opacity
    ];
  };

  // Example checkout suggestion - this would be calculated based on remaining score
  const checkoutSuggestion = {
    route1: ['T20', '20', 'D20'],
    isPreferred: true
  };

  return (
    <Animated.View 
      entering={FadeIn}
      style={styles.wrapper}
    >
      <LinearGradient
        colors={getGradientColors(player.color || colors.brand.primary)}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <View style={[styles.container, { backgroundColor: colors.background.card.primary + '80' }]}>
          {/* Score and Checkout Route */}
          <View style={styles.header}>
            <Text 
              size="xxxl" 
              weight="semibold" 
              style={{ color: player.color || colors.brand.primary }}
            >
              {player.score}
            </Text>
            {player.score <= 170 && checkoutSuggestion && (
              <View style={styles.checkoutContainer}>
                <View style={styles.checkoutRoute}>
                  {checkoutSuggestion.route1.map((step, index) => (
                    <View 
                      key={index}
                      style={[
                        styles.checkoutStep,
                        { backgroundColor: colors.background.tertiary }
                      ]}
                    >
                      <Text 
                        size="sm" 
                        style={{ color: colors.brand.success }}
                      >
                        {step}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Recent Throws and Game Info */}
          <View style={styles.throwsContainer}>
            <View style={styles.throwsRow}>
              {player.legTurns.slice(0, 5).map((score, index) => (
                <Text 
                  key={index}
                  variant="secondary"
                  size="lg"
                >
                  {score}
                </Text>
              )).reverse()}
            </View>
            <View style={styles.gameInfo}>
              <View style={[styles.tag, { backgroundColor: colors.background.card.secondary }]}>
                <Text variant="secondary" size="xs">Leg {player.legs + 1}</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: colors.background.tertiary }]}>
                <Text variant="secondary" size="xs">Set {player.sets + 1}</Text>
              </View>
            </View>
          </View>

          {/* Statistics */}
          <View style={styles.statsContainer}>
            <View style={styles.statGroup}>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text variant="secondary" size="xxs">Game Avg.</Text>
                  <Text weight="semibold" size="md">{player.gameAvg.toFixed(2)}</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.text.secondary + '20' }]} />
                <View style={styles.stat}>
                  <Text variant="secondary" size="xxs">Checkout %</Text>
                  <Text weight="semibold" size="md">{player.checkoutPercentage.toFixed(1)}%</Text>
                </View>
              </View>
            </View>
            <View style={styles.statGroup}>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text variant="secondary" size="xxs">Leg Avg.</Text>
                  <Text weight="semibold" size="md">{player.legAvg.toFixed(1)}</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.text.secondary + '20' }]} />
                <View style={styles.stat}>
                  <Text variant="secondary" size="xxs">Darts</Text>
                  <Text weight="semibold" size="md">{player.dartsThrownThisLeg}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: spacing.container,
    borderRadius: layout.radius.xl,
    overflow: 'hidden',
  },
  gradientContainer: {

    borderRadius: layout.radius.xl,
  },
  container: {
    margin: spacing.lg,
    padding: spacing.container,
    borderRadius: layout.radius.xl,
    gap: spacing.sm,
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',


  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  checkoutContainer: {
    alignItems: 'flex-end',
  },
  checkoutRoute: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  checkoutStep: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: layout.radius.lg,
  },
  throwsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  throwsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  gameInfo: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: layout.radius.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  statGroup: {
    flex: 1,
    gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: layout.radius.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  stat: {
    flex: 1,
    gap: spacing.xxs,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 32,
  },
});
