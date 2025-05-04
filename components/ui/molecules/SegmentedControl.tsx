import { View, TouchableOpacity, StyleSheet, LayoutChangeEvent, Platform } from 'react-native';
import { spacing, layout, typography } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '../atoms/Text';
import Animated, { 
  useAnimatedStyle, 
  withSpring, 
  FadeIn,
  useSharedValue,
  withTiming,
  Easing
} from 'react-native-reanimated';
import { useEffect, useState } from 'react';

interface Option<T> {
  label: string;
  value: T;
}

interface SegmentedControlProps<T> {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md' | 'lg';
}

export function SegmentedControl<T>({ 
  options, 
  value,
  onChange,
  size = 'md'
}: SegmentedControlProps<T>) {
  const colors = useThemeColors();
  const [containerWidth, setContainerWidth] = useState(0);
  const [mounted, setMounted] = useState(false);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
    setMounted(true);
  };

  useEffect(() => {
    if (!mounted) return;
    
    const selectedIndex = options.findIndex(option => option.value === value);
    const segmentWidth = containerWidth / options.length;
    const newX = selectedIndex * segmentWidth;

    translateX.value = withSpring(newX, {
      mass: 1,
      damping: 20,
      stiffness: 200,
    });

    scale.value = withTiming(1.05, {
      duration: 100,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    }, () => {
      scale.value = withTiming(1, {
        duration: 100,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    });
  }, [value, mounted, containerWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value }
    ],
  }));

  const getSize = () => {
    switch (size) {
      case 'sm':
        return {
          height: 32,
          fontSize: typography.sizes.sm,
          padding: spacing.xs,
        };
      case 'lg':
        return {
          height: 48,
          fontSize: typography.sizes.lg,
          padding: spacing.md,
        };
      default:
        return {
          height: 42,
          fontSize: typography.sizes.md,
          padding: spacing.sm,
        };
    }
  };

  const sizeStyles = getSize();
  const optionWidth = containerWidth / options.length;

  const platformSpecificStyles = Platform?.select({
    web: {
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 3,
      elevation: 3,
    },
  });

  return (
    <View style={styles.wrapper}>
      <View 
        style={[
          styles.container, 
          { 
            backgroundColor: colors.background.tertiary,
            height: sizeStyles.height,
            padding: spacing.xxs,
          }
        ]}
        onLayout={handleLayout}
      >
        {mounted && (
          <Animated.View
            style={[
              styles.indicator,
              { 
                backgroundColor: colors.brand.primary,
                width: optionWidth - spacing.xs,
                height: sizeStyles.height - spacing.xs,
                borderRadius: layout.radius.lg - spacing.xxs,
              },
              indicatorStyle,
              platformSpecificStyles,
            ]}
          />
        )}
        
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.option,
              { 
                height: sizeStyles.height,
                width: optionWidth,
              }
            ]}
            onPress={() => onChange(option.value)}
          >
            <Animated.View
              entering={FadeIn.delay(index * 100)}
              style={styles.optionContent}
            >
              <Text
                size={size}
                weight={value === option.value ? 'semibold' : 'regular'}
                style={[
                  styles.optionText,
                  { color: value === option.value ? colors.white : colors.text.secondary }
                ]}
                numberOfLines={1}
              >
                {option.label}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  container: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    borderRadius: layout.radius.lg,
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    zIndex: 0,
    left: spacing.xxs,
  },
  option: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  optionContent: {
    paddingHorizontal: spacing.md,
  },
  optionText: {
    textAlign: 'center',
  },
});