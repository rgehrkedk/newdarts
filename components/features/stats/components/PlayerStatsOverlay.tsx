/**
 * PlayerStatsOverlay
 * 
 * An animated overlay that expands from a source element to a full-screen modal.
 * Enhanced with animated avatar-to-card transition.
 */

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions, BackHandler, StatusBar, Platform } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Avatar } from '@core/atoms/Avatar';
import { ExpandedAvatar } from '@core/atoms/ExpandedAvatar';
import { Text } from '@core/atoms/Text';
import { SavedPlayer } from '@/types/game';
import { X } from 'lucide-react-native';
import { IconButton } from '@core/atoms/IconButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  interpolate,
  Extrapolate,
  runOnJS,
  useAnimatedGestureHandler,
  cancelAnimation,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { PlayerStatsContent } from '../PlayerStats';

// Animation configuration
const ANIMATION_CONFIG = {
  // Main expansion stages
  PHASES: {
    INITIAL_PAUSE: 150,          // Brief pause before starting
    EXPANSION_DURATION: 2500,    // Very slow expansion to full screen (increased)
    CONTENT_START_DELAY: 900,    // When content starts fading in (increased)
    CONTENT_FADE_DURATION: 1200, // How long content takes to fade in (increased)
  },

  // Easing functions
  EASING: {
    EXPANSION: Easing.bezier(0.1, 0, 0.1, 1),  // Very slow, gentle curve
    CONTENT: Easing.bezier(0, 0.55, 0.45, 1),  // Ease-in-out for content
  },

  // Closing animation
  CLOSE: {
    CONTENT_FADE: 300,           // Fade out content first (increased)
    COLLAPSE_DURATION: 800,      // Collapse back to original position (increased)
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
  const { isDark } = useTheme();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  
  // Keep track of whether this is the first render or a subsequent one
  const isFirstRender = useRef(true);
  const prevPlayerIdRef = useRef<string | null>(null);
  const isNewPlayer = prevPlayerIdRef.current !== player?.id;
  
  // Animation values
  const progress = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);
  const avatarScale = useSharedValue(1);
  
  // Gesture values
  const translateY = useSharedValue(0);
  
  // Explicitly reset all animation values when player changes
  useEffect(() => {
    if (player && prevPlayerIdRef.current !== player.id) {
      console.log('New player detected, resetting animations');
      prevPlayerIdRef.current = player.id;
      
      // Reset all animation values to initial state
      progress.value = 0;
      contentOpacity.value = 0;
      backdropOpacity.value = 0;
      avatarScale.value = 1;
      translateY.value = 0;
    }
  }, [player]);
  
  // Gesture handler for dragging the overlay
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      // Only allow dragging downward, with resistance
      if (event.translationY > 0) {
        translateY.value = event.translationY;
        
        // Adjust content opacity as user drags
        const threshold = SCREEN_HEIGHT * 0.15;
        const dragRatio = Math.min(1, translateY.value / threshold);
        contentOpacity.value = 1 - dragRatio * 0.5; 
      }
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
    // If player changed, we need to make sure values are reset
    if (isVisible && player) {
      console.log(`Animation starting for player ${player.id}, reset state: ${isNewPlayer}`);
      
      // Reset animation values to their initial state
      progress.value = 0;
      contentOpacity.value = 0;
      backdropOpacity.value = 0;
      avatarScale.value = 1;
      translateY.value = 0;

      // Small delay before starting animation
      const startDelay = ANIMATION_CONFIG.PHASES.INITIAL_PAUSE;

      // Start backdrop fade immediately but make it slower
      backdropOpacity.value = withTiming(1, {
        duration: 1000, // Longer duration
        easing: Easing.bezier(0.2, 0.0, 0.2, 1), // Smoother easing
      });

      // Begin main expansion animation
      progress.value = withDelay(
        startDelay,
        withTiming(1, {
          duration: ANIMATION_CONFIG.PHASES.EXPANSION_DURATION,
          easing: ANIMATION_CONFIG.EASING.EXPANSION,
        })
      );

      // Scale avatar gently for a smooth transition
      avatarScale.value = withDelay(
        startDelay + 300,
        withTiming(1.05, {  // Reduced scale for more subtle effect
          duration: 1500,   // Slower animation
          easing: Easing.bezier(0.25, 0.1, 0.25, 1), // More gentle easing
        })
      );

      // Fade in main content after expansion is underway
      contentOpacity.value = withDelay(
        startDelay + ANIMATION_CONFIG.PHASES.CONTENT_START_DELAY,
        withTiming(1, {
          duration: ANIMATION_CONFIG.PHASES.CONTENT_FADE_DURATION,
          easing: ANIMATION_CONFIG.EASING.CONTENT,
        })
      );
      
      // Update the first render flag
      isFirstRender.current = false;
      
    } else if (!isVisible) {
      // Cancel any ongoing animations to prevent conflicts
      cancelAnimation(progress);
      cancelAnimation(contentOpacity);
      cancelAnimation(backdropOpacity);
      cancelAnimation(avatarScale);

      // Check if being dragged and let the gesture handler handle it
      if (translateY.value > SCREEN_HEIGHT * 0.1) {
        return;
      }

      // Normal closing animation sequence

      // First hide content
      contentOpacity.value = withTiming(0, {
        duration: ANIMATION_CONFIG.CLOSE.CONTENT_FADE,
        easing: Easing.out(Easing.quad),
      });

      // Scale avatar back to original size with a smoother transition
      avatarScale.value = withDelay(
        150, // Slightly longer delay
        withTiming(1, {
          duration: ANIMATION_CONFIG.CLOSE.COLLAPSE_DURATION, // Full duration
          easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Gentle easing curve
        })
      );
      
      // Then smoothly animate back to the source position
      progress.value = withTiming(0, {
        duration: ANIMATION_CONFIG.CLOSE.COLLAPSE_DURATION,
        easing: Easing.bezier(0.4, 0, 0.9, 1),
      }, (finished) => {
        'worklet';
        if (finished && onAnimationComplete) {
          runOnJS(onAnimationComplete)();
        }
      });
      
      // Fade out backdrop more slowly
      backdropOpacity.value = withTiming(0, {
        duration: ANIMATION_CONFIG.CLOSE.COLLAPSE_DURATION + 300, // Even longer duration
        easing: Easing.bezier(0.2, 0.0, 0.2, 1), // Same smooth curve
      });
      
      // Reset drag position
      translateY.value = withTiming(0, { duration: 300 });
    }
  }, [isVisible, player, progress, contentOpacity, backdropOpacity, translateY,
      avatarScale, onClose, onAnimationComplete, isNewPlayer, SCREEN_HEIGHT]);
  
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
    return {
      opacity: backdropOpacity.value,
      backgroundColor: `rgba(0, 0, 0, 0.7)`,
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

    // Use more keyframes for a smoother, more fluid animation
    return {
      position: 'absolute',
      left: interpolate(
        progress.value,
        [0, 0.15, 0.3, 0.5, 1],  // More keyframes for smoother movement
        [initialX, initialX * 0.95, initialX * 0.8, initialX * 0.4, targetX],
        Extrapolate.CLAMP
      ),
      top: interpolate(
        progress.value,
        [0, 0.2, 0.4, 0.6, 1],
        [initialY, initialY * 0.9, initialY * 0.7, initialY * 0.4, targetY],
        Extrapolate.CLAMP
      ),
      // Apply drag offset
      transform: [
        { translateY: translateY.value }
      ],
      width: interpolate(
        progress.value,
        [0, 0.2, 0.5, 0.8, 1],
        [initialWidth, initialWidth * 1.5, SCREEN_WIDTH * 0.6, SCREEN_WIDTH * 0.9, targetWidth],
        Extrapolate.CLAMP
      ),
      height: interpolate(
        progress.value,
        [0, 0.3, 0.6, 0.8, 1],
        [initialHeight, initialHeight * 2, SCREEN_HEIGHT * 0.4, SCREEN_HEIGHT * 0.7, targetHeight],
        Extrapolate.CLAMP
      ),
      borderTopLeftRadius: interpolate(
        progress.value,
        [0, 0.5, 1],
        [layout.radius.lg, layout.radius.lg * 0.8, 20],
        Extrapolate.CLAMP
      ),
      borderTopRightRadius: interpolate(
        progress.value,
        [0, 0.5, 1],
        [layout.radius.lg, layout.radius.lg * 0.8, 20],
        Extrapolate.CLAMP
      ),
      borderBottomLeftRadius: interpolate(
        progress.value,
        [0, 0.5, 0.8, 1],
        [layout.radius.lg, layout.radius.lg * 0.8, 10, 0],
        Extrapolate.CLAMP
      ),
      borderBottomRightRadius: interpolate(
        progress.value,
        [0, 0.5, 0.8, 1],
        [layout.radius.lg, layout.radius.lg * 0.8, 10, 0],
        Extrapolate.CLAMP
      ),
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
  
  // Drag indicator style
  const dragIndicatorStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(
        translateY.value,
        [0, 100],
        [40, 60],
        Extrapolate.CLAMP
      ),
      opacity: contentOpacity.value,
    };
  });

  // Animated style for close button opacity
  const closeButtonOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value
    };
  });

  // Avatar wrapper scale animation
  const avatarWrapperStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: avatarScale.value }
      ]
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
        [0, 0.9, 1],
        [0, 0, 1],
        Extrapolate.CLAMP
      ),
      borderBottomColor: colors.border.primary,
      backgroundColor: colors.background.card.primary,
    };
  });
  
  // Keep player info visible but fading in as the card transition completes
  const playerInfoStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        contentOpacity.value,
        [0, 0.3, 1],
        [0, 0, 1],
        Extrapolate.CLAMP
      ),
    };
  });

  // Only render when we have a player to show
  if (!player) {
    return null;
  }
  
  // Debug logging for development
  if (__DEV__ && isVisible && !itemPosition) {
    console.warn(
      'PlayerStatsOverlay: Item position is missing even though overlay is visible. ' +
      'This might cause animation issues. Make sure the LeaderboardItem is measuring correctly.'
    );
  }
  
  // Prepare shared elements for better animations
  const avatarTransitionTag = `avatar-${player.id}`;
  const nameTransitionTag = `name-${player.id}`;

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
              {/* Enhanced avatar section with card transition */}
              <View style={styles.avatarSection}>
                {/* Properly wrapped ExpandedAvatar for shared element transition */}
                <Animated.View
                  style={[styles.expandedAvatarWrapper, avatarWrapperStyle]}
                >
                  <ExpandedAvatar
                    name={player.name}
                    color={player.color}
                    expanded={true}
                    gamesPlayed={player.gamesPlayed}
                    isGuest={player.isGuest}
                    sharedTransitionTag={avatarTransitionTag}
                    withShadow={true}
                  />
                </Animated.View>

 
              </View>

              {/* Close button - fades in after animation */}

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
    width: 40,
    backgroundColor: 'rgba(120, 120, 120, 0.8)',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  header: {
    width: '100%',
    position: 'relative',
    zIndex: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 11,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    position: 'relative',
    zIndex: 12,
  },
  // Enhanced avatar card styles
  cardPlayerName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  cardPlayerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs / 2,
  },
  miniTag: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: layout.radius.full,
  },
  playerInfo: {
    marginLeft: spacing.md,
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
    zIndex: 14,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    position: 'relative',
    zIndex: 15,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
    position: 'relative',
    zIndex: 16,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: layout.radius.full,
    position: 'relative',
    zIndex: 17,
  },
  closeButtonContainer: {
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  closeButton: {
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    zIndex: 5,
  },
  expandedAvatarWrapper: {
    // This helps with proper shared element animation
    overflow: 'hidden',
    borderRadius: 24, // Match expanded avatar's border radius
    transform: [
      { scale: 1 }  // Starting scale for the animation
    ],
  },
});