import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/constants/theme/colors';
import { spacing, layout } from '@/constants/theme';
import { Text } from '@core/atoms/Text';
import { router } from 'expo-router';
import { CheckCircle, ArrowRight } from 'lucide-react-native';
import Animated, { FadeIn, SlideInUp, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/hooks/useTheme';
import { BlurView } from 'expo-blur';

export default function WelcomeCompleteScreen() {
  const colors = useThemeColors();
  const { isDark } = useTheme();
  const lottieRef = useRef<LottieView>(null);
  const scale = useSharedValue(1);
  const { playerName, completeOnboarding } = useOnboardingStore();
  
  // Animation for the success icon
  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.1, { duration: 1000 }),
      -1,
      true
    );
    
    // Start the dartboard animation
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }]
    };
  });
  
  const handleGetStarted = () => {
    // Mark onboarding as complete
    completeOnboarding();
    // Navigate to main app
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.content}>
        <Animated.View 
          entering={FadeIn.delay(300).duration(800)}
          style={styles.animationContainer}
        >
          <Animated.View style={animatedStyle}>
            <CheckCircle size={80} color={colors.brand.success} />
          </Animated.View>
        </Animated.View>

        <Animated.View 
          entering={SlideInUp.delay(500).duration(500)}
          style={styles.messageContainer}
        >
          <Text size="xxl" weight="bold" align="center">
            Welcome, {playerName || 'Player'}!
          </Text>
          <Text variant="secondary" align="center" style={styles.subtitle}>
            You're all set! Time to hit the bullseye and track your dart game like a pro.
          </Text>
        </Animated.View>

        <Animated.View 
          entering={FadeIn.delay(1000)}
          style={styles.actionContainer}
        >
          {/* Custom gradient border button implementation */}
          <TouchableOpacity onPress={handleGetStarted} activeOpacity={0.8}>
            <LinearGradient
              colors={[
                `${colors.brand.primary}80`,
                `${colors.brand.primaryGradient}80`
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientContainer}
            >
              <View style={styles.blurContainer}>
                <LinearGradient
                  colors={[
                    `${isDark ? colors.background.primary : colors.background.primary}80`,
                    `${isDark ? colors.background.primary : colors.background.primary}80`
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.innerGradient}
                >
                  <BlurView
                    tint={isDark ? 'dark' : 'light'}
                    intensity={isDark ? 55 : 55}
                    style={styles.blurEffect}
                  >
                    <View style={styles.gradientButton}>
                      <Text size="md" weight="semibold" style={{ color: colors.text.primary }}>
                        Get Started
                      </Text>
                      <ArrowRight size={20} color={colors.text.primary} />
                    </View>
                  </BlurView>
                </LinearGradient>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: spacing.container,
    paddingTop: spacing.xxl * 2,
    paddingBottom: spacing.xxl,
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xxl,
  },
  lottieAnimation: {
    width: 200,
    height: 200,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
  },
  subtitle: {
    marginTop: spacing.sm,
    maxWidth: '80%',
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  // Gradient button styles
  gradientContainer: {
    width: '100%',
    borderRadius: layout.radius.lg,
    overflow: 'hidden',
  },
  blurContainer: {
    margin: 2,
    borderRadius: layout.radius.lg - 2,
    overflow: 'hidden',
  },
  innerGradient: {
    flex: 1,
    borderRadius: layout.radius.lg - 2,
    overflow: 'hidden',
  },
  blurEffect: {
    flex: 1,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
});