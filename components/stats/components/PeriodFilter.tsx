import { View, StyleSheet } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/ui/atoms/Text';
import { SegmentedControl } from '@/components/ui/molecules/SegmentedControl';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/useTheme';

export type Period = '7d' | '30d' | 'all';

interface PeriodFilterProps {
  value: Period;
  onChange: (value: Period) => void;
  isSticky?: boolean; // Flag to indicate if the filter is in sticky mode (scrolled)
}

export function PeriodFilter({ value, onChange, isSticky = false }: PeriodFilterProps) {
  const colors = useThemeColors();
  const { isDark } = useTheme();
  
  // Options for the segment control
  const options = [
    { label: '7 Days', value: '7d' },
    { label: '30 Days', value: '30d' },
    { label: 'All Time', value: 'all' },
  ];
  
  // For sticky mode, use more compact labels to save space
  const compactOptions = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: 'All', value: 'all' },
  ];

  return (
    <View style={[
      styles.container,
      isSticky && styles.stickyContainer
    ]}>
      <BlurView 
        intensity={isSticky ? 60 : 55}
        tint={isDark ? 'dark' : 'light'}

      >
        {/* Only show the label when not in sticky mode */}
        {!isSticky && (
          <Text variant="secondary" size="sm" style={styles.label}>Time Period:</Text>
        )}
        
        <View style={isSticky ? styles.fixedWidthContainer : null}>
          <SegmentedControl
            options={isSticky ? compactOptions : options}
            value={value}
            onChange={(value) => onChange(value as Period)}
            variant={isSticky ? "neutral" : "primary"} // Use primary variant in default state
            size={isSticky ? "sm" : "md"}
          />
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  stickyContainer: {
  },
  blurContainer: {
    borderRadius: layout.radius.lg,
    padding: spacing.xl,
    overflow: 'hidden',
    
    // Add subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  stickyBlurContainer: {
    padding: spacing.xs, // Minimal padding for sticky mode
    paddingHorizontal: spacing.sm, // Reduced horizontal padding
    borderRadius: layout.radius.md, // Slightly smaller radius for sticky mode
    shadowOpacity: 0.05, // Lighter shadow in sticky mode
    elevation: 1,
  },
  label: {
    marginBottom: spacing.xs,
    marginLeft: spacing.xs,
  },
  // Fixed width container for the segmented control when in sticky mode
  fixedWidthContainer: {
    width: 160, // Fixed width for the compact mode
    alignSelf: 'flex-end', // Align to the right in the container
  },
});