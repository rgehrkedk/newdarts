import { TouchableOpacity, StyleSheet } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Video as LucideIcon } from 'lucide-react-native';

interface IconButtonProps {
  onPress: () => void;
  icon: LucideIcon;
  variant?: 'primary' | 'secondary' | 'transparent' | 'error';
  size?: number;
  disabled?: boolean;
  style?: any;
}

export function IconButton({ 
  onPress, 
  icon: Icon, 
  variant = 'primary',
  size = 20,
  disabled = false,
  style
}: IconButtonProps) {
  const colors = useThemeColors();

  const getBackgroundColor = () => {
    if (disabled) return colors.background.tertiary;
    switch (variant) {
      case 'primary':
        return colors.brand.primary;
      case 'secondary':
        return colors.background.secondary;
      case 'transparent':
        return 'transparent';
      case 'error':
        return colors.brand.error;
      default:
        return colors.brand.primary;
    }
  };

  const getIconColor = () => {
    if (disabled) return colors.text.secondary;
    switch (variant) {
      case 'primary':
      case 'error':
        return colors.white;
      case 'secondary':
      case 'transparent':
        return colors.text.primary;
      default:
        return colors.white;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        style
      ]}
    >
      <Icon size={size} color={getIconColor()} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: layout.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});