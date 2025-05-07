import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@core/atoms/Text';
import { useThemeColors } from '@/constants/theme/colors';
import { spacing, layout } from '@/constants/theme';
import Animated, { FadeIn } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/useTheme';

interface AvatarProps {
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
   * Size of the avatar (width and height)
   * @default 40
   */
  size?: number;
  
  /**
   * Determines if a gradient should be used
   * @default true
   */
  useGradient?: boolean;
  
  /**
   * Optional shadow for the avatar
   * @default false
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
   * Additional style for the text
   */
  textStyle?: TextStyle;
  
  /**
   * Number of initials to show (1 or 2)
   * @default 1
   */
  initialsCount?: 1 | 2;
  
  /**
   * Optional handler for press events
   */
  onPress?: () => void;
  
  /**
   * Use blur effect under the avatar
   * @default true
   */
  useBlur?: boolean;
  
  /**
   * Inner transparency value
   */
  innerTransparency?: string;
  
  /**
   * Outer transparency value for gradient
   */
  outerTransparency?: string;
  
  /**
   * Optional container background color
   */
  containerBackgroundColor?: string;
  
  /**
   * Animation entering delay in ms
   */
  animationDelay?: number;
}

export function Avatar({
  name,
  color,
  gradientColor,
  size = 40,
  useGradient = true,
  withShadow = true,
  sharedTransitionTag,
  style,
  textStyle,
  initialsCount = 1,
  onPress,

  animationDelay = 0,
}: AvatarProps) {
  const colors = useThemeColors();
  const { isDark } = useTheme();
  
  // No longer need these parameters since we're using direct colors
  
  // Get initials based on initialsCount
  const getInitials = (): string => {
    if (!name) return '';
    
    if (initialsCount === 1) {
      return name.charAt(0).toUpperCase();
    } else {
      // Get first and last initials for names with multiple parts
      const parts = name.split(' ').filter(Boolean);
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      
      return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
    }
  };
  
  // Calculate dynamic styles
  const dynamicStyles = {
    container: {
      width: size,
      height: size,
      borderRadius: size / 2,
      overflow: 'hidden',
      ...(withShadow && {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      }),
    },
    text: {
      fontSize: size * 0.4, // Scale text size based on avatar size
      fontWeight: '600',
      color: colors.white,
    },
  };
  
  // Wrapper component with animation
  const Wrapper = animationDelay > 0 ? 
    ({ children }: { children: React.ReactNode }) => (
      <Animated.View 
        entering={FadeIn.delay(animationDelay).duration(400)}
        style={[dynamicStyles.container, style]}
      >
        {children}
      </Animated.View>
    ) : 
    ({ children }: { children: React.ReactNode }) => (
      <View style={[dynamicStyles.container, style]}>
        {children}
      </View>
    );
  
  // We'll handle the onPress directly in the component render
    
  // Text component based on shared transition
  const TextElement = ({ children }: { children: React.ReactNode }) => {
    if (sharedTransitionTag) {
      return (
        <Animated.Text 
          sharedTransitionTag={`avatar-text-${sharedTransitionTag}`}
          style={[dynamicStyles.text, textStyle]}
        >
          {children}
        </Animated.Text>
      );
    }
    return (
      <Text 
        weight="semibold"
        style={[dynamicStyles.text, textStyle]}
      >
        {children}
      </Text>
    );
  };
  
  // Gradient version (default)
  if (useGradient) {
    // Check for known color pattern or use fallback
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
    
    // Custom gradient colors for inner wrapper with transparency
    const neutralGradientStart = isDark 
      ? `${colors.background.primary}${colors.transparency.veryLow}` // Dark theme start
      : `${colors.background.primary}${colors.transparency.high}`; // Light theme start
    const neutralGradientEnd = isDark 
      ? `${colors.background.tertiary}${colors.transparency.faint}` // Dark theme end
      : `${colors.background.tertiary}${colors.transparency.low}`; // Light theme end
    
    const Container = onPress ? Pressable : View;
    const containerProps = onPress ? {
      onPress,
      style: ({ pressed }) => [styles.pressable, pressed && styles.pressed],
      android_ripple: { color: 'rgba(0,0,0,0.1)', borderless: true }
    } : { style: styles.pressable };
    
    return (
      <Wrapper>
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
            <View style={styles.innerWrapper}>
              {/* Inner gradient with neutral colors */}
              <BlurView
                intensity={isDark ? 25 : 20}
                tint={isDark ? 'dark' : 'light'}
                style={styles.blurEffect}
              >
                <LinearGradient
                  colors={[neutralGradientStart, neutralGradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.avatarContent,
                    { 
                      backgroundColor: isDark 
                        ? `rgba(255, 255, 255, 0.08)` 
                        : `rgba(0, 0, 0, 0.03)`
                    }
                  ]}
                >
                  <TextElement>{getInitials()}</TextElement>
                </LinearGradient>
              </BlurView>
            </View>
          </LinearGradient>
        </Container>
      </Wrapper>
    );
  }
  
  // Simple colored circle (fallback)
  // Use the same neutral gradient colors for consistency with transparency
  const neutralGradientStart = isDark 
    ? `${colors.background.primary}${colors.transparency.low}` // Dark theme start
    : `${colors.background.primary}${colors.transparency.high}`; // Light theme start
  const neutralGradientEnd = isDark 
    ? `${colors.background.primary}${colors.transparency.low}` // Dark theme end
    : `${colors.background.tertiary}${colors.transparency.low}`; // Light theme end
  
  const Container = onPress ? Pressable : View;
  const containerProps = onPress ? {
    onPress,
    style: ({ pressed }) => [styles.pressable, pressed && styles.pressed],
    android_ripple: { color: 'rgba(0,0,0,0.1)', borderless: true }
  } : { style: styles.pressable };
  
  return (
    <Wrapper>
      <Container {...containerProps}>
        {/* Single colored background */}
        <View 
          style={[
            styles.gradientContainer, 
            { backgroundColor: `${color}${colors.transparency.high}` }
          ]}
        >
          <View style={styles.innerWrapper}>
            {/* Inner gradient with neutral colors */}
            <BlurView
              intensity={isDark ? 25 : 20}
              tint={isDark ? 'dark' : 'light'}
              style={styles.blurEffect}
            >
              <LinearGradient
                colors={[neutralGradientStart, neutralGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.avatarContent,
                  { 
                    backgroundColor: isDark 
                      ? `rgba(255, 255, 255, 0.08)` 
                      : `rgba(0, 0, 0, 0.03)`
                  }
                ]}
              >
                <TextElement>{getInitials()}</TextElement>
              </LinearGradient>
            </BlurView>
          </View>
        </View>
      </Container>
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 999, // Large value to ensure it's always rounded
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerWrapper: {
    width: '94%',
    height: '94%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  blurEffect: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  avatarContent: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Subtle overlay for better gradient appearance
    overflow: 'hidden',
  },
  pressable: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.8,
  },
});