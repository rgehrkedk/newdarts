// components/core/molecules/LeaderboardPlayer.tsx
import React, { useRef, useState } from 'react';
import { TouchableWithoutFeedback, StyleSheet, View, Modal } from 'react-native';
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
  Extrapolate,
  useDerivedValue
} from 'react-native-reanimated';
import { GradientCard } from './GradientCard';
import { PlayerOverlay } from '@/components/features/stats/components';

interface LeaderboardPlayerProps {
  player: SavedPlayer;
  index: number;
  onPress?: (player: SavedPlayer, position: { x: number, y: number, width: number, height: number }) => void;
  sortBy: SortCategory;
  clean?: boolean; // Whether to use clean version (default: true)
  variant?: 'primary' | 'secondary' | 'avatar' | 'neutral'; // Default card variant
  activeVariant?: 'primary' | 'secondary' | 'avatar' | 'neutral'; // Variant when pressed (defaults to avatar)
  activeOpacity?: number; // Opacity level when pressed (0-1)
  transitionDuration?: number; // Duration of transition in ms
}

export function LeaderboardPlayer({
  player,
  index,
  onPress,
  sortBy,
  clean = false,
  variant = 'neutral',
  activeVariant = 'avatar',
  activeOpacity = 0.1,
  transitionDuration = 150
}: LeaderboardPlayerProps) {
  const colors = useThemeColors();
  const cardRef = useRef<View>(null);

  // Animation values
  const pressed = useSharedValue(0);
  const opacity = useSharedValue(1);
  
  // Create a state to track the current variant
  const [currentVariant, setCurrentVariant] = useState(variant);

  // Flag to ensure we don't trigger multiple measurements
  const isMeasuring = useRef(false);

  // Get display value based on sort category
  const getStatValue = (): string => {
    switch (sortBy) {
      case 'average':
        return (player.gameAvg || 0).toFixed(1);
      case 'checkout':
        return `${(player.checkoutPercentage || 0).toFixed(1)}%`;
      case 'first9':
        return (player.avgFirstNine || 0).toFixed(1);
      case 'winrate':
        return `${(player.winRate || 0).toFixed(1)}%`;
      case 'games':
        return `${player.gamesPlayed || 0}`;
      case 'highestCheckout':
        return `${player.highestCheckout || 0}`;
      case 'bestLeg':
        return (player.bestLegAvg || 0).toFixed(1);
      case '180s':
        return `${player.totalOneEighties || 0}`;
      default:
        return (player.gameAvg || 0).toFixed(1);
    }
  };

  // Get label for the stat
  const getStatLabel = (): string => {
    switch (sortBy) {
      case 'average':
        return 'avg';
      case 'checkout':
        return 'checkout';
      case 'first9':
        return 'first 9';
      case 'winrate':
        return 'win rate';
      case 'games':
        return 'games';
      case 'highestCheckout':
        return 'high CO';
      case 'bestLeg':
        return 'best leg';
      case '180s':
        return '180s';
      default:
        return 'avg';
    }
  };

  // Add rank to player for display in overlay
  const enhancedPlayer = {
    ...player,
    rank: index + 1,
  };

  // State to control modal visibility
  const [showOverlay, setShowOverlay] = useState(false);

  // Handle press to show our overlay without calling the external onPress
  const handlePress = () => {
    // Just show our overlay without triggering external handlers
    setShowOverlay(true);
  };

  // Handler to close the overlay
  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  // Set card content
  const CardContent = () => (
    <View style={styles.innerContainer}>
      <View style={styles.rankAndContent}>
        <Animated.View 
          style={[
            styles.rankContainer, 
            { backgroundColor: index < 3 ? `${player.color}30` : 'transparent' }
          ]}
          sharedTransitionTag={`rank-${player.id}`}
        >
          <Text 
            weight="semibold" 
            size="lg" 
            style={[
              styles.rankText, 
              { color: index < 3 ? player.color : colors.text.secondary }
            ]}
          >
            {index + 1}
          </Text>
        </Animated.View>

        <View style={styles.content}>
          <Animated.View 
            style={styles.avatarWrapper}
            sharedTransitionTag={`avatar-container-${player.id}`}
          >
            <Avatar
              name={player.name}
              color={player.color}
              size={40}
              sharedTransitionTag={`avatar-${player.id}`}
            />
          </Animated.View>

          <View style={styles.textContainer}>
            <Animated.Text 
              style={[styles.name, { color: colors.text.primary }]}
              sharedTransitionTag={`name-${player.id}`}
            >
              {player.name}
            </Animated.Text>
            <Text variant="secondary" size="sm">
              {player.gamesPlayed || 0} games played
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.stats}>
        <Text weight="semibold" style={{ color: colors.brand.primary }}>
          {getStatValue()}
        </Text>
        <Text size="xs" variant="secondary">{getStatLabel()}</Text>
      </View>
    </View>
  );

  // Create animated styles for the container
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        opacity.value,
        [0, 1],
        [activeOpacity, 1],
        Extrapolate.CLAMP
      )
    };
  });

  // Handle press in - activate pressed state
  const handlePressIn = () => {
    pressed.value = withTiming(1, { duration: transitionDuration });
    opacity.value = withTiming(activeOpacity, { duration: transitionDuration });
    setCurrentVariant(activeVariant);
  };

  // Handle press out - deactivate pressed state
  const handlePressOut = () => {
    pressed.value = withTiming(0, { duration: transitionDuration });
    opacity.value = withTiming(1, { duration: transitionDuration });
    setCurrentVariant(variant);
  };

  return (
    <Animated.View
      entering={FadeIn.delay(index * 100)}
      style={animatedStyle}
    >
      <TouchableWithoutFeedback
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
      >
        <View
          ref={cardRef}
          onLayout={() => {
            // Reset measurement flag whenever layout changes
            isMeasuring.current = false;
          }}
        >
          <GradientCard
            variant={currentVariant}
            avatarColor={player.color}
            avatarGradientColor={player.color}
            clean={clean}
            height={72}
            contentAlignment={'center'}
            pressable={false} // Disable internal pressable behavior
            outerTransparency={colors.transparency.veryLow} // Lower transparency for more subtle effect
            animationDelay={index * 50}
            style={styles.gradientCard}
            borderRadius={layout.radius.lg} // Customize the border radius
            innerMargin={2} // Use a smaller inner margin for a sleeker look
            contentPadding={{ horizontal: spacing.md, vertical: spacing.sm }} // Custom padding for player cards
          >
            <CardContent />
          </GradientCard>
        </View>
      </TouchableWithoutFeedback>

      {/* Player overlay modal */}
      <Modal
        visible={showOverlay}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseOverlay}
      >
        <View style={styles.modalContainer}>
          <PlayerOverlay
            player={enhancedPlayer}
            onClose={handleCloseOverlay}
          />
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  gradientCard: {

  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    // Padding is now handled by GradientCard's contentPadding prop
  },
  rankAndContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  rankText: {
    textAlign: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatarWrapper: {
    // Adding a dedicated wrapper for shared element transitions
    borderRadius: 20, // Half of the avatar size for proper masking
    overflow: 'hidden',
  },
  textContainer: {
    gap: spacing.xs,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  stats: {
    alignItems: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
});