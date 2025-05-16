import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, ViewStyle, StyleProp, Keyboard, Animated } from 'react-native';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface StickyButtonContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  extraBottomPadding?: number;
  showShadow?: boolean;
}

/**
 * A container that sticks to the bottom of the screen and adapts to safe areas
 * and keyboard visibility. Perfect for buttons that need to stay accessible.
 */
export function StickyButtonContainer({
  children,
  style,
  extraBottomPadding = 0,
  showShadow = true,
}: StickyButtonContainerProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  
  // Animation value for smooth transitions
  const animatedBottom = useState(new Animated.Value(0))[0];
  
  // Calculate better bottom padding for iOS
  const safeBottomPadding = Platform.OS === 'ios' 
    ? Math.max(insets.bottom + 16 + extraBottomPadding, 24) 
    : Math.max(insets.bottom + extraBottomPadding, 16);
  
  // Track keyboard visibility and position
  useEffect(() => {
    function keyboardWillShow(e: any) {
      setKeyboardVisible(true);
      setKeyboardHeight(e.endCoordinates.height);
      
      Animated.timing(animatedBottom, {
        toValue: e.endCoordinates.height,
        duration: 250, // Match iOS keyboard animation
        useNativeDriver: false,
      }).start();
    }
    
    function keyboardWillHide() {
      setKeyboardVisible(false);
      
      Animated.timing(animatedBottom, {
        toValue: 0,
        duration: 250, // Match iOS keyboard animation
        useNativeDriver: false,
      }).start();
    }
    
    // Different event names between iOS and Android
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    
    const keyboardShowListener = Keyboard.addListener(showEvent, keyboardWillShow);
    const keyboardHideListener = Keyboard.addListener(hideEvent, keyboardWillHide);
    
    return () => {
      keyboardShowListener.remove();
      keyboardHideListener.remove();
    };
  }, []);
  
  // Create animated container style
  const animatedContainerStyle = {
    ...styles.container,

    paddingBottom: safeBottomPadding,
    borderTopColor: colors.border.primary,
    bottom: animatedBottom, // This will animate with the keyboard

    ...Platform.select({
      ios: {
        zIndex: 9999, // Very high zIndex to ensure it's on top of everything
      },
    }),
  };
  
  return (
    <Animated.View style={[animatedContainerStyle, style]}>
      <View style={styles.content}>
        {children}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.md,

    zIndex: 999, // Ensure it stays on top
  },
  shadow: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,

  },
  content: {
    gap: spacing.md,
    // Add these to ensure the content is well-positioned
    ...(Platform.OS === 'ios' && {
      alignItems: 'stretch', // Ensures buttons stretch full width on iOS
    }),
  },
  // Add this to create a bit of extra breathing room for the keyboard
  keyboardSpacing: {
    height: Platform.OS === 'ios' ? 32 : 16,
  }
});