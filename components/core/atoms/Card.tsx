import { View, StyleSheet, ViewStyle } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Video as LucideIcon } from 'lucide-react-native';
import { Heading4, Subtitle2 } from './Text';
import Animated, { FadeIn } from 'react-native-reanimated';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'primary' | 'secondary';
  animated?: boolean;
  heading?: string;
  subtitle?: string;
  icon?: LucideIcon;
  showIcon?: boolean;
}

export function Card({ 
  children, 
  style,
  variant = 'primary',
  animated = true,
  heading,
  subtitle,
  icon: Icon,
  showIcon = false,
}: CardProps) {
  const colors = useThemeColors();

  const Container = animated ? Animated.View : View;
  const animationProps = animated ? { entering: FadeIn } : {};

  return (
    <Container
      {...animationProps}
      style={[
        styles.container,
        { backgroundColor: colors.background.card[variant] },
        style
      ]}
    >
      {(heading || subtitle) && (
        <View style={styles.header}>
          <View style={styles.titleRow}>
            {showIcon && Icon && (
              <View style={[styles.iconContainer, { backgroundColor: colors.background.iconWrapper }]}>
                <Icon size={24} color={colors.brand.primary} />
              </View>
            )}
            {heading && <Heading4>{heading}</Heading4>}
          </View>
          {subtitle && (
            <View style={styles.subtitleContainer}>
              <Subtitle2>{subtitle}</Subtitle2>
            </View>
          )}
        </View>
      )}
      {children}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: layout.radius.xl,
    padding: spacing.xl,
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: layout.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitleContainer: {
    paddingLeft: 0, 
  },
});