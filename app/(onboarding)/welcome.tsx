import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/constants/theme/colors';
import { spacing, layout } from '@/constants/theme';
import { Text } from '@core/atoms/Text';
import { Button } from '@core/atoms/Button';
import { router } from 'expo-router';
import { Target, Play } from 'lucide-react-native';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

export default function WelcomeScreen() {
  const colors = useThemeColors();
  
  const handleGameOn = () => {
    // Direct navigation using router.push
    router.push('/(onboarding)/player-name');
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Animated.View 
        entering={FadeIn.delay(300).duration(800)}
        style={styles.logoContainer}
      >
        <Target size={80} color={colors.brand.primary} />
        <Text size="xxl" weight="bold" align="center">
          DartScore
        </Text>
        <Text variant="secondary" align="center" style={styles.subtitle}>
          The ultimate darts scoring experience
        </Text>
      </Animated.View>

      <Animated.View 
        entering={SlideInDown.delay(600).duration(500)}
        style={styles.actionContainer}
      >
        {/* Standard button with direct navigation */}
        <Button
          label="Game On"
          variant="primary"
          icon={Play}
          onPress={handleGameOn}
          style={styles.button}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.container,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  button: {
    width: '100%',
    paddingVertical: spacing.lg,
  },
});