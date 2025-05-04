import { View, StyleSheet } from 'react-native';
import { spacing, typography } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from './Text';
import { Video as LucideIcon } from 'lucide-react-native';

interface StatItemProps {
  icon: typeof LucideIcon;
  label: string;
  value: string;
  color?: string;
  bgColor?: string;
  IconOverride?: typeof LucideIcon;
}

export function StatItem({ 
  icon: Icon, 
  label, 
  value, 
  color, 
  bgColor,
  IconOverride 
}: StatItemProps) {
  const colors = useThemeColors();
  const DisplayIcon = IconOverride || Icon;
  
  return (
    <View style={[styles.statItem, { backgroundColor: bgColor || colors.background.tertiary }]}>
      <View style={[styles.iconContainer, { backgroundColor: (color || colors.brand.primary) + '20' }]}>
        <DisplayIcon size={20} color={color || colors.brand.primary} />
      </View>
      <View>
        <Text style={[styles.statValue, { color: colors.text.primary }]}>{value}</Text>
        <Text variant="secondary" size="xs">{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: spacing.lg,
    gap: spacing.sm,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 16,
    fontFamily: typography.families.semiBold,
  },
});