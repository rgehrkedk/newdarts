import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';

const { width, height } = Dimensions.get('window');

interface ConfettiPiece {
  id: number;
  x: Animated.Value;
  y: Animated.Value;
  rotate: Animated.Value;
  color: string;
  size: number;
  opacity: Animated.Value;
}

interface ConfettiExplosionProps {
  count?: number;
  duration?: number;
  isVisible: boolean;
  colors?: string[];
  onComplete?: () => void;
  origin?: { x: number; y: number };
}

/**
 * A custom confetti explosion component that doesn't rely on external libraries
 */
export function ConfettiExplosion({
  count = 100,
  duration = 2000,
  isVisible,
  colors = ['#F4BC19', '#22C55E', '#7C3AED', '#EC4899', '#3B82F6'],
  onComplete,
  origin = { x: width / 2, y: height / 3 }
}: ConfettiExplosionProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate confetti pieces
      const newPieces: ConfettiPiece[] = [];
      for (let i = 0; i < count; i++) {
        newPieces.push({
          id: i,
          x: new Animated.Value(0),
          y: new Animated.Value(0),
          rotate: new Animated.Value(0),
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4, // Random size between 4-12
          opacity: new Animated.Value(1)
        });
      }
      setPieces(newPieces);

      // Start animations
      newPieces.forEach(piece => {
        const xDistance = (Math.random() * 2 - 1) * width * 0.5; // Random spread left or right
        const yDistance = Math.random() * height * 0.7; // Fall downward
        const rotation = Math.random() * 360 * 3; // Multiple rotations

        Animated.parallel([
          // Move horizontally
          Animated.timing(piece.x, {
            toValue: xDistance,
            duration,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true
          }),
          // Fall with gravity
          Animated.timing(piece.y, {
            toValue: yDistance,
            duration,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true
          }),
          // Rotate
          Animated.timing(piece.rotate, {
            toValue: rotation,
            duration,
            easing: Easing.linear,
            useNativeDriver: true
          }),
          // Fade out toward the end
          Animated.timing(piece.opacity, {
            toValue: 0,
            duration,
            delay: duration * 0.6, // Start fading at 60% of animation
            easing: Easing.linear,
            useNativeDriver: true
          })
        ]).start();
      });

      // Call onComplete after animation
      if (onComplete) {
        const timer = setTimeout(() => {
          onComplete();
        }, duration + 100);
        return () => clearTimeout(timer);
      }
    }
  }, [isVisible]);

  if (!isVisible || pieces.length === 0) {
    return null;
  }

  return (
    <View style={[styles.container]} pointerEvents="none">
      {pieces.map(piece => (
        <Animated.View
          key={piece.id}
          style={[
            styles.piece,
            {
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              borderRadius: piece.size / 2,
              left: origin.x,
              top: origin.y,
              transform: [
                { translateX: piece.x },
                { translateY: piece.y },
                { rotate: piece.rotate.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg']
                })}
              ],
              opacity: piece.opacity
            }
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  piece: {
    position: 'absolute',
  }
});