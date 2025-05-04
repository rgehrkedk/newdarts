import { Text as RNText, StyleSheet } from 'react-native';
import { spacing, typography } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import Animated, { FadeIn } from 'react-native-reanimated';

type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';
type TextWeight = 'regular' | 'semibold';
type TextVariant = 'primary' | 'secondary' | 'success' | 'error' | 'brand';
type TextAlign = 'left' | 'center' | 'right';

interface TextProps {
  children: React.ReactNode;
  size?: TextSize;
  weight?: TextWeight;
  variant?: TextVariant;
  align?: TextAlign;
  animated?: boolean;
  numberOfLines?: number;
  truncate?: boolean; // New prop for truncation
  style?: any;
}

export function Text({ 
  children,
  size = 'md',
  weight = 'regular',
  variant = 'primary',
  align = 'left',
  animated = false,
  numberOfLines,
  truncate = false, // Default to false
  style,
}: TextProps) {
  const colors = useThemeColors();

  const getFontSize = () => {
    switch (size) {
      case 'xxs': return typography.sizes.xxs;
      case 'xs': return typography.sizes.xs;
      case 'sm': return typography.sizes.sm;
      case 'lg': return typography.sizes.lg;
      case 'xl': return typography.sizes.xl;
      case 'xxl': return typography.sizes.xxl;
      case 'xxxl': return typography.sizes.xxxl;
      default: return typography.sizes.md;
    }
  };

  const getFontFamily = () => {
    switch (weight) {
      case 'semibold': return typography.families.semiBold;
      default: return typography.families.regular;
    }
  };

  const getColor = () => {
    switch (variant) {
      case 'secondary': return colors.text.secondary;
      case 'success': return colors.brand.success;
      case 'error': return colors.brand.error;
      case 'brand': return colors.brand.primary;
      default: return colors.text.primary;
    }
  };

  const TextComponent = animated ? Animated.Text : RNText;
  const animationProps = animated ? { entering: FadeIn } : {};

  return (
    <TextComponent
      {...animationProps}
      style={[
        {
          color: getColor(),
          fontSize: getFontSize(),
          fontFamily: getFontFamily(),
          textAlign: align,
        },
        style
      ]}
      numberOfLines={truncate ? 1 : numberOfLines}
      ellipsizeMode={truncate ? 'tail' : undefined}
    >
      {children}
    </TextComponent>
  );
}

// Preset variants for common text styles
export function Heading1(props: Omit<TextProps, 'size' | 'weight'>) {
  return <Text {...props} size="xxxl" weight="semibold" />;
}

export function Heading2(props: Omit<TextProps, 'size' | 'weight'>) {
  return <Text {...props} size="xxl" weight="semibold" />;
}

export function Heading3(props: Omit<TextProps, 'size' | 'weight'>) {
  return <Text {...props} size="xl" weight="semibold" />;
}

export function Heading4(props: Omit<TextProps, 'size' | 'weight'>) {
  return <Text {...props} size="lg" weight="semibold" />;
}

export function Subtitle1(props: Omit<TextProps, 'size' | 'variant'>) {
  return <Text {...props} size="lg" variant="secondary" />;
}

export function Subtitle2(props: Omit<TextProps, 'size' | 'variant'>) {
  return <Text {...props} size="md" variant="secondary" />;
}

export function Body1(props: Omit<TextProps, 'size'>) {
  return <Text {...props} size="md" />;
}

export function Body2(props: Omit<TextProps, 'size'>) {
  return <Text {...props} size="sm" />;
}

export function Caption(props: Omit<TextProps, 'size' | 'variant'>) {
  return <Text {...props} size="xs" variant="secondary" />;
}
