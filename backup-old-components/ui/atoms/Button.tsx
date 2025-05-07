import { TouchableOpacity, StyleSheet, ViewStyle, ActivityIndicator, View, Pressable } from 'react-native';
import { spacing, layout, typography } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Video as LucideIcon } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/useTheme';
import { Text } from './Text';

/**
 * Button component with various styling variants
 * 
 * Standard variants:
 * - primary: Solid button with primary brand color
 * - secondary: Solid button with secondary color
 * - ghost: Transparent button with no background
 * - error: Solid button with error color
 * 
 * Gradient border variants:
 * - gradient-border-primary: Gradient border using primary brand colors (default)
 * - gradient-border-secondary: Gradient border using secondary brand colors
 * - gradient-border-mix: Gradient border mixing primary and secondary colors
 * - gradient-border: Alias for gradient-border-primary (for backward compatibility)
 */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'error' | 'gradient-border' | 'gradient-border-primary' | 'gradient-border-secondary' | 'gradient-border-mix';

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: ButtonVariant;
  icon?: LucideIcon;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  outerGradientColors?: string[];
  innerGradientColors?: string[];
  android_ripple?: {
    color?: string;
    borderless?: boolean;
    foreground?: boolean;
    radius?: number;
  };
}

export function Button({ 
  onPress, 
  label, 
  variant = 'primary',
  icon: Icon,
  disabled = false,
  loading = false,
  style,
  outerGradientColors,
  innerGradientColors,
  android_ripple
}: ButtonProps) {
  // Remap 'gradient-border' to 'gradient-border-primary' for backward compatibility
  if (variant === 'gradient-border') {
    variant = 'gradient-border-primary';
  }
  const colors = useThemeColors();
  const { isDark } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.background.tertiary;
    switch (variant) {
      case 'error':
        return colors.brand.error;
      case 'primary':
        return colors.background.button.primary;
      case 'secondary':
        return colors.background.button.secondary;
      case 'ghost':
      case 'gradient-border-primary':
      case 'gradient-border-secondary':
      case 'gradient-border-mix':
        return 'transparent';
      default:
        return colors.background.button.primary;
    }
  };

  const getTextVariant = (): 'primary' | 'secondary' | 'success' | 'error' | 'brand' => {
    if (disabled) return 'secondary';
    
    switch (variant) {
      case 'error':
        return 'error';
      case 'primary':
        return 'primary'; // For primary we'll handle with style overrides
      case 'secondary':
        return 'primary'; // For secondary we'll handle with style overrides
      case 'ghost':
        return 'secondary';
      case 'gradient-border-primary':
        return 'primary'; // We'll style with overrides to match primary button
      case 'gradient-border-secondary':
        return 'primary';
      case 'gradient-border-mix':
        return 'primary';
      default:
        return 'primary';
    }
  };
  
  // Keep for color icons
  const getTextColor = () => {
    if (disabled) return colors.text.secondary;
    switch (variant) {
      case 'error':
      case 'primary':
      case 'gradient-border-primary':
        return colors.text.onPrimary;
      case 'ghost':
        return colors.text.onGhost;
      case 'secondary':
        return colors.text.onSecondary;
      case 'gradient-border-secondary':
      case 'gradient-border-mix':
        return colors.text.primary;
      default:
        return colors.text.onPrimary;
    }
  };

  // Render gradient border button
  if (variant === 'gradient-border-primary' || 
      variant === 'gradient-border-secondary' || 
      variant === 'gradient-border-mix') {
    
    // Default gradient colors based on variant
    let borderGradientColors;
    if (outerGradientColors) {
      borderGradientColors = outerGradientColors;
    } else {
      switch (variant) {
        case 'gradient-border-primary':
          borderGradientColors = [
            `${colors.brand.primary}80`, // 80% opacity
            `${colors.brand.primaryGradient}80` // 80% opacity
          ];
          break;
        case 'gradient-border-secondary':
          borderGradientColors = [
            `${colors.brand.secondary}80`, // 80% opacity
            `${colors.brand.secondaryGradient}80` // 80% opacity
          ];
          break;
        case 'gradient-border-mix':
        default:
          borderGradientColors = [
            `${colors.brand.secondary}80`, // 80% opacity
            `${colors.brand.primaryGradient}80` // 80% opacity
          ];
          break;
      }
    }
    
    const innerGradientBackgroundColors = innerGradientColors || [
      `${isDark ? colors.background.primary : colors.background.primary}80`, // 50% opacity 
      `${isDark ? colors.background.primary : colors.background.primary}80` // 70% opacity
    ];

    return (
      <Animated.View entering={FadeIn}>
        <LinearGradient
          colors={borderGradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientContainer, style]}
        >
          <View style={styles.blurContainer}>
            <LinearGradient
              colors={innerGradientBackgroundColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.innerGradient}
            >
              <BlurView 
                tint={isDark ? 'dark' : 'light'} 
                intensity={isDark ? 55  : 55}
                style={styles.blurEffect}
              >
                <Pressable
                  onPress={onPress}
                  disabled={disabled || loading}
                  style={styles.gradientButton}
                  android_ripple={android_ripple || { color: 'rgba(0,0,0,0.05)', borderless: false }}
                >
                  {loading ? (
                    <ActivityIndicator color={getTextColor()} />
                  ) : (
                    <>
                      {Icon && <Icon size={20} color={getTextColor()} />}
                      <Text 
              size="md" 
              weight="semibold" 
              variant={getTextVariant()} 
              style={
                (variant === 'primary' || variant === 'error' || variant === 'gradient-border-primary') ? 
                { color: colors.text.onPrimary } : 
                variant === 'secondary' ? 
                { color: colors.text.onSecondary } : 
                undefined
              }
            >
              {label}
            </Text>
                    </>
                  )}
                </Pressable>
              </BlurView>
            </LinearGradient>
          </View>
        </LinearGradient>
      </Animated.View>
    );
  }

  // Render standard button
  return (
    <Animated.View entering={FadeIn}>
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          styles.button,
          { backgroundColor: getBackgroundColor() },
          variant === 'ghost' && styles.ghostButton,
          style
        ]}
        android_ripple={android_ripple || { color: 'rgba(0,0,0,0.05)', borderless: false }}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} />
        ) : (
          <>
            {Icon && <Icon size={20} color={getTextColor()} />}
            <Text 
              size="md" 
              weight="semibold" 
              variant={getTextVariant()} 
              style={
                (variant === 'primary' || variant === 'error' || variant === 'gradient-border-primary') ? 
                { color: colors.text.onPrimary } : 
                variant === 'secondary' ? 
                { color: colors.text.onSecondary } : 
                undefined
              }
            >
              {label}
            </Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: layout.radius.lg,
    gap: spacing.sm,
  },
  ghostButton: {
    padding: spacing.md,
  },
  gradientContainer: {
    borderRadius: layout.radius.lg,
    overflow: 'hidden',
  },
  blurContainer: {
    margin: 2, // This creates the border effect (space between outer and inner container)
    borderRadius: layout.radius.lg - 2,
    overflow: 'hidden',
  },
  innerGradient: {
    flex: 1,
    borderRadius: layout.radius.lg - 2,
    overflow: 'hidden',
  },
  blurEffect: {
    flex: 1,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
});