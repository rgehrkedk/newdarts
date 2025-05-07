import { TouchableOpacity, StyleSheet } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { ChevronRight } from 'lucide-react-native';
import { Text } from './Text';
import { Video as LucideIcon } from 'lucide-react-native';

interface ChipButtonProps {
  onPress: () => void;
  label?: string;
  icon?: LucideIcon;
}

export function ChipButton({ 
  onPress, 
  label = "See All",
  icon: Icon = ChevronRight 
}: ChipButtonProps) {
  const colors = useThemeColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container]}
    >
      <Text size="xs" variant="secondary">{label}</Text>
      <Icon size={16} color={colors.text.secondary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
    paddingRight: spacing.sm,
    borderRadius: layout.radius.lg,
    gap: spacing.xxs,
  },
});