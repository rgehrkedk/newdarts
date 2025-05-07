import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { spacing, layout, typography } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

export default function CheckoutModal() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colors = useThemeColors();
  
  const score = params.score ? parseInt(params.score as string) : 0;
  const isCheckout = params.isCheckout === 'true';
  
  // Generate checkout options - 1, 2, 3 darts for checkout, 0, 1, 2, 3 for failed attempts
  const options = isCheckout ? [1, 2, 3] : [0, 1, 2, 3];
  
  const handleSelect = (attempts: number) => {
    // We'll pass this back to the caller using URL params
    router.back({
      params: {
        dartCount: attempts.toString(),
        wasSuccessful: isCheckout.toString()
      }
    });
  };

  return (
    <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
      <Animated.View 
        entering={SlideInUp.springify().damping(15)}
        style={[styles.content, { backgroundColor: colors.background.secondary }]}
      >
        <Text style={[styles.title, { color: colors.text.primary }]}>
          {isCheckout ? 'Checkout Completed!' : 'Checkout Attempt'}
        </Text>
        
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          {isCheckout 
            ? `You scored ${score}! How many darts did you use to checkout?`
            : `You scored ${score}. How many darts did you attempt at a double?`}
        </Text>
        
        <View style={styles.options}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.option, { backgroundColor: colors.background.tertiary }]}
              onPress={() => handleSelect(option)}
            >
              <Text style={[styles.optionText, { color: colors.text.primary }]}>
                {option} {option === 1 ? 'dart' : 'darts'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.container,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: layout.radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.families.semiBold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.families.regular,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  options: {
    width: '100%',
    gap: spacing.sm,
  },
  option: {
    padding: spacing.lg,
    borderRadius: layout.radius.lg,
    alignItems: 'center',
  },
  optionText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.families.semiBold,
  },
});