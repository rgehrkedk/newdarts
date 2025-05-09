import React from 'react';
import { View, StyleSheet, Pressable, ViewStyle } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@core/atoms/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { LucideIcon } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';


interface GradientCardProps {
  title?: string;
  description?: string;
  gradientColors?: string[];
  overlayColor?: string;
  onPress?: () => void;
  animationDelay?: number; // Delay in ms for the animation
  icon?: LucideIcon; // Optional icon
  iconSize?: number; // Optional icon size
  style?: ViewStyle; // Optional additional style
  clean?: boolean; // Option for clean version without gradient and overlay
  backgroundColor?: string; // Background color for clean version
  height?: number; // Custom height for the card
  contentAlignment?: 'flex-start' | 'center' | 'flex-end'; // Alignment of the content within the card
  children?: React.ReactNode; // Optional children to render instead of default content
  innerBackgroundColor?: string; // Background color for the inner card with transparency
  innerTransparency?: string; // Hexadecimal transparency value (00-FF) for inner card (see colors.transparency)
  outerTransparency?: string; // Hexadecimal transparency value (00-FF) for gradient colors (see colors.transparency)
}

export function GradientCard({
  title,
  description,
  gradientColors,
  overlayColor,
  onPress = () => {}, // Default no-op function
  animationDelay = 0,
  icon: Icon,
  iconSize = 24,
  style,
  clean = false,
  backgroundColor,
  height = 200, // Default height of 200
  contentAlignment = 'flex-end', // Default to bottom alignment like the original
  children,
  innerBackgroundColor,
  innerTransparency,
  outerTransparency,
}: GradientCardProps) {
  const themeColors = useThemeColors();
  
  // Get default values from the theme
  innerTransparency = innerTransparency || themeColors.transparency.mediumLow; // Default 70% opacity
  outerTransparency = outerTransparency || themeColors.transparency.full; // Default 100% opacity
  
  // Helper function to apply transparency to a color
  const applyTransparency = (color: string, transparency: string): string => {
    // Check if color already has transparency
    if (color.length === 9 || color.length === 5) {
      // Replace last two characters with new transparency
      return color.substring(0, color.length - 2) + transparency;
    } else if (color.length === 7 || color.length === 4) {
      // Append transparency to color
      return color + transparency;
    }
    // Return original color if format is unknown
    return color;
  };
  
  // Content component to keep the card content consistent between versions
  const DefaultContent = () => (
    <View style={[styles.content, { justifyContent: contentAlignment }]}>
      {Icon && (
        <View 
          style={[
            styles.iconContainer, 
            { backgroundColor: themeColors.background.card.secondary }
          ]}
        >
          <Icon size={iconSize} color={themeColors.text.primary} />
        </View>
      )}
      {title && (
        <Text size="xl" weight="semibold" style={styles.cardTitle}>
          {title}
        </Text>
      )}
      {description && (
        <Text variant="primary" weight="light" style={styles.description}>
          {description}
        </Text>
      )}
    </View>
  );
  
  // Content to display - either children or default content
  const ContentToDisplay = children ? (
    <View style={[styles.content, { justifyContent: contentAlignment }]}>
      {children}
    </View>
  ) : (
    <DefaultContent />
  );

  // Return the clean version if specified
  if (clean) {
    return (
      <Animated.View
        entering={FadeInDown.delay(animationDelay).duration(600)}
        style={[styles.cardWrapper, style]}
      >
        <Pressable
          style={[
            styles.card,
            styles.cleanCard,
            { 
              backgroundColor: backgroundColor || themeColors.background.card.primary,
              height: height 
            }
          ]}
          onPress={onPress}
          android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
        >
          {ContentToDisplay}
        </Pressable>
      </Animated.View>
    );
  }

  // Return the gradient version (default)
  return (
    <Animated.View
      entering={FadeInDown.delay(animationDelay).duration(600)}
      style={[styles.cardWrapper, style]}
    >
      <LinearGradient
        colors={
          gradientColors 
            ? gradientColors.map(color => applyTransparency(color, outerTransparency))
            : [
                applyTransparency(themeColors.brand.primary, outerTransparency), 
                applyTransparency(themeColors.brand.primaryGradient, outerTransparency)
              ]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <Pressable
          style={[
            styles.card,
            { 
              backgroundColor: innerBackgroundColor || 
                (themeColors.background.primary + innerTransparency), // Use provided transparency
              height: height 
            }
          ]}
          onPress={onPress}
          android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
        >
          <View 
            style={[
              styles.overlay, 
              { backgroundColor: overlayColor || themeColors.background.overlay }
            ]} 
          />
          {ContentToDisplay}
        </Pressable>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: layout.radius.xl,
    overflow: 'hidden',
  },
  gradientContainer: {
    borderRadius: layout.radius.xl,
    overflow: 'hidden', // Ensure gradient stays within border radius
  },
  card: {
    margin: spacing.xxs,
    borderRadius: layout.radius.xl - spacing.xxs, // Adjust to align with outer wrapper
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
  },
  // Clean version styles
  cleanCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    margin: 0, // No margin needed for clean version
    borderWidth: 0,
    borderRadius: layout.radius.xl, // Ensure consistent border radius with wrapper
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: layout.radius.xl - spacing.xxs, // Match inner card border radius
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    // justifyContent now comes from props
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    marginBottom: spacing.xs,
  },
  description: {
  },
});