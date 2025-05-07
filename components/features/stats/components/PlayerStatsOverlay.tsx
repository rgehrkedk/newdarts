import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions, BackHandler, StatusBar, Platform } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Avatar } from '@/components/core/atoms/Avatar';
import { Text } from '@/components/core/atoms/Text';
import { SavedPlayer } from '@/types/game';
import { ChevronLeft, X } from 'lucide-react-native';
import { IconButton } from '@/components/core/atoms/IconButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import { PlayerStatsContent } from '../PlayerStats';

interface PlayerStatsOverlayProps {
  player: SavedPlayer | null;
  isVisible: boolean;
  onClose: () => void;
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
  itemPosition,
  onOptionsPress,
}: PlayerStatsOverlayProps) {
  const colors = useThemeColors();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Animation values
  const progress = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

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

  useEffect(() => {
    if (isVisible) {
      // Opening animation sequence
      progress.value = withTiming(1, {
        duration: 1000,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      contentOpacity.value = withTiming(1, {
        duration: 400,
        delay: 200, // Delay content appearance
      });
    } else {
      // Closing animation sequence
      contentOpacity.value = withTiming(0, { duration: 200 });
      progress.value = withTiming(0, {
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [isVisible, progress, contentOpacity]);
  
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
      opacity: interpolate(
        progress.value,
        [0, 1],
        [0, 1],
        Extrapolate.CLAMP
      ),
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

  // Modal container style (for the card that animates from leaderboard item to full screen)
  const modalStyle = useAnimatedStyle(() => {
    if (!itemPosition || !player) return {};

    // Starting position (from the source element)
    const initialX = itemPosition.x;
    const initialY = itemPosition.y;
    const initialWidth = itemPosition.width;
    const initialHeight = itemPosition.height;

    // Target position (full screen)
    const targetX = 0;
    const targetY = 0;
    const targetWidth = SCREEN_WIDTH;
    const targetHeight = SCREEN_HEIGHT;

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
      borderRadius: interpolate(
        progress.value,
        [0, 1],
        [layout.radius.lg, 0], // No border radius when full screen
        Extrapolate.CLAMP
      ),
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
        [spacing.md, insets.top + spacing.md], // Respect safe area top inset
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

  if (!player) return null;

  return (
    <>
      {/* Background overlay */}
      <Animated.View style={overlayStyle}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />
      </Animated.View>

      {/* Modal container */}
      <Animated.View style={modalStyle}>
        {/* Header (always visible during animation) */}
        <Animated.View style={[styles.header, headerStyle]}>
          <View style={styles.headerContent}>
            {/* This part transitions from LeaderboardItem */}
            <View style={styles.avatarSection}>
              <Avatar
                name={player.name}
                color={player.color}
                size={64}
                sharedTransitionTag={player.id}
              />

              <View style={styles.playerInfo}>
                <Animated.Text
                  style={[styles.name, { color: colors.text.primary }]}
                  sharedTransitionTag={`name-${player.id}`}
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

            {/* Close button - always visible */}
            <Animated.View style={styles.closeButtonContainer}>
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
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
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