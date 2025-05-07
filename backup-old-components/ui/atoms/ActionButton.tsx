import { TouchableOpacity, StyleSheet } from 'react-native';
import { spacing, layout, typography } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Video as LucideIcon } from 'lucide-react-native';
import { Text } from './Text';
import Animated, { SlideInRight } from 'react-native-reanimated';

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  delay?: number;
}

export function ActionButton({
  icon: Icon,
  label,
  onPress,
  variant = 'primary',
  delay = 0
}: ActionButtonProps) {
  const colors = useThemeColors();

  return (
    <Animated.View
      entering={SlideInRight.delay(delay)}
      style={[
        styles.container,
        {
          backgroundColor: variant === 'primary' ? colors.brand.primary : colors.background.secondary,
        }
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        style={styles.content}
      >
        <Icon size={24} color={variant === 'primary' ? colors.white : colors.brand.primary} />
        <Text
          style={[
            styles.label,
            { color: variant === 'primary' ? colors.white : colors.text.primary }
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: layout.radius.xl,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
  label: {
    fontSize: typography.sizes.md,
    fontFamily: typography.families.semiBold,
  },
});