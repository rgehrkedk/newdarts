import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { spacing, layout, typography } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import Animated, { FadeIn } from 'react-native-reanimated';

interface CheckoutModalProps {
  visible: boolean;
  options: number[];
  onSelect: (attempts: number) => void;
  isCheckout: boolean;
  score: number;
}

export function CheckoutModal({ visible, options, onSelect, isCheckout, score }: CheckoutModalProps) {
  const colors = useThemeColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <Animated.View 
          entering={FadeIn}
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
                onPress={() => onSelect(option)}
              >
                <Text style={[styles.optionText, { color: colors.text.primary }]}>
                  {option} {option === 1 ? 'dart' : 'darts'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    </Modal>
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