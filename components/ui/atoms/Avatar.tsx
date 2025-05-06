import React from 'react';
import { View, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from './Text';
import { useThemeColors } from '@/constants/theme/colors';
import { spacing } from '@/constants/theme';
import Animated from 'react-native-reanimated';

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
   * @default false
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
}

export function Avatar({
  name,
  color,
  gradientColor,
  size = 40,
  useGradient = false,
  withShadow = false,
  sharedTransitionTag,
  style,
  textStyle,
  initialsCount = 1,
}: AvatarProps) {
  const colors = useThemeColors();
  
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
      ...(withShadow && {
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
      }),
    },
    text: {
      fontSize: size * 0.4, // Scale text size based on avatar size
      fontWeight: '600',
      color: colors.white,
    },
  };
  
  // If no shared transition tag, use regular component
  // Otherwise use Animated.View for transitions
  const Container = sharedTransitionTag ? Animated.View : View;
  const TextComponent = sharedTransitionTag ? Animated.Text : Text;
  
  const containerProps = sharedTransitionTag 
    ? { sharedTransitionTag: `avatar-${sharedTransitionTag}` } 
    : {};
    
  const textProps = sharedTransitionTag 
    ? { 
        sharedTransitionTag: `avatar-text-${sharedTransitionTag}`,
        style: [dynamicStyles.text, textStyle]
      } 
    : { 
        style: [dynamicStyles.text, textStyle]
      };
  
  // Use gradient if specified
  if (useGradient) {
    return (
      <Container
        style={[dynamicStyles.container, style]}
        {...containerProps}
      >
        <LinearGradient
          colors={[color, gradientColor || color]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.textContainer}>
            {sharedTransitionTag ? (
              <TextComponent {...textProps}>
                {getInitials()}
              </TextComponent>
            ) : (
              <Text {...textProps}>
                {getInitials()}
              </Text>
            )}
          </View>
        </LinearGradient>
      </Container>
    );
  }
  
  // Simple colored circle
  return (
    <Container
      style={[dynamicStyles.container, { backgroundColor: color }, style]}
      {...containerProps}
    >
      <View style={styles.textContainer}>
        {sharedTransitionTag ? (
          <TextComponent {...textProps}>
            {getInitials()}
          </TextComponent>
        ) : (
          <Text {...textProps}>
            {getInitials()}
          </Text>
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  gradient: {
    width: '100%',
    height: '100%',
    borderRadius: 999, // Large value to ensure it's always rounded
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});