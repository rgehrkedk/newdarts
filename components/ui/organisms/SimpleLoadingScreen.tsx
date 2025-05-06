import { useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withRepeat, withTiming, withDelay } from 'react-native-reanimated';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '../atoms/Text';
import { spacing, layout } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useLoadingScreen } from '@/hooks/useLoadingScreen';
import { Target } from 'lucide-react-native';

// Get screen dimensions
const { width, height } = Dimensions.get('window');

interface SimpleLoadingScreenProps {
  onFinish?: () => void;
  message?: string;
}

export function SimpleLoadingScreen({ onFinish, message = 'Loading...' }: SimpleLoadingScreenProps) {
  const colors = useThemeColors();
  const { isDark } = useTheme();
  const { isLoading } = useLoadingScreen();
  
  // Animation values
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);
  
  // Set up animations
  useEffect(() => {
    if (!isLoading) return;
    
    // Start rotating animation for target
    rotation.value = withRepeat(withTiming(360, { duration: 2000 }), -1);
    
    // Start pulsing animation
    scale.value = withRepeat(
      withTiming(1.2, { duration: 1000 }, () => {
        scale.value = withTiming(1, { duration: 1000 });
      }),
      -1,
      true
    );
    
    // Set a timeout to trigger the onFinish callback
    const timer = setTimeout(() => {
      onFinish?.();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isLoading, onFinish, rotation, scale]);
  
  // Don't render anything if not loading - MOVED AFTER all hooks
  if (!isLoading) {
    return null;
  }
  
  // Create animated styles - this is a hook, so it needs to come before any conditional returns
  const targetStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value }
      ]
    };
  });
  
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
          {/* Target icon with animations */}
          <Animated.View style={[styles.iconContainer, targetStyle]}>
            <Target size={100} color={isDark ? colors.white : colors.white} />
          </Animated.View>
          
          {/* Loading indicator */}
          <ActivityIndicator 
            size="large" 
            color={isDark ? colors.white : colors.white} 
            style={styles.loadingIndicator}
          />
          
          {/* App name and message */}
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
  iconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    marginTop: spacing.xl,
  },
  textContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
});