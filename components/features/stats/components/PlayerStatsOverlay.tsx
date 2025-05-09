/**
 * PlayerStatsOverlay
 * 
 * An animated overlay that expands from a source element to a full-screen modal.
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions, BackHandler, StatusBar, Platform } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Avatar } from '@core/atoms/Avatar';
import { Text } from '@core/atoms/Text';
import { SavedPlayer } from '@/types/game';
import { ChevronLeft, X } from 'lucide-react-native';
import { IconButton } from '@core/atoms/IconButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  interpolate,
  Extrapolate,
  runOnJS,
  useAnimatedGestureHandler,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { PlayerStatsContent } from '../PlayerStats';

// Animation configuration - significantly slower and more dramatic
const ANIMATION_CONFIG = {
  // Opening animation (expansion)
  OPEN_ANIMATION: {
    STIFFNESS: 35,        // Much lower stiffness for slower movement
    DAMPING: 20,          // Slightly reduced damping for a tiny bit more bounce 
    MASS: 2.5,            // Much higher mass for slower, weightier movement
    DURATION: 2200,       // Much longer duration (over a second)
  },
  
  // Content fade-in
  CONTENT_FADE: {
    DURATION: 600,        // Longer fade-in
    DELAY: 500,           // Wait longer before starting fade
  },
  
  // Closing animation
  CLOSE_ANIMATION: {
    DURATION: 650,        // How long closing animation takes
  }
};

interface PlayerStatsOverlayProps {
  player: SavedPlayer | null;
  isVisible: boolean;
  onClose: () => void;
  onAnimationComplete?: () => void;
  itemPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  onOptionsPress?: () => void;
}

export function PlayerStatsOverlay({
  player,
  isVisible,
  onClose,
  onAnimationComplete,
  itemPosition,
  onOptionsPress,
}: PlayerStatsOverlayProps) {
  const colors = useThemeColors();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Animation values
  const progress = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  
  // Gesture values
  const translateY = useSharedValue(0);
  
  // Gesture handler for dragging the overlay
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      // Store current position in context
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      // Only allow dragging downward, with some resistance
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
      
      // Adjust content opacity as user drags
      const threshold = SCREEN_HEIGHT * 0.15;
      const dragRatio = Math.min(1, translateY.value / threshold);
      contentOpacity.value = 1 - dragRatio * 0.5; 
    },
    onEnd: (event) => {
      const threshold = SCREEN_HEIGHT * 0.15;
      
      if (translateY.value > threshold || event.velocityY > 500) {
        // Dismiss if dragged far enough or with enough velocity
        translateY.value = withTiming(SCREEN_HEIGHT, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        }, (finished) => {
          if (finished) {
            runOnJS(onClose)();
          }
        });
        
        contentOpacity.value = withTiming(0, { duration: 250 });
      } else {
        // Spring back to original position
        translateY.value = withTiming(0, {
          duration: 300,
          easing: Easing.out(Easing.cubic),
        });
        contentOpacity.value = withTiming(1, { duration: 250 });
      }
    },
  });

  useEffect(() => {
    // Handle hardware back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (isVisible) {
        onClose();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [isVisible, onClose]);

  // Animation for opening and closing the overlay
  useEffect(() => {
    if (isVisible) {
      // Reset all gesture and animation state before opening
      translateY.value = 0;
      
      // Opening animation: Use spring physics for configurable feel
      progress.value = withSpring(1, {
        damping: ANIMATION_CONFIG.OPEN_ANIMATION.DAMPING,
        stiffness: ANIMATION_CONFIG.OPEN_ANIMATION.STIFFNESS,
        mass: ANIMATION_CONFIG.OPEN_ANIMATION.MASS,
        duration: ANIMATION_CONFIG.OPEN_ANIMATION.DURATION,
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      });
      
      // Fade in content after the card has started expanding
      contentOpacity.value = withTiming(1, {
        duration: ANIMATION_CONFIG.CONTENT_FADE.DURATION,
        easing: Easing.ease,
        delay: ANIMATION_CONFIG.CONTENT_FADE.DELAY,
      });
    } else {
      // Already being dragged away - we'll let gesture handler take care of it
      if (translateY.value > SCREEN_HEIGHT * 0.1) {
        // Continue the gesture-initiated dismissal
        return;
      }
      
      // Regular close animation
      // First hide content
      contentOpacity.value = withTiming(0, { 
        duration: 180,
        easing: Easing.out(Easing.quad),
      });
      
      // Then smoothly animate back to the source position
      progress.value = withTiming(0, {
        duration: ANIMATION_CONFIG.CLOSE_ANIMATION.DURATION,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }, (finished) => {
        'worklet';
        if (finished && onAnimationComplete) {
          runOnJS(onAnimationComplete)();
        }
      });
      
      // Reset drag position
      translateY.value = withTiming(0, { duration: 300 });
    }
  }, [isVisible, progress, contentOpacity, translateY, itemPosition, onClose, onAnimationComplete, SCREEN_HEIGHT]);
  
  // Handle status bar appearance
  useEffect(() => {
    if (isVisible) {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('transparent');
        StatusBar.setTranslucent(true);
      }
    }
    
    return () => {
      StatusBar.setBarStyle('default');
      if (Platform.OS === 'android') {
        StatusBar.setTranslucent(false);
      }
    };
  }, [isVisible]);

  // Background overlay style
  const overlayStyle = useAnimatedStyle(() => {
    // Slightly accelerate opacity animations for better feel
    const opacityValue = isVisible 
      ? interpolate(
          progress.value,
          [0, 0.5, 1],
          [0, 0.8, 1],
          Extrapolate.CLAMP
        )
      : interpolate(
          progress.value,
          [0, 0.3, 1],
          [0, 0, 1],
          Extrapolate.CLAMP
        );
    
    return {
      opacity: opacityValue,
      backgroundColor: `rgba(0, 0, 0, ${interpolate(
        progress.value,
        [0, 1],
        [0, 0.7],
        Extrapolate.CLAMP
      )})`,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: isVisible ? 999 : -1,
    };
  });

  // Modal container style with proper dragging support
  const modalStyle = useAnimatedStyle(() => {
    // Use default values if position data is missing
    const hasValidPosition = itemPosition && 
                           itemPosition.x !== undefined && 
                           itemPosition.y !== undefined;
    
    // Starting position
    const initialX = hasValidPosition ? itemPosition!.x : SCREEN_WIDTH / 2 - 150;
    const initialY = hasValidPosition ? itemPosition!.y : SCREEN_HEIGHT - 200;
    const initialWidth = hasValidPosition ? itemPosition!.width : 300;
    const initialHeight = hasValidPosition ? itemPosition!.height : 80;

    // Target position (leave space at top)
    const targetX = 0;
    const targetY = insets.top;
    const targetWidth = SCREEN_WIDTH;
    const targetHeight = SCREEN_HEIGHT - insets.top - 10;
    
    return {
      position: 'absolute',
      left: interpolate(
        progress.value,
        [0, 1],
        [initialX, targetX],
        Extrapolate.CLAMP
      ),
      top: interpolate(
        progress.value,
        [0, 1],
        [initialY, targetY],
        Extrapolate.CLAMP
      ),
      // Combine base position with drag offset
      transform: [
        { translateY: translateY.value }
      ],
      width: interpolate(
        progress.value,
        [0, 1],
        [initialWidth, targetWidth],
        Extrapolate.CLAMP
      ),
      height: interpolate(
        progress.value,
        [0, 1],
        [initialHeight, targetHeight],
        Extrapolate.CLAMP
      ),
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 8,
      opacity: 1,
      zIndex: isVisible ? 1000 : -1,
      overflow: 'hidden',
      backgroundColor: colors.background.primary,
    };
  });

  // Content style (for the content that fades in)
  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      flex: 1,
      backgroundColor: colors.background.card.primary,
      transform: [
        {
          translateY: interpolate(
            contentOpacity.value,
            [0, 1],
            [20, 0],
            Extrapolate.CLAMP
          ),
        },
      ],
    };
  });
  
  // Drag indicator style with consistent usage of .value
  const dragIndicatorStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(
        translateY.value,
        [0, 100],
        [40, 60],
        Extrapolate.CLAMP
      ),
      opacity: 0.9,
    };
  });

  // Animated style for close button opacity
  const closeButtonOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value
    };
  });

  // Header style for player info that animates from the leaderboard item
  const headerStyle = useAnimatedStyle(() => {
    return {
      paddingHorizontal: interpolate(
        progress.value,
        [0, 1],
        [spacing.md, spacing.xl],
        Extrapolate.CLAMP
      ),
      paddingTop: interpolate(
        progress.value,
        [0, 1],
        [spacing.md, spacing.sm],
        Extrapolate.CLAMP
      ),
      paddingBottom: interpolate(
        progress.value,
        [0, 1],
        [spacing.md, spacing.md],
        Extrapolate.CLAMP
      ),
      borderBottomWidth: interpolate(
        progress.value,
        [0, 1],
        [0, 1],
        Extrapolate.CLAMP
      ),
      borderBottomColor: colors.border.primary,
      backgroundColor: colors.background.card.primary,
    };
  });

  // Only render when we have a player to show
  if (!player) {
    return null;
  }
  
  // Add debug logging for development purposes
  if (__DEV__ && isVisible && !itemPosition) {
    console.warn(
      'PlayerStatsOverlay: Item position is missing even though overlay is visible. ' +
      'This might cause animation issues. Make sure the LeaderboardItem is measuring correctly.'
    );
  }
  
  // Prepare shared elements for better animations
  const avatarTransitionTag = `avatar-${player.id}`;
  const nameTransitionTag = `name-${player.id}`;
  const avatarContainerTag = `avatar-container-${player.id}`;

  return (
    <>
      {/* Background overlay */}
      <Animated.View style={overlayStyle} pointerEvents={isVisible ? 'auto' : 'none'}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* Modal container with gesture handler */}
      <PanGestureHandler 
        onGestureEvent={gestureHandler}
      >
        <Animated.View style={modalStyle}>
          {/* Drag indicator at top of modal */}
          <Animated.View style={[styles.dragIndicator, dragIndicatorStyle]} />
          
          {/* Header (always visible during animation) */}
          <Animated.View style={[styles.header, headerStyle]}>
            <View style={styles.headerContent}>
              {/* This part transitions from LeaderboardItem */}
              <View style={styles.avatarSection}>
                <Animated.View 
                  sharedTransitionTag={avatarContainerTag}
                  style={styles.avatarContainer}
                >
                  <Avatar
                    name={player.name}
                    color={player.color}
                    size={64}
                    sharedTransitionTag={avatarTransitionTag}
                  />
                </Animated.View>

                <View style={styles.playerInfo}>
                  <Animated.Text
                    style={[styles.name, { color: colors.text.primary }]}
                    sharedTransitionTag={nameTransitionTag}
                  >
                    {player.name}
                  </Animated.Text>
                  
                  <Animated.View style={styles.badges}>
                    <View style={[styles.badge, { backgroundColor: player.color+'4D' }]}>
                      <Text variant="primary" size="xs">
                        {player.isGuest ? 'Guest Player' : 'You'}
                      </Text>
                    </View>
                    <Text variant="secondary" size="xs">•</Text>
                    <Text variant="primary" size="xs">
                      {player.gamesPlayed} {player.gamesPlayed === 1 ? 'Game' : 'Games'} Played
                    </Text>
                  </Animated.View>
                </View>
              </View>

              {/* Close button - fades in after animation */}
              <Animated.View 
                style={[styles.closeButtonContainer, closeButtonOpacityStyle]}
              >
                <IconButton
                  icon={X}
                  onPress={onClose}
                  variant="transparent"
                  size={24}
                  style={styles.closeButton}
                />
              </Animated.View>
            </View>
          </Animated.View>

          {/* Content (fades in after modal expands) */}
          <Animated.View style={[styles.content, contentStyle]}>
            <PlayerStatsContent player={player} />
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  dragIndicator: {
    height: 6,
    width: 40, // Will be animated
    backgroundColor: 'rgba(120, 120, 120, 0.8)', // Darker color for better visibility
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 8, // Reduced from 15
    marginBottom: 6, // Reduced from 10
  },
  header: {
    width: '100%',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    // Container for the Avatar with shared element transition
    borderRadius: 32, // Half of the avatar size
    overflow: 'hidden',
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
  playerInfo: {
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: layout.radius.full,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  closeButtonContainer: {
    zIndex: 1010, // Ensure it's above all other content
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
});