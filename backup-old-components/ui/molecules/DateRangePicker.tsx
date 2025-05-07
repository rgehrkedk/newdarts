import { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Dimensions, Platform } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@core/atoms/Text';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/useTheme';
import { Calendar, ChevronDown, X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from '@core/atoms/Button';
import Animated, { FadeIn, SlideInDown, SlideOutDown } from 'react-native-reanimated';

export interface CustomDateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangePickerProps {
  visible: boolean;
  onClose: () => void;
  initialDateRange?: CustomDateRange;
  onApply: (dateRange: CustomDateRange) => void;
}

export function DateRangePicker({ 
  visible, 
  onClose, 
  initialDateRange,
  onApply
}: DateRangePickerProps) {
  const colors = useThemeColors();
  const { isDark } = useTheme();
  const { height: windowHeight } = Dimensions.get('window');
  
  const [tempStartDate, setTempStartDate] = useState<Date>(
    initialDateRange?.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
  );
  const [tempEndDate, setTempEndDate] = useState<Date>(
    initialDateRange?.endDate || new Date() // Today
  );
  
  // State for the drawer UI flow
  const [datePickerMode, setDatePickerMode] = useState<'start' | 'end' | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerView, setPickerView] = useState<'main' | 'datePicker'>('main');

  // Initialize dates when modal becomes visible
  useEffect(() => {
    if (visible && initialDateRange) {
      setTempStartDate(initialDateRange.startDate);
      setTempEndDate(initialDateRange.endDate);
      setPickerView('main');
    }
  }, [visible, initialDateRange]);

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Calculate number of days between two dates
  const getDaysBetween = (startDate: Date, endDate: Date): number => {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffDays = Math.round(Math.abs((startDate.getTime() - endDate.getTime()) / oneDay));
    return diffDays + 1; // Include both start and end days
  };

  // Apply date range and close modal
  const handleApply = () => {
    onApply({
      startDate: tempStartDate,
      endDate: tempEndDate
    });
    onClose();
  };

  // Handle date picker change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      // No need to close picker on Android, just update the date
    }
    
    if (selectedDate) {
      if (datePickerMode === 'start') {
        // Make sure start date isn't after end date
        const newDate = selectedDate > tempEndDate ? tempEndDate : selectedDate;
        setTempStartDate(newDate);
      } else if (datePickerMode === 'end') {
        // Make sure end date isn't before start date
        const newDate = selectedDate < tempStartDate ? tempStartDate : selectedDate;
        setTempEndDate(newDate);
      }
    }
  };

  // Show date picker for start or end date
  const showDatePicker = (mode: 'start' | 'end') => {
    setDatePickerMode(mode);
    setShowPicker(true);
    setPickerView('datePicker');
  };

  // Go back to main view
  const handleBackToMain = () => {
    setPickerView('main');
    setShowPicker(false);
  };

  if (!visible) return null;

  // Determine the current picker title
  const pickerTitle = pickerView === 'main' 
    ? 'Custom Date Range' 
    : datePickerMode === 'start' 
      ? 'Select Start Date' 
      : 'Select End Date';

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity 
          style={styles.backdropTouchable} 
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View 
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={[
            styles.drawerContainer,
            { height: windowHeight * 0.5, backgroundColor: colors.background.primary }
          ]}
        >
          <BlurView
            intensity={80}
            tint={isDark ? 'dark' : 'light'}
            style={styles.drawerBlur}
          >
            {/* Drawer Handle */}
            <View style={styles.drawerHandle}>
              <View style={[styles.handle, { backgroundColor: colors.border.primary }]} />
            </View>
            
            {/* Header with title and back/close buttons */}
            <View style={styles.modalHeader}>
              {pickerView === 'datePicker' ? (
                <TouchableOpacity 
                  onPress={handleBackToMain}
                  style={styles.backButton}
                >
                  <ChevronDown size={20} style={{ transform: [{ rotate: '90deg' }] }} color={colors.text.primary} />
                </TouchableOpacity>
              ) : (
                <View style={styles.placeholderView} />
              )}
              
              <Text size="lg" weight="semibold">{pickerTitle}</Text>
              
              <TouchableOpacity 
                onPress={onClose}
                style={[styles.closeButton, { backgroundColor: `${colors.background.primary}50` }]}
              >
                <X size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            {/* Main Date Range View */}
            {pickerView === 'main' && (
              <>
                <View style={styles.datePickerContainer}>
                  <View style={styles.dateSection}>
                    <Text weight="semibold">Start Date</Text>
                    <TouchableOpacity 
                      style={[styles.datePickerButton, { backgroundColor: colors.background.tertiary }]} 
                      onPress={() => showDatePicker('start')}
                      activeOpacity={0.7}
                    >
                      <View style={styles.dateButtonContent}>
                        <Calendar size={18} color={colors.brand.primary} style={styles.calendarIcon} />
                        <Text>{formatDate(tempStartDate)}</Text>
                      </View>
                      <ChevronDown size={16} color={colors.text.secondary} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.dateSection}>
                    <Text weight="semibold" style={styles.endDateLabel}>End Date</Text>
                    <TouchableOpacity 
                      style={[styles.datePickerButton, { backgroundColor: colors.background.tertiary }]} 
                      onPress={() => showDatePicker('end')}
                      activeOpacity={0.7}
                    >
                      <View style={styles.dateButtonContent}>
                        <Calendar size={18} color={colors.brand.primary} style={styles.calendarIcon} />
                        <Text>{formatDate(tempEndDate)}</Text>
                      </View>
                      <ChevronDown size={16} color={colors.text.secondary} />
                    </TouchableOpacity>
                  </View>

                  {/* Preview date range */}
                  <View style={styles.datePreview}>
                    <Text variant="secondary" size="sm">Range: {getDaysBetween(tempStartDate, tempEndDate)} days</Text>
                  </View>
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    onPress={onClose} 
                    style={[styles.textButton, { backgroundColor: colors.background.primary }]}
                  >
                    <Text color={colors.text.secondary} weight="semibold">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={handleApply} 
                    style={[styles.textButton, { backgroundColor: colors.brand.primary }]}
                  >
                    <Text color="white" weight="semibold">Apply</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
            
            {/* Date Picker View */}
            {pickerView === 'datePicker' && (
              <View style={styles.datePickerPage}>
                <DateTimePicker
                  value={datePickerMode === 'start' ? tempStartDate : tempEndDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                  onChange={handleDateChange}
                  minimumDate={datePickerMode === 'end' ? tempStartDate : undefined}
                  maximumDate={datePickerMode === 'start' ? tempEndDate : new Date()}
                  textColor={colors.text.primary}
                  accentColor={colors.brand.primary}
                  themeVariant={isDark ? "dark" : "light"}
                  style={styles.nativeDatePicker}
                />
                
                <View style={styles.datePickerActions}>
                  <TouchableOpacity 
                    onPress={handleBackToMain} 
                    style={[styles.textButton, { backgroundColor: colors.brand.primary, width: '80%' }]}
                  >
                    <Text color="white" weight="semibold">Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </BlurView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // Align to bottom for the drawer effect
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  drawerContainer: {
    width: '100%',
    borderTopLeftRadius: layout.radius.xl,
    borderTopRightRadius: layout.radius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  drawerBlur: {
    flex: 1,
    paddingTop: 0,
  },
  drawerHandle: {
    width: '100%',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    opacity: 0.5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  placeholderView: {
    width: 36,
    height: 36,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  dateSection: {
    marginBottom: spacing.md,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: layout.radius.md,
    marginTop: spacing.xs,
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarIcon: {
    marginRight: spacing.sm,
  },
  endDateLabel: {
    marginTop: spacing.sm,
  },
  datePreview: {
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.sm,
  },
  button: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  textButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    marginHorizontal: spacing.xs,
    borderRadius: layout.radius.md,
  },
  // Date picker view specific styles
  datePickerPage: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  nativeDatePicker: {
    flex: 1,
    width: '100%',
    marginVertical: spacing.md,
  },
  datePickerActions: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  datePickerWrapper: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.1)',
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : undefined,
  },
  iosButtonContainer: {
    alignItems: 'flex-end',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  iosButton: {
    padding: spacing.sm,
  }
});