import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@core/atoms/Text';
import { useThemeColors } from '@/constants/theme/colors';
import { spacing, layout } from '@/constants/theme';
import Animated, { SharedTransition, withTiming } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/useTheme';

// Define custom slow and fluid shared transition
const customTransition = SharedTransition.custom((values) => {
  'worklet';
  return {
    width: withTiming(values.targetWidth, { duration: 1500 }),
    height: withTiming(values.targetHeight, { duration: 1500 }),
    originX: withTiming(values.targetOriginX, { duration: 1500 }),
    originY: withTiming(values.targetOriginY, { duration: 1500 }),
    borderRadius: withTiming(values.targetBorderRadius, { duration: 1500 }),
  };
});

interface ExpandedAvatarProps {
  /**
   * Name or text to use for initials
   */
  name: string;
  
  /**
   * Primary color for the avatar
   */
  color: string;
  
  /**
   * Optional gradient color for enhanced appearance
   */
  gradientColor?: string;
  
  /**
   * Optional shadow for the avatar
   * @default true
   */
  withShadow?: boolean;
  
  /**
   * Shared transition tag for animations
   */
  sharedTransitionTag?: string;
  
  /**
   * Additional style for the container
   */
  style?: ViewStyle;
  
  /**
   * Whether this is expanded variant
   * @default false
   */
  expanded?: boolean;
  
  /**
   * Number of games played by the player
   */
  gamesPlayed?: number;
  
  /**
   * Whether the player is a guest
   */
  isGuest?: boolean;
  
  /**
   * Use blur effect under the avatar
   * @default true
   */
  useBlur?: boolean;
  
  /**
   * Blur intensity for the inner wrapper
   * @default 30 for dark theme, 25 for light theme
   */
  blurIntensity?: number;
  
  /**
   * Optional handler for press events
   */
  onPress?: () => void;
}

/**
 * ExpandedAvatar component - A variant of Avatar that can expand into a card with player info
 * Uses the exact same inner/outer gradient structure as the Avatar component
 */
export function ExpandedAvatar({
  name,
  color,
  gradientColor,
  withShadow = true,
  sharedTransitionTag,
  style,
  expanded = false,
  gamesPlayed = 0,
  isGuest = false,
  useBlur = true,
  blurIntensity,
  onPress,
}: ExpandedAvatarProps) {
  const colors = useThemeColors();
  const { isDark } = useTheme();
  
  // Skip rendering if not in expanded mode
  if (!expanded) return null;
  
  // Set default blur intensity based on theme if not provided
  const defaultBlurIntensity = isDark ? 30 : 25;
  const effectiveBlurIntensity = blurIntensity !== undefined ? blurIntensity : defaultBlurIntensity;
  
  // Check for known color pattern or use fallback - identical to Avatar component
  let defaultGradientColor;
  if (gradientColor) {
    defaultGradientColor = gradientColor;
  } else if (color === colors.brand.primary) {
    defaultGradientColor = colors.brand.primaryGradient;
  } else if (color === colors.brand.secondary) {
    defaultGradientColor = colors.brand.secondaryGradient;
  } else if (color === colors.avatar.green) {
    defaultGradientColor = colors.avatar.greenGradient;
  } else if (color === colors.avatar.blue) {
    defaultGradientColor = colors.avatar.blueGradient;
  } else if (color === colors.avatar.purple) {
    defaultGradientColor = colors.avatar.purpleGradient;
  } else if (color === colors.avatar.pink) {
    defaultGradientColor = colors.avatar.pinkGradient;
  } else if (color === colors.avatar.orange) {
    defaultGradientColor = colors.avatar.orangeGradient;
  } else if (color === colors.avatar.red) {
    defaultGradientColor = colors.avatar.redGradient;
  } else if (color === colors.avatar.yellow) {
    defaultGradientColor = colors.avatar.yellowGradient;
  } else if (color === colors.avatar.teal) {
    defaultGradientColor = colors.avatar.tealGradient;
  } else {
    defaultGradientColor = color;
  }
  
  // Custom gradient colors for inner wrapper with transparency - identical to Avatar component
  const neutralGradientStart = isDark 
    ? `${colors.background.primary}${colors.transparency.medium}` // Dark theme start
    : `${colors.background.primary}${colors.transparency.high}`; // Light theme start
  const neutralGradientEnd = isDark 
    ? `${colors.background.tertiary}${colors.transparency.medium}` // Dark theme end
    : `${colors.background.tertiary}${colors.transparency.low}`; // Light theme end
  
  // Container for pressable handling
  const Container = onPress ? Pressable : View;
  const containerProps = onPress ? {
    onPress,
    style: ({ pressed }) => [styles.pressable, pressed && styles.pressed],
    android_ripple: { color: 'rgba(0,0,0,0.1)', borderless: true }
  } : { style: styles.pressable };
  
  // Main inner content
  const content = (
    <Container {...containerProps}>
      {/* Outer gradient with avatar color */}
      <LinearGradient
        colors={[
          `${color}${colors.transparency.medium}`,
          `${defaultGradientColor}${colors.transparency.veryLow}`
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <View style={styles.innerContentWrapper}>
          {/* Enhanced blur effect in inner wrapper */}
          {useBlur ? (
            <BlurView
              intensity={effectiveBlurIntensity}
              tint={isDark ? 'dark' : 'light'}
              style={styles.blurEffect}
            >
              <LinearGradient
                colors={[neutralGradientStart, neutralGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.innerContent,
                  { 
                    backgroundColor: isDark 
                      ? `rgba(255, 255, 255, 0.1)` 
                      : `rgba(0, 0, 0, 0.05)`
                  }
                ]}
              >
                {/* Player info content */}
                <View style={styles.playerInfoContainer}>
                  <Animated.Text 
                    sharedTransitionTag={sharedTransitionTag ? `name-${sharedTransitionTag}` : undefined}
                    sharedTransitionStyle={customTransition}
                    style={styles.playerName}
                  >
                    {name}
                  </Animated.Text>
                  
                  <View style={styles.playerMeta}>
                    <View style={[styles.playerTag, { backgroundColor: `${color}30` }]}>
                      <Text variant="primary" size="xs" style={{ color: colors.white }}>
                        {isGuest ? 'Guest player' : 'You'}
                      </Text>
                    </View>
                    
                    <Text size="xs" style={styles.gamesText}>
                      {gamesPlayed} {gamesPlayed === 1 ? 'game' : 'games'}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </BlurView>
          ) : (
            <View style={styles.nonBlurWrapper}>
              <LinearGradient
                colors={[neutralGradientStart, neutralGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.innerContent,
                  { 
                    backgroundColor: isDark 
                      ? `rgba(255, 255, 255, 0.1)` 
                      : `rgba(0, 0, 0, 0.05)`
                  }
                ]}
              >
                {/* Player info content */}
                <View style={styles.playerInfoContainer}>
                  <Animated.Text 
                    sharedTransitionTag={sharedTransitionTag ? `name-${sharedTransitionTag}` : undefined}
                    sharedTransitionStyle={customTransition}
                    style={styles.playerName}
                  >
                    {name}
                  </Animated.Text>
                  
                  <View style={styles.playerMeta}>
                    <View style={[styles.playerTag, { backgroundColor: `${color}30` }]}>
                      <Text variant="primary" size="xs" style={{ color: colors.white }}>
                        {isGuest ? 'Guest player' : 'You'}
                      </Text>
                    </View>
                    
                    <Text size="xs" style={styles.gamesText}>
                      {gamesPlayed} {gamesPlayed === 1 ? 'game' : 'games'}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          )}
        </View>
      </LinearGradient>
    </Container>
  );
  
  // Container style with shadows
  const containerStyle = [
    styles.container,
    withShadow && {
      shadowColor: colors.black,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    style
  ];
  
  // Apply shared transition if needed
  if (sharedTransitionTag) {
    return (
      <Animated.View
        sharedTransitionTag={`avatar-${sharedTransitionTag}`}
        style={containerStyle}
        sharedTransitionStyle={customTransition}
      >
        {content}
      </Animated.View>
    );
  }
  
  return (
    <View style={containerStyle}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    borderRadius: 24,
    overflow: 'hidden',
  },
  pressable: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.8,
  },
  gradientContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContentWrapper: {
    width: '97%',
    height: '90%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  blurEffect: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  nonBlurWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  innerContent: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    padding: spacing.md,
  },
  // Player info styling
  playerInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  playerName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  playerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  playerTag: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: layout.radius.full,
  },
  gamesText: {
    color: '#FFFFFF',
  },
});