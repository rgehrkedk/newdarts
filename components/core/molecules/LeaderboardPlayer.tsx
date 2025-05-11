// components/core/molecules/LeaderboardPlayer.tsx
import React, { useRef, useState } from 'react';
import { TouchableWithoutFeedback, StyleSheet, View } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@core/atoms/Text';
import { Avatar } from '@core/atoms/Avatar';
import { SavedPlayer, SortCategory } from '@/types/game';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { GradientCard } from './GradientCard';

// Interface for the position and dimensions object, similar to example
export interface LeaderboardPlayerPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LeaderboardPlayerProps {
  player: SavedPlayer;
  index: number;
  // onPress now passes position and player to parent, parent handles overlay
  onPress: (player: SavedPlayer, position: LeaderboardPlayerPosition) => void;
  sortBy: SortCategory;
  clean?: boolean;
  variant?: 'primary' | 'secondary' | 'avatar' | 'neutral';
  activeVariant?: 'primary' | 'secondary' | 'avatar' | 'neutral'; // For press-in feedback
  activeOpacity?: number; // For press-in feedback
  pressAnimationDuration?: number; // Duration for local press-in feedback
  showRank?: boolean;
}

export function LeaderboardPlayer({
  player,
  index,
  onPress,
  sortBy,
  clean = false,
  variant = 'neutral',
  activeVariant = 'avatar',
  activeOpacity = 0.9, // Example active opacity for press-in
  pressAnimationDuration = 100,
  showRank = true,
}: LeaderboardPlayerProps) {
  const colors = useThemeColors();
  const cardRef = useRef<View>(null);

  const pressProgress = useSharedValue(0); // 0 = normal, 1 = pressed
  const [currentVariant, setCurrentVariant] = useState(variant);

  const getStatValue = (): string => {
    switch (sortBy) {
      case 'average': return (player.gameAvg || 0).toFixed(1);
      case 'checkout': return `${(player.checkoutPercentage || 0).toFixed(1)}%`;
      case 'first9': return (player.avgFirstNine || 0).toFixed(1);
      case 'winrate': return `${(player.winRate || 0).toFixed(1)}%`;
      case 'games': return `${player.gamesPlayed || 0}`;
      case 'highestCheckout': return `${player.highestCheckout || 0}`;
      case 'bestLeg': return (player.bestLegAvg || 0).toFixed(1);
      case '180s': return `${player.totalOneEighties || 0}`;
      default: return (player.gameAvg || 0).toFixed(1);
    }
  };
  const getStatLabel = (): string => {
    switch (sortBy) {
      case 'average': return 'avg';
      case 'checkout': return 'checkout';
      case 'first9': return 'first 9';
      case 'winrate': return 'win rate';
      case 'games': return 'games';
      case 'highestCheckout': return 'high CO';
      case 'bestLeg': return 'best leg';
      case '180s': return '180s';
      default: return 'avg';
    }
  };

  const handleCardPress = () => {
    if (cardRef.current) {
      // measure gives x, y relative to parent. pageX, pageY are screen coords.
      cardRef.current.measure((x, y, width, height, pageX, pageY) => {
        onPress(player, { x: pageX, y: pageY, width, height });
      });
    }
  };

  const handlePressIn = () => {
    pressProgress.value = withTiming(1, { duration: pressAnimationDuration });
    setCurrentVariant(activeVariant);
  };
  const handlePressOut = () => {
    pressProgress.value = withTiming(0, { duration: pressAnimationDuration });
    setCurrentVariant(variant);
  };

  const cardAnimatedStyleForPress = useAnimatedStyle(() => {
    return {
      opacity: interpolate(pressProgress.value, [0, 1], [1, activeOpacity]),
      transform: [{ scale: interpolate(pressProgress.value, [0, 1], [1, 0.97]) }],
    };
  });

  return (
    <Animated.View entering={FadeIn.delay(index * 70)}>
      <TouchableWithoutFeedback
        onPress={handleCardPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View ref={cardRef} style={cardAnimatedStyleForPress}>
          {/* No sharedTransitionTag here. This View's geometry is measured. */}
          <GradientCard
            variant={currentVariant} // For press-in visual feedback
            avatarColor={player.color}
            avatarGradientColor={player.color}
            clean={clean}
            height={72} // Fixed height for consistent measurement
            contentAlignment={'center'}
            pressable={false}
            outerTransparency={colors.transparency.veryLow}
            style={styles.gradientCard}
            borderRadius={layout.radius.lg} // Initial border radius for the card
            innerMargin={2}
            contentPadding={{ horizontal: spacing.md, vertical: spacing.sm }}
          >
            {/* This is the visual content of the card. PlayerOverlay will reconstruct a similar header. */}
            <View style={styles.innerContainer}>
              <View style={styles.rankAndContent}>
                {showRank && (
                  <View // Plain View, not part of shared element animation system
                    style={[
                      styles.rankContainer,
                      { backgroundColor: index < 3 ? `${player.color}30` : 'transparent' },
                    ]}
                  >
                    <Text
                      weight="semibold"
                      size="lg"
                      style={[
                        styles.rankText,
                        { color: index < 3 ? player.color : colors.text.secondary },
                      ]}
                    >
                      {index + 1}
                    </Text>
                  </View>
                )}
                <View style={styles.content}>
                  <View style={styles.avatarWrapper}>
                    {/* This Avatar's properties (size 40) will be the source for interpolation */}
                    <Avatar name={player.name} color={player.color} size={40} />
                  </View>
                  <View style={styles.textContainer}>
                    {/* This Text's properties (fontSize 16) will be the source for interpolation */}
                    <Text style={[styles.name, { color: colors.text.primary }]}>{player.name}</Text>
                    <Text variant="secondary" size="sm">{player.gamesPlayed || 0} games played</Text>
                  </View>
                </View>
              </View>
              <View style={styles.statsOnCard}>
                <Text weight="semibold" style={{ color: colors.brand.primary }}>{getStatValue()}</Text>
                <Text size="xs" variant="secondary">{getStatLabel()}</Text>
              </View>
            </View>
          </GradientCard>
        </Animated.View>
      </TouchableWithoutFeedback>
      {/* Modal is removed from here; parent (test.tsx) controls PlayerOverlay's visibility */}
    </Animated.View>
  );
}

// Styles from your original LeaderboardPlayer.tsx
const styles = StyleSheet.create({
    gradientCard: {},
    innerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' },
    rankAndContent: { flexDirection: 'row', alignItems: 'center' },
    rankContainer: { width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginRight: spacing.sm },
    rankText: { textAlign: 'center' },
    content: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    avatarWrapper: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden' }, // Fixed size for consistency
    textContainer: { gap: spacing.xs },
    name: { fontSize: 16, fontWeight: '600' }, // Source font size for name
    statsOnCard: { alignItems: 'flex-end' },
});