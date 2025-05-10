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
    INITIAL_PAUSE: 100,          // Brief pause before starting
    EXPANSION_DURATION: 1500,    // Very slow expansion to full screen
    CONTENT_START_DELAY: 600,    // When content starts fading in
    CONTENT_FADE_DURATION: 800,  // How long content takes to fade in
  },
  
  // Easing functions
  EASING: {
    EXPANSION: Easing.bezier(0.2, 0.01, 0.15, 1), // Very slow start, then accelerate
    CONTENT: Easing.bezier(0, 0.55, 0.45, 1),     // Ease-in-out for content
  },
  
  // Closing animation
  CLOSE: {
    CONTENT_FADE: 200,          // Fade out content first
    COLLAPSE_DURATION: 450,     // Collapse back to original position
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
  const cardExpansion = useSharedValue(0); // Controls avatar-to-card expansion
  const cardOpacity = useSharedValue(0);   // Controls card content visibility
  
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
      cardExpansion.value = 0;
      cardOpacity.value = 0;
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
      
      // CRITICAL: Explicitly reset ALL animation values to their initial state
      // This ensures we get a fresh animation each time, even with different players
      progress.value = 0;
      contentOpacity.value = 0;
      backdropOpacity.value = 0;
      avatarScale.value = 1;
      cardExpansion.value = 0;
      cardOpacity.value = 0;
      translateY.value = 0;
      
      // Small delay before starting animation
      const startDelay = ANIMATION_CONFIG.PHASES.INITIAL_PAUSE;
      
      // Start backdrop fade immediately
      backdropOpacity.value = withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
      
      // Begin main expansion animation
      progress.value = withDelay(
        startDelay,
        withTiming(1, {
          duration: ANIMATION_CONFIG.PHASES.EXPANSION_DURATION,
          easing: ANIMATION_CONFIG.EASING.EXPANSION,
        })
      );
      
      // Scale avatar slightly for visual effect (with a bounce)
      avatarScale.value = withDelay(
        startDelay + 200,
        withTiming(1.2, {
          duration: 700,
          easing: Easing.bezier(0.34, 1.56, 0.64, 1), // Bouncy effect
        })
      );
      
      // Animate avatar to card expansion
      cardExpansion.value = withDelay(
        startDelay + 300,
        withTiming(1, {
          duration: 800,
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        })
      );
      
      // Fade in card content
      cardOpacity.value = withDelay(
        startDelay + 600,
        withTiming(1, {
          duration: 600,
          easing: Easing.bezier(0, 0, 0.2, 1),
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
      cancelAnimation(cardExpansion);
      cancelAnimation(cardOpacity);
      
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
      
      // Fade out card content
      cardOpacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.bezier(0.4, 0, 1, 1),
      });
      
      // Collapse card back to avatar
      cardExpansion.value = withTiming(0, {
        duration: ANIMATION_CONFIG.CLOSE.COLLAPSE_DURATION - 100,
        easing: Easing.bezier(0.4, 0, 1, 1),
      });
      
      // Scale avatar back to original size
      avatarScale.value = withDelay(
        100,
        withTiming(1, {
          duration: ANIMATION_CONFIG.CLOSE.COLLAPSE_DURATION - 100,
          easing: Easing.bezier(0.4, 0, 1, 1),
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
      
      // Fade out backdrop
      backdropOpacity.value = withTiming(0, {
        duration: ANIMATION_CONFIG.CLOSE.COLLAPSE_DURATION,
        easing: Easing.bezier(0.4, 0, 1, 1),
      });
      
      // Reset drag position
      translateY.value = withTiming(0, { duration: 300 });
    }
  }, [isVisible, player, progress, contentOpacity, backdropOpacity, translateY, 
      avatarScale, cardExpansion, cardOpacity, onClose, onAnimationComplete, isNewPlayer, SCREEN_HEIGHT]);
  
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
    
    // Use intermediate keyframes for more interesting motion
    return {
      position: 'absolute',
      left: interpolate(
        progress.value,
        [0, 0.2, 1],  // Add intermediate keyframe for a more dynamic expansion
        [initialX, initialX * 0.9, targetX],
        Extrapolate.CLAMP
      ),
      top: interpolate(
        progress.value,
        [0, 0.3, 1],
        [initialY, initialY * 0.8, targetY],
        Extrapolate.CLAMP
      ),
      // Apply drag offset
      transform: [
        { translateY: translateY.value }
      ],
      width: interpolate(
        progress.value,
        [0, 0.4, 1],
        [initialWidth, SCREEN_WIDTH * 0.8, targetWidth],
        Extrapolate.CLAMP
      ),
      height: interpolate(
        progress.value,
        [0, 0.5, 1],
        [initialHeight, SCREEN_HEIGHT * 0.5, targetHeight],
        Extrapolate.CLAMP
      ),
      borderTopLeftRadius: interpolate(
        progress.value,
        [0, 1],
        [layout.radius.lg, 20],
        Extrapolate.CLAMP
      ),
      borderTopRightRadius: interpolate(
        progress.value,
        [0, 1],
        [layout.radius.lg, 20],
        Extrapolate.CLAMP
      ),
      borderBottomLeftRadius: interpolate(
        progress.value,
        [0, 0.7, 1],
        [layout.radius.lg, 10, 0],
        Extrapolate.CLAMP
      ),
      borderBottomRightRadius: interpolate(
        progress.value,
        [0, 0.7, 1],
        [layout.radius.lg, 10, 0],
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

  // Avatar card container style - transforms from avatar to card
  const avatarCardContainerStyle = useAnimatedStyle(() => {
    const fullWidth = SCREEN_WIDTH ;
    return {
      width: interpolate(
        cardExpansion.value,
        [0, 1],
        [64, fullWidth], // Expand width to fit player info
        Extrapolate.CLAMP
      ),
      height: interpolate(
        cardExpansion.value,
        [0, 1],
        [48, 80], // Slight height increase
        Extrapolate.CLAMP
      ),
      borderRadius: interpolate(
        cardExpansion.value,
        [0, 1],
        [99, 32], // Transform from circle to rounded rectangle
        Extrapolate.CLAMP
      ),
      position: 'relative',
      overflow: 'hidden',
      marginRight: interpolate(
        cardExpansion.value,
        [0, 1],
        [0, 0],
        Extrapolate.CLAMP
      ),
      transform: [
        { scale: avatarScale.value }
      ],
    };
  });
  
  // Avatar container style - keeps avatar positioned within the expanding card
  const avatarInCardStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      left: 32,
      top: 0,
      
      borderRadius: interpolate(
        cardExpansion.value,
        [0, 1],
        [32, 16], // Match the container's border radius
        Extrapolate.CLAMP
      ),
      overflow: 'hidden',
    };
  });
  
  // Card content style - fades in as the card expands
  const cardContentStyle = useAnimatedStyle(() => {
    return {
      opacity: cardOpacity.value,
      position: 'absolute',
      left: 104, // Position to the right of the avatar
      right: 0,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
    };
  });
  
  // Card background gradient style
  const cardGradientStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      top: 12,
      left: 32,
      right: 64,
      bottom: 12,
      borderRadius: interpolate(
        cardExpansion.value,
        [0, 1],
        [32, 16],
        Extrapolate.CLAMP
      ),
      overflow: 'hidden', // Important: add overflow hidden to make borderRadius work
      opacity: interpolate(
        cardExpansion.value,
        [0, 0.3, 1],
        [0, 0.7, 1],
        Extrapolate.CLAMP
      ),
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
  
  // Calculate gradient colors from player color
  const mainColor = player.color;
  const gradientColor = player.color; // Or use a slightly different shade if you have one
  
  // Get transparency values
  const transparencyMedium = colors.transparency?.medium || '80';
  const transparencyLow = colors.transparency?.low || '30';
  const transparencyVeryLow = colors.transparency?.veryLow || '10';
  
  // Neutral gradient for inner card
  const neutralGradientStart = isDark 
    ? `${colors.background.primary}${colors.transparency?.veryLow || '10'}` 
    : `${colors.background.primary}${colors.transparency?.high || 'CC'}`;
  
  const neutralGradientEnd = isDark 
    ? `${colors.background.tertiary}${colors.transparency?.faint || '05'}` 
    : `${colors.background.tertiary}${colors.transparency?.low || '30'}`;
  
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
              {/* Enhanced avatar section with card transition */}
              <View style={styles.avatarSection}>
                {/* Avatar card container that grows into a player card */}
                <Animated.View 
                  sharedTransitionTag={avatarContainerTag}
                  style={[avatarCardContainerStyle]}
                >
                  {/* Card background with gradient */}
                  <Animated.View style={cardGradientStyle}>
                    <LinearGradient
                      colors={[
                        `${mainColor}${transparencyMedium}`,
                        `${gradientColor}${transparencyVeryLow}`
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={StyleSheet.absoluteFill}
                    />
                  </Animated.View>
                  
                  {/* Avatar positioned inside the card */}
                  <Animated.View style={avatarInCardStyle}>
                    <Avatar
                      name={player.name}
                      color={player.color}
                      size={64}
                      sharedTransitionTag={avatarTransitionTag}
                    />
                  </Animated.View>
                  
                  {/* Card content that appears as the card expands */}
                  <Animated.View style={cardContentStyle}>
                    <Text style={styles.cardPlayerName} numberOfLines={1} weight="semibold">
                      {player.name}
                    </Text>
                    <View style={styles.cardPlayerStats}>
                      <View style={[styles.miniTag, { backgroundColor: player.color+'4D' }]}>
                        <Text variant="primary" size="xxs">
                          {player.isGuest ? 'Guest' : 'You'}
                        </Text>
                      </View>
                      <Text variant="secondary" size="xxs">•</Text>
                      <Text variant="primary" size="xxs">
                        {player.gamesPlayed} {player.gamesPlayed === 1 ? 'Game' : 'Games'}
                      </Text>
                    </View>
                  </Animated.View>
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
});