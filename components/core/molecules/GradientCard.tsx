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
  pressable?: boolean; // Whether the card is pressable
  variant?: 'primary' | 'secondary' | 'avatar' | 'neutral'; // Card color variant
  avatarColor?: string; // Optional avatar color (used when variant is 'avatar')
  avatarGradientColor?: string; // Optional avatar gradient color (used when variant is 'avatar')
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
  borderRadius?: number; // Custom border radius for the card
  innerMargin?: number; // Margin between outer and inner card (default: spacing.xxs)
  contentPadding?: number | { horizontal?: number; vertical?: number }; // Custom padding for the content
}

export function GradientCard({
  title,
  description,
  gradientColors,
  overlayColor,
  onPress = () => {}, // Default no-op function
  pressable = true, // Default to pressable
  variant = 'primary', // Default to primary variant
  avatarColor,
  avatarGradientColor,
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
  borderRadius,
  innerMargin,
  contentPadding,
}: GradientCardProps) {
  const themeColors = useThemeColors();
  
  // Get default values from the theme
  innerTransparency = innerTransparency || themeColors.transparency.high; // Default 70% opacity
  outerTransparency = outerTransparency || themeColors.transparency.low; // Default 100% opacity

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

  // Get gradient colors based on variant
  const getVariantColors = () => {
    if (gradientColors) return gradientColors;

    switch (variant) {
      case 'primary':
        return [themeColors.brand.primary, themeColors.brand.primaryGradient];
      case 'secondary':
        return [themeColors.brand.secondary, themeColors.brand.secondaryGradient];
      case 'avatar':
        if (avatarColor && avatarGradientColor) {
          return [avatarColor, avatarGradientColor];
        }
        // Default avatar colors if none provided
        return [themeColors.avatar.colors.purple, themeColors.avatar.colors.purpleGradient];
      case 'neutral':
        return [themeColors.background.primary, themeColors.background.primary];
      default:
        return [themeColors.brand.primary, themeColors.brand.primaryGradient];
    }
  };
  
  // Calculate content padding
  const getContentPadding = () => {
    if (!contentPadding) {
      return { padding: spacing.md }; // Default padding
    }

    if (typeof contentPadding === 'number') {
      return { padding: contentPadding };
    }

    const { horizontal, vertical } = contentPadding;
    return {
      paddingHorizontal: horizontal !== undefined ? horizontal : spacing.md,
      paddingVertical: vertical !== undefined ? vertical : spacing.md,
    };
  };

  // Content component to keep the card content consistent between versions
  const DefaultContent = () => (
    <View style={[
      styles.content,
      getContentPadding(),
      { justifyContent: contentAlignment }
    ]}>
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
    <View style={[
      styles.content,
      getContentPadding(),
      { justifyContent: contentAlignment }
    ]}>
      {children}
    </View>
  ) : (
    <DefaultContent />
  );

  // Get appropriate background color for clean version based on variant
  const getCleanBackground = () => {
    if (backgroundColor) return backgroundColor;

    switch (variant) {
      case 'primary':
        return themeColors.background.card.primary;
      case 'secondary':
        return themeColors.background.card.primary;
      case 'avatar':
        return themeColors.background.card.primary;
      case 'neutral':
        return themeColors.background.primary;
      default:
        return themeColors.background.card.primary;
    }
  };

  // Calculate border radius values
  const cardBorderRadius = borderRadius || layout.radius.xl;
  const cardInnerMargin = innerMargin !== undefined ? innerMargin : spacing.xxs;
  const innerBorderRadius = Math.max(0, cardBorderRadius - cardInnerMargin);

  // Return the clean version if specified
  if (clean) {
    return (
      <Animated.View
        entering={FadeInDown.delay(animationDelay).duration(600)}
        style={[
          styles.cardWrapper,
          { borderRadius: cardBorderRadius },
          style
        ]}
      >
        {pressable ? (
          <Pressable
            style={[
              styles.card,
              styles.cleanCard,
              {
                backgroundColor: getCleanBackground(),
                height: height,
                borderRadius: cardBorderRadius,
              }
            ]}
            onPress={onPress}
            android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
          >
            {ContentToDisplay}
          </Pressable>
        ) : (
          <View
            style={[
              styles.card,
              styles.cleanCard,
              {
                backgroundColor: getCleanBackground(),
                height: height,
                borderRadius: cardBorderRadius,
              }
            ]}
          >
            {ContentToDisplay}
          </View>
        )}
      </Animated.View>
    );
  }

  // Return the gradient version (default)
  return (
    <Animated.View
      entering={FadeInDown.delay(animationDelay).duration(600)}
      style={[
        styles.cardWrapper,
        { borderRadius: cardBorderRadius },
        style
      ]}
    >
      <LinearGradient
        colors={getVariantColors().map(color => applyTransparency(color, outerTransparency))}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradientContainer,
          { borderRadius: cardBorderRadius }
        ]}
      >
        {pressable ? (
          <Pressable
            style={[
              styles.card,
              {
                backgroundColor: innerBackgroundColor ||
                  (themeColors.background.secondary + innerTransparency), // Use provided transparency
                height: height,
                margin: cardInnerMargin,
                borderRadius: innerBorderRadius
              }
            ]}
            onPress={onPress}
            android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
          >
            <View
              style={[
                styles.overlay,
                {
                  backgroundColor: overlayColor || themeColors.background.primary,
                  borderRadius: innerBorderRadius
                }
              ]}
            />
            {ContentToDisplay}
          </Pressable>
        ) : (
          <View
            style={[
              styles.card,
              {
                backgroundColor: innerBackgroundColor ||
                  (themeColors.background.primary + innerTransparency), // Use provided transparency
                height: height,
                margin: cardInnerMargin,
                borderRadius: innerBorderRadius
              }
            ]}
          >
            <View
              style={[
                styles.overlay,
                {
                  backgroundColor: overlayColor || themeColors.background.overlay,
                  borderRadius: innerBorderRadius
                }
              ]}
            />
            {ContentToDisplay}
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    overflow: 'hidden',
  },
  gradientContainer: {
    overflow: 'hidden', // Ensure gradient stays within border radius
  },
  card: {
    overflow: 'hidden',
    backdropFilter: 'blur(99px)',
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
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    // Padding is now applied dynamically through getContentPadding()
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