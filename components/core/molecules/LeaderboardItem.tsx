// components/core/molecules/LeaderboardItem.tsx
import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@core/atoms/Text';
import { Avatar } from '@core/atoms/Avatar';
import { SavedPlayer, SortCategory } from '@/types/game';
import Animated, { FadeIn } from 'react-native-reanimated';

interface LeaderboardItemProps {
  player: SavedPlayer;
  index: number;
  onPress?: (player: SavedPlayer, position: { x: number, y: number, width: number, height: number }) => void;
  sortBy: SortCategory;
}

export function LeaderboardItem({ 
  player, 
  index, 
  onPress, 
  sortBy 
}: LeaderboardItemProps) {
  const colors = useThemeColors();
  const cardRef = useRef<View>(null);
  
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

  const handlePress = () => {
    if (!onPress || !cardRef.current || isMeasuring.current) return;
    
    // Set the measuring flag to prevent multiple measurements
    isMeasuring.current = true;
    
    // Measure the card's position and dimensions
    // The setTimeout ensures the UI is fully rendered before measuring
    setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.measure((x, y, width, height, pageX, pageY) => {
          console.log(`Measured position for player ${player.id}: x=${pageX}, y=${pageY}, width=${width}, height=${height}`);
          
          // Pass measurements to parent component
          onPress(enhancedPlayer, {
            x: pageX,
            y: pageY,
            width,
            height
          });
          
          // Reset the measuring flag
          isMeasuring.current = false;
        });
      }
    }, 10); // Short delay to ensure measurement is accurate
  };

  return (
    <Animated.View entering={FadeIn.delay(index * 100)}>
      <TouchableOpacity
        ref={cardRef}
        onPress={handlePress}
        style={[styles.container, { backgroundColor: colors.background.card.primary }]}
        // Force remeasurement when layout changes
        onLayout={() => {
          // Reset measurement flag whenever layout changes
          isMeasuring.current = false;
        }}
      >
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
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: layout.radius.lg,
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
});