import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/ui/atoms/Text';
import { SegmentedControl } from '@/components/ui/molecules/SegmentedControl';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/useTheme';
import { Calendar } from 'lucide-react-native';
import { DateRangePicker, CustomDateRange } from './DateRangePicker';

export type DateRange = '1d' | '7d' | '30d' | 'all' | 'custom';

interface DateFilterProps {
  value: DateRange;
  onChange: (value: DateRange) => void;
  customRange?: CustomDateRange;
  onCustomRangeChange?: (range: CustomDateRange) => void;
}

export function DateFilter({
  value,
  onChange,
  customRange,
  onCustomRangeChange
}: DateFilterProps) {
  const colors = useThemeColors();
  const { isDark } = useTheme();
  const [isDateRangePickerVisible, setIsDateRangePickerVisible] = useState(false);

  // Options for the segment control
  const options = [
    { label: '1D', value: '1d' },
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: 'All', value: 'all' },
    { label: 'Custom', value: 'custom' },
  ];

  // Handle value change
  const handleValueChange = (newValue: string) => {
    const typedValue = newValue as DateRange;
    onChange(typedValue);
    
    // If custom is selected, show the custom date picker modal
    if (typedValue === 'custom') {
      setIsDateRangePickerVisible(true);
    }
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Handle custom date range change
  const handleCustomRangeChange = (range: CustomDateRange) => {
    if (onCustomRangeChange) {
      onCustomRangeChange(range);
    }
    // Ensure the value is set to 'custom'
    onChange('custom');
  };

  return (
    <View style={styles.container}>
      <BlurView 
        intensity={55}
        tint={isDark ? 'dark' : 'light'}
        style={styles.blurContainer}
      >
        <View style={styles.labelRow}>

          <Text variant="secondary" size="sm" style={styles.label}>Date Range:</Text>
        </View>
        
        <SegmentedControl
          options={options}
          value={value}
          onChange={handleValueChange}
          variant="neutral"
          size="xs"
        />

        {/* Custom range display when custom is selected */}
        {value === 'custom' && customRange && (
          <View style={styles.customRangeDisplay}>
            <Text variant="secondary" size="sm">
              {formatDate(customRange.startDate)} - {formatDate(customRange.endDate)}
            </Text>
            <TouchableOpacity 
              onPress={() => setIsDateRangePickerVisible(true)}
              style={styles.editButton}
            >
              <Text variant="primary" size="sm">Edit</Text>
            </TouchableOpacity>
          </View>
        )}
      </BlurView>

      {/* Date Range Picker Modal */}
      <DateRangePicker
        visible={isDateRangePickerVisible}
        onClose={() => setIsDateRangePickerVisible(false)}
        initialDateRange={customRange}
        onApply={handleCustomRangeChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  blurContainer: {

  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft:-4,
    marginBottom: spacing.xs,
  },
  label: {
    marginLeft: spacing.xs,
  },
  customRangeDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
  editButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
});