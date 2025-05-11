import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const { width, height } = Dimensions.get('window');

interface OneEightyConfettiProps {
  isVisible: boolean;
  onComplete?: () => void;
}

/**
 * A component that displays confetti animation for 180 score celebrations
 * The animation is timed to match the duration of the haptic feedback (approx 1.8 seconds)
 */
export function OneEightyConfetti({ isVisible, onComplete }: OneEightyConfettiProps) {
  const confettiRef = useRef<ConfettiCannon>(null);
  
  // The estimated total duration of the oneEightyFeedback haptic pattern
  // Based on the actual haptic duration in haptics.ts (about 1.8-2 seconds)
  const HAPTIC_DURATION = 2000; // milliseconds

  useEffect(() => {
    if (isVisible && confettiRef.current) {
      // Start the confetti explosion
      confettiRef.current.start();

      // Call onComplete after the animation and haptics are done
      if (onComplete) {
        // Use a longer duration to let confetti continue falling after haptics finish
        // This creates a more satisfying visual effect
        const timer = setTimeout(() => {
          onComplete();
        }, HAPTIC_DURATION + 1500); // Extra time for confetti to continue falling

        return () => clearTimeout(timer);
      }
    }
  }, [isVisible, onComplete]);
  
  if (!isVisible) return null;
  
  return (
    <View style={styles.container} pointerEvents="none">
      <ConfettiCannon
        ref={confettiRef}
        count={180} // Number of confetti pieces
        origin={{ x: -10, y: 0 }} // Start from the top center of screen for falling effect
        explosionSpeed={400} // Moderate explosion speed
        fallSpeed={3000} // Adjust fall speed for more natural falling
        fadeOut={true}
        spreader={width * 2} // Wider spread
        gravity={0.3} // Higher gravity for faster falling
        colors={['#F4BC19', '#22C55E', '#7C3AED', '#EC4899', '#3B82F6']} // Dart colors
        autoStart={false} // We'll manually start it with the ref
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
});