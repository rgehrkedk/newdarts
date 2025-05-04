import { TouchableOpacity, Text, StyleSheet, ViewStyle, ActivityIndicator } from 'react-native';
import { spacing, layout, typography } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Video as LucideIcon } from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'error';

interface ButtonProps {
  onPress: () => void;
  label: string;
  variant?: ButtonVariant;
  icon?: LucideIcon;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export function Button({ 
  onPress, 
  label, 
  variant = 'primary',
  icon: Icon,
  disabled = false,
  loading = false,
  style
}: ButtonProps) {
  const colors = useThemeColors();

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
        return colors.background.button.ghost;
      default:
        return colors.background.button.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.text.secondary;
    switch (variant) {
      case 'error':
      case 'primary':
        return colors.text.onPrimary;
      case 'ghost':
        return colors.text.onGhost;
      case 'secondary':
        return colors.text.onSecondary;
      default:
        return colors.text.onPrimary;
    }
  };

  return (
    <Animated.View entering={FadeIn}>
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          styles.button,
          { backgroundColor: getBackgroundColor() },
          variant === 'ghost' && styles.ghostButton,
          style
        ]}
      >
        {loading ? (
          <ActivityIndicator color={getTextColor()} />
        ) : (
          <>
            {Icon && <Icon size={20} color={getTextColor()} />}
            <Text style={[styles.label, { color: getTextColor() }]}>{label}</Text>
          </>
        )}
      </TouchableOpacity>
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
  label: {
    fontSize: typography.sizes.md,
    fontFamily: typography.families.semiBold,
  },
});