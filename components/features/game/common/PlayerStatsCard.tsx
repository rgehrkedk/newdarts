import { View, StyleSheet, ScrollView } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { Text } from '@core/atoms/Text';
import { useThemeColors } from '@/constants/theme/colors';
import { Player } from '@/types/game';
import Animated, { 
  FadeIn, 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  Easing, 
  SlideInRight,
  interpolateColor,
  interpolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';

interface PlayerStatsCardProps {
  player: Player;
  previousScore?: number;
}

export function PlayerStatsCard({ player, previousScore }: PlayerStatsCardProps) {
  const colors = useThemeColors();
  const scoreScale = useSharedValue(1);
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  
  // Helper function to get gradient colors based on player color
  const getGradientColors = (baseColor: string) => {
    return [
      `${baseColor}40`, // 25% opacity
      `${baseColor}10`  // 10% opacity
    ];
  };

  // Helper function to determine score color based on value
  const getScoreColor = (score: number): string => {
    if (score >= 140) return colors.score.hot;
    if (score >= 100) return colors.score.high;
    if (score >= 80) return colors.score.medium;
    if (score >= 60) return colors.score.low;
    return colors.text.primary;
  };

  // Checkout suggestion based on remaining score
  const checkoutSuggestion = player.score <= 170 ? {
    route1: ['T20', 'T20', 'D5'],
    isPreferred: true
  } : null;

  // Animation for score changes
  const animatedScoreStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scoreScale.value }]
    };
  });

  // Trigger animation when score changes
  useEffect(() => {
    if (previousScore && previousScore !== player.score) {
      scoreScale.value = withTiming(1.2, {
        duration: 300,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }, () => {
        scoreScale.value = withTiming(1, {
          duration: 300,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      });
    }
    
    // Enable scroll if we have more than 3 turns
    setScrollEnabled(player.legTurns.length > 3);
    
    // Scroll to start whenever new turn is added
    if (player.legTurns.length > 0 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, animated: true });
    }
  }, [player.score, player.legTurns, previousScore]);

  // Format scores for history display with animation
  const renderThrowHistory = () => {
    // Display scores from most recent (left) to oldest (right)
    return [...player.legTurns].reverse().map((score, index) => {
      const isLatest = index === 0;
      const turnNumber = player.legTurns.length - index;
      const scoreColor = getScoreColor(score);
      
      return (
        <Animated.View 
          key={`${turnNumber}-${score}`}
          entering={isLatest ? SlideInRight.duration(400) : undefined}
          style={[
            styles.throwHistoryItem, 
            { backgroundColor: colors.background.card.primary }
          ]}
        >
          <Text 
            size="xs" 
            variant="secondary" 
            style={[
              styles.turnNumber, 
              { 
                color: colors.text.secondary,
                backgroundColor: colors.background.button.secondary
              }
            ]}
          >
            {turnNumber}
          </Text>
          <Text 
            size="lg" 
            weight="semibold"
            
            style={{ color: scoreColor, left: 6  }}
          >
            {score}
          </Text>
        </Animated.View>
      );
    });
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
          {/* Header with Score and Checkout */}
          <View style={styles.header}>
            {/* Checkout Route (when score <= 170) */}
            {player.score <= 170 && checkoutSuggestion ? (
              <View style={styles.checkoutContainer}>
                <View style={styles.checkoutRoute}>
                  {checkoutSuggestion.route1.map((step, index) => (
                    <View 
                      key={index}
                      style={[
                        styles.checkoutStep,
                        { backgroundColor: colors.background.card.primary }
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
            ) : (
              <View style={styles.emptySpace} />
            )}
            
            <Animated.View style={animatedScoreStyle}>
              <Text 
                size="xxxl" 
                weight="semibold" 
                style={{ color: player.color || colors.brand.primary }}
              >
                {player.score}
              </Text>
            </Animated.View>
          </View>

          {/* Recent Throws with Horizontal Scroll */}
          <View style={styles.throwsContainer}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEnabled={scrollEnabled}
              contentContainerStyle={styles.throwsScrollContent}
            >
              {renderThrowHistory()}
              
              {/* Add gradient fade at the right edge when scrollable */}
              {scrollEnabled && (
                <LinearGradient
                  colors={['transparent', colors.background.card.primary + colors.transparency.medium]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.scrollGradient}
                />
              )}
            </ScrollView>
          </View>

          {/* Statistics */}
          <View style={[styles.statsContainer, { backgroundColor: colors.background.card.primary }]}>
            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text variant="secondary" size="xxs">Game Avg.</Text>
                <Text weight="semibold" size="md" style={{ color: getScoreColor(player.gameAvg) }}>
                  {player.gameAvg.toFixed(1)}
                </Text>
              </View>
              
              <View style={[styles.divider, { backgroundColor: colors.text.secondary + '20' }]} />
              
              <View style={styles.stat}>
                <Text variant="secondary" size="xxs">Leg Avg.</Text>
                <Text weight="semibold" size="md" style={{ color: getScoreColor(player.legAvg) }}>
                  {player.legAvg.toFixed(1)}
                </Text>
              </View>
              
              <View style={[styles.divider, { backgroundColor: colors.text.secondary + '20' }]} />
              
              <View style={styles.stat}>
                <Text variant="secondary" size="xxs">Checkout %</Text>
                <Text weight="semibold" size="md">{player.checkoutPercentage.toFixed(1)}%</Text>
              </View>
              
              <View style={[styles.divider, { backgroundColor: colors.text.secondary + '20' }]} />
              
              <View style={styles.stat}>
                <Text variant="secondary" size="xxs">Darts</Text>
                <Text weight="semibold" size="md">{player.dartsThrownThisLeg}</Text>
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
    marginBottom: spacing.md,
  },
  gradientContainer: {
    borderRadius: layout.radius.xl,
  },
  container: {
    margin: spacing.sm,
    padding: spacing.sm,
    borderRadius: layout.radius.xl,
    gap: spacing.sm,
    overflow: 'hidden',
    backdropFilter: 'blur(10px)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptySpace: {
    flex: 1,
  },
  checkoutContainer: {
    flex: 1,
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
    height: 60,
    marginTop: spacing.xs,
  },
  throwsScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 40, // Space for the gradient fade
  },
  throwsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  throwHistoryItem: {
    width: 74,
    height: 32,

    marginRight: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layout.radius.lg,
    position: 'relative',
  },
  turnNumber: {
    position: 'absolute',
    top: 8,
    left: 8,
    borderRadius: layout.radius.sm,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  scrollGradient: {
    position: 'absolute',
    right: 0,
    width: 40,
    height: '100%',
  },
  statsContainer: {
    borderRadius: layout.radius.lg,
    padding: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 32,
  },
});