import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/ui/atoms/Text';
import { SortCategory } from '@/types/game';
import DropDownPicker from 'react-native-dropdown-picker';
import { ChevronDown, Trophy, Target, Award, Crown, Hash, Percent, Zap, TrendingUp } from 'lucide-react-native';
import { useTheme } from '@/hooks/useTheme';

export interface SortOption {
  value: SortCategory;
  label: string;
  icon: any;
  color?: string;
}

interface SortDropdownProps {
  value: SortCategory;
  onChange: (value: SortCategory) => void;
  label?: string;
}

export function SortDropdown({ value, onChange, label = 'Sort by:' }: SortDropdownProps) {
  const colors = useThemeColors();
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);

  // Sort options for player stats
  const sortOptions: SortOption[] = [
    { value: 'average', label: 'Average', icon: Trophy, color: colors.brand.success },
    { value: 'checkout', label: 'Checkout %', icon: Target, color: colors.brand.primary },
    { value: 'first9', label: 'First 9', icon: TrendingUp, color: colors.brand.success },
    { value: 'winrate', label: 'Win Rate', icon: Percent, color: colors.brand.primary },
    { value: 'games', label: 'Games Played', icon: Hash, color: colors.brand.primary },
    { value: 'highestCheckout', label: 'Highest Checkout', icon: Crown, color: colors.brand.success },
    { value: 'bestLeg', label: 'Best Leg', icon: Award, color: colors.brand.success },
    { value: '180s', label: '180s', icon: Zap, color: colors.avatar?.colors?.orange || colors.brand.primary },
  ];

  // Convert sort options to dropdown items
  const items = sortOptions.map(option => ({
    label: option.label,
    value: option.value,
    icon: () => {
      const IconComponent = option.icon;
      return <IconComponent size={16} color={option.color} />;
    }
  }));

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="secondary" size="sm" style={styles.label}>{label}</Text>
      )}
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={(callback) => {
          if (typeof callback === 'function') {
            const newValue = callback(value);
            if (typeof newValue === 'string') {
              onChange(newValue as SortCategory);
            }
          } else {
            onChange(callback as SortCategory);
          }
        }}
        style={[
          styles.dropdown, 
          { 
            backgroundColor: colors.background.tertiary,
            borderColor: colors.border.primary,
          }
        ]}
        textStyle={{
          color: colors.text.primary,
          fontWeight: '500',
          fontSize: 15,
        }}
        ArrowDownIconComponent={() => (
          <ChevronDown size={16} color={colors.text.secondary} />
        )}
        ArrowUpIconComponent={() => (
          <ChevronDown size={16} color={colors.text.secondary} style={{ transform: [{ rotate: '180deg' }] }} />
        )}
        dropDownContainerStyle={[
          styles.dropdownContainer,
          { 
            backgroundColor: colors.background.tertiary,
            borderColor: colors.border.primary,
          }
        ]}
        listItemContainerStyle={styles.listItemContainer}
        selectedItemContainerStyle={{
          backgroundColor: `${colors.background.secondary}80`,
        }}
        listItemLabelStyle={{
          color: colors.text.primary,
        }}
        selectedItemLabelStyle={{
          color: colors.brand.primary,
          fontWeight: '600',
        }}
        closeIconStyle={{
          width: 30,
          height: 30,
        }}
        searchContainerStyle={{
          borderBottomColor: colors.border.primary,
        }}
        searchTextInputStyle={{
          color: colors.text.primary,
          borderColor: colors.border.primary,
        }}
        itemSeparator={true}
        itemSeparatorStyle={{
          backgroundColor: `${colors.border.primary}50`,
        }}
        showTickIcon={true}
        TickIconComponent={() => (
          <Trophy size={16} color={colors.brand.primary} />
        )}
        maxHeight={300}
        zIndex={1000}
        zIndexInverse={3000}
        closeAfterSelecting={true}
        listMode="SCROLLVIEW"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
  },
  dropdown: {
    borderRadius: layout.radius.md,
    borderWidth: 1,
    minHeight: 45,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderRadius: layout.radius.md,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listItemContainer: {
    paddingVertical: spacing.sm,
  },
});