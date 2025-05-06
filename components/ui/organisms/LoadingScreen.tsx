import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withSpring, interpolate, Extrapolate } from 'react-native-reanimated';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '../atoms/Text';
import { spacing, layout } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useLoadingScreen } from '@/hooks/useLoadingScreen';
import { Target, ThumbsUp } from 'lucide-react-native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

interface LoadingScreenProps {
  onFinish?: () => void;
  message?: string;
}

export function LoadingScreen({ onFinish, message = 'Loading...' }: LoadingScreenProps) {
  const colors = useThemeColors();
  const { isDark } = useTheme();
  const lottieRef = useRef<LottieView>(null);
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);
  const [lottieError, setLottieError] = useState(false);
  const { isLoading } = useLoadingScreen();
  
  // Don't render anything if not loading
  if (!isLoading) {
    return null;
  }

  // Animation for the dartboard pulsing effect
  const dartboardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(
            progress.value, 
            [0, 0.5, 1], 
            [1, 1.05, 1],
            Extrapolate.CLAMP
          )
        }
      ],
    };
  });

  // Animation for the dart flying effect
  const dartStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          translateX: interpolate(
            progress.value, 
            [0, 0.4, 0.6, 1], 
            [width * 0.5, 0, 0, 0],
            Extrapolate.CLAMP
          ) 
        },
        { 
          translateY: interpolate(
            progress.value, 
            [0, 0.4, 0.6, 1], 
            [height * 0.3, 0, 0, 0],
            Extrapolate.CLAMP
          ) 
        },
        { 
          rotate: `${interpolate(
            progress.value, 
            [0, 0.4, 0.6, 1], 
            [45, 0, 0, 0],
            Extrapolate.CLAMP
          )}deg` 
        },
        { 
          scale: interpolate(
            progress.value, 
            [0, 0.4, 0.6, 1], 
            [0.7, 1.1, 1, 1],
            Extrapolate.CLAMP
          ) 
        }
      ],
    };
  });

  useEffect(() => {
    if (lottieRef.current) {
      // Play the Lottie animation
      lottieRef.current.play();
      
      // Start the custom animations
      progress.value = withSpring(1, { damping: 12, stiffness: 80 });
      
      // Set a timeout to trigger the onFinish callback
      const timer = setTimeout(() => {
        // Begin the exit animation
        scale.value = withSpring(1.2, { damping: 15, stiffness: 100 });
        
        // Call the onFinish callback after the exit animation
        setTimeout(() => {
          onFinish?.();
        }, 500);
      }, 2500); // Adjust timing as needed
      
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Animated.View 
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(500)}
    >
      <LinearGradient
        colors={[
          colors.brand.primary,
          colors.brand.secondary,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Animation - either Lottie or fallback */}
          {!lottieError ? (
            <>
              {/* Dartboard animation */}
              <Animated.View style={[styles.dartboardContainer, dartboardStyle]}>
                <LottieView
                  ref={lottieRef}
                  source={require('@/assets/animations/dartboard-animation.json')}
                  style={styles.lottie}
                  autoPlay
                  loop={false}
                  resizeMode="contain"
                  onError={() => setLottieError(true)}
                />
              </Animated.View>
              
              {/* Dart animation */}
              <Animated.View style={[styles.dartAnimation, dartStyle]}>
                <LottieView
                  source={require('@/assets/animations/dart-throw.json')}
                  style={styles.dartLottie}
                  autoPlay
                  loop={false}
                  resizeMode="contain"
                />
              </Animated.View>
            </>
          ) : (
            // Fallback animation with icons
            <Animated.View style={[styles.fallbackContainer, dartboardStyle]}>
              <Target 
                size={100} 
                color={colors.brand.primary} 
                style={styles.targetIcon} 
              />
              <ActivityIndicator 
                size="large" 
                color={colors.brand.secondary} 
                style={styles.fallbackLoader} 
              />
            </Animated.View>
          )}
          
          {/* App name */}
          <Animated.View 
            style={styles.textContainer}
            entering={FadeIn.delay(500).duration(500)}
          >
            <Text size="2xl" weight="bold" style={{ color: colors.white, textAlign: 'center' }}>
              NewDarts
            </Text>
            <Text size="md" weight="regular" style={{ color: colors.white, textAlign: 'center', marginTop: spacing.sm }}>
              {message}
            </Text>
          </Animated.View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 9999,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dartboardContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  dartAnimation: {
    position: 'absolute',
    width: 100,
    height: 100,
  },
  dartLottie: {
    width: '100%',
    height: '100%',
  },
  fallbackContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  targetIcon: {
    position: 'absolute',
  },
  fallbackLoader: {
    position: 'absolute',
  },
  textContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
});