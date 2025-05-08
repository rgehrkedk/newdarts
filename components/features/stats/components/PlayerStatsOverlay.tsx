/**
 * PlayerStatsOverlay
 * 
 * An animated overlay that expands from a source element to a full-screen modal.
 * 
 * IMPORTANT USAGE NOTES:
 * 1. This component MUST be placed at the root level of the page, outside of any ScrollView
 * 2. Proper structure is:
 *    <View style={{flex: 1}}>
 *      <ScrollView>
 *        Your content here
 *      </ScrollView>
 *      <PlayerStatsOverlay />
 *    </View>
 * 
 * 3. The component requires itemPosition data from the source element
 * 4. Make sure your list items use the ref and measure callback properly
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

// Animation configuration - can be adjusted to control animation speed and feel
const ANIMATION_CONFIG = {
  // Opening animation (expansion)
  OPEN_ANIMATION: {
    STIFFNESS: 120,       // Controls speed (lower = slower animation)
    DAMPING: 25,          // Controls bounce (higher = less bounce) 
    MASS: 0.8,            // Controls inertia (higher = slower movement)
    DURATION: 4000,  // Optional direct control of duration in ms (e.g. 800)
  },
  
  // Content fade-in
  CONTENT_FADE: {
    DURATION: 300,        // How long content takes to fade in
    DELAY: 200,           // When content starts fading in
  },
  
  // Closing animation
  CLOSE_ANIMATION: {
    DURATION: 450,        // How long closing animation takes
  }
};

interface PlayerStatsOverlayProps {
  player: SavedPlayer | null;
  isVisible: boolean;
  onClose: () => void;
  onAnimationComplete?: () => void; // New callback for animation completion
  itemPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  onOptionsPress?: () => void;
  // Optional animation config override
  animationConfig?: typeof ANIMATION_CONFIG;
}

export function PlayerStatsOverlay({
  player,
  isVisible,
  onClose,
  onAnimationComplete,
  itemPosition,
  onOptionsPress,
  animationConfig = ANIMATION_CONFIG, // Use default config if not provided
}: PlayerStatsOverlayProps) {
  const colors = useThemeColors();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Animation values
  const progress = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  
  // Gesture values
  const translateY = useSharedValue(0);
  const gestureActive = useSharedValue(false);
  
  // Define threshold for dismissal (percentage of screen height)
  const DISMISS_THRESHOLD = 0.2; // 20% of screen height
  
  // Simple gesture handler for dragging the overlay
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      // Only allow dragging downward
      translateY.value = Math.max(0, ctx.startY + event.translationY);
      
      // Adjust content opacity as user drags
      const dragRatio = translateY.value / (SCREEN_HEIGHT * 0.15);
      contentOpacity.value = Math.max(0.3, 1 - (dragRatio * 0.5));
    },
    onEnd: (event) => {
      if (translateY.value > SCREEN_HEIGHT * 0.15 || event.velocityY > 500) {
        // Dismiss if dragged far enough
        translateY.value = withTiming(SCREEN_HEIGHT, {
          duration: 300,
        }, () => {
          'worklet';
          runOnJS(onClose)();
        });
        
        contentOpacity.value = withTiming(0, { duration: 200 });
      } else {
        // Return to original position
        translateY.value = withTiming(0, { duration: 200 });
        contentOpacity.value = withTiming(1, { duration: 200 });
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
    const hasValidPosition = itemPosition && 
                           itemPosition.x !== undefined && 
                           itemPosition.y !== undefined;
    
    if (isVisible) {
      // Reset any gesture state if opening
      translateY.value = 0;
      
      // Opening animation: Use spring physics for configurable feel
      progress.value = withSpring(1, {
        damping: animationConfig.OPEN_ANIMATION.DAMPING,
        stiffness: animationConfig.OPEN_ANIMATION.STIFFNESS,
        mass: animationConfig.OPEN_ANIMATION.MASS,
        duration: animationConfig.OPEN_ANIMATION.DURATION, // Optional
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      });
      
      // Fade in content after the card has started expanding
      contentOpacity.value = withTiming(1, {
        duration: animationConfig.CONTENT_FADE.DURATION,
        easing: Easing.ease,
        delay: animationConfig.CONTENT_FADE.DELAY,
      });
    } else {
      // Only run closing animation if not already being dragged away
      if (!gestureActive.value) {
        // For closing, we want to quickly hide content first
        contentOpacity.value = withTiming(0, { 
          duration: 180,
          easing: Easing.out(Easing.quad),
        });
        
        // Then smoothly animate back to the source position
        // Use timing for more predictable closing animation
        progress.value = withTiming(0, {
          duration: animationConfig.CLOSE_ANIMATION.DURATION,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }, (finished) => {
          'worklet';
          if (finished && onAnimationComplete) {
            // Call the animation completion callback instead of onClose
            // onClose is already called to trigger this animation
            runOnJS(onAnimationComplete)();
          }
        });
      }
    }
  }, [isVisible, progress, contentOpacity, translateY, gestureActive, itemPosition, onClose, onAnimationComplete]);
  
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
    // Use different interpolation for opening vs closing
    const opacityValue = isVisible 
      ? interpolate(
          progress.value,
          [0, 0.5, 1],     // Accelerate during opening
          [0, 0.8, 1],
          Extrapolate.CLAMP
        )
      : interpolate(
          progress.value,
          [0, 0.3, 1],     // Quick fade out during closing
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

  // Modal container style with simpler implementation
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
      ) + translateY.value, // Add drag offset
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
      // Rounded corners at the top
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      // Simple shadow
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
  
  // Simpler drag indicator style
  const dragIndicatorStyle = useAnimatedStyle(() => {
    // Stretch the indicator slightly as user drags
    const width = 40 + (translateY.value * 0.2);
    
    return {
      width: width > 40 ? width : 40,
      opacity: 0.9,
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
        [spacing.md, spacing.sm + spacing.sm], // Respect safe area top inset
        Extrapolate.CLAMP
      ),
      paddingBottom: interpolate(
        progress.value,
        [0, 1],
        [spacing.md, spacing.lg],
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
                style={[
                  styles.closeButtonContainer,
                  { opacity: contentOpacity.value } // Tie to content opacity for better UX
                ]}
              >
                <IconButton
                  icon={X}
                  onPress={() => {
                    // Using the same method as TouchableOpacity in background overlay
                    // This should trigger the isVisible=false animation sequence
                    onClose();
                  }}
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
    marginTop: 15,
    marginBottom: 10,
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