import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { useTheme } from '@/hooks/useTheme';
import { Text } from '@core/atoms/Text';
import { Plus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing
} from 'react-native-reanimated';
import haptics from '@/utils/haptics';

interface PlayButtonProps {
  onPress: () => void;
}

function PlayButton({ onPress }: PlayButtonProps) {
  const colors = useThemeColors();
  
  // Animation values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const bgOpacity = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.4);
  const iconRotation = useSharedValue(0);
  
  // Create animated styles
  const animatedGradientStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${rotation.value}deg` }
      ],
    };
  });
  
  const animatedInnerStyle = useAnimatedStyle(() => {
    return {
      opacity: bgOpacity.value,
    };
  });
  
  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.brand.primary + '30',
      transform: [{ scale: pulseScale.value }],
      opacity: shadowOpacity.value,
    };
  });
  
  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${iconRotation.value}deg` }
      ]
    };
  });
  
  // Subtle continuous pulse animation for idle state
  React.useEffect(() => {
    const setupIdleAnimation = () => {
      pulseScale.value = withSequence(
        withTiming(1.2, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      );
      
      shadowOpacity.value = withSequence(
        withTiming(0.15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.05, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      );
      
      iconRotation.value = withSequence(
        withTiming(5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      );
      
      setTimeout(setupIdleAnimation, 6000);
    };
    
    setupIdleAnimation();
  }, []);
  
  // Handle press with animation sequence
  const handlePress = () => {
    // Provide medium haptic feedback for the Play button
    haptics.mediumImpact();

    scale.value = withSequence(
      withTiming(1.15, { duration: 200 }),
      withTiming(0.95, { duration: 150 }),
      withTiming(1.05, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    rotation.value = withSequence(
      withTiming(15, { duration: 150 }),
      withTiming(-10, { duration: 100 }),
      withTiming(0, { duration: 150 })
    );

    iconRotation.value = withSequence(
      withTiming(0, { duration: 10 }),
      withTiming(135, { duration: 300, easing: Easing.out(Easing.ease) }),
      withTiming(90, { duration: 150, easing: Easing.inOut(Easing.ease) })
    );

    bgOpacity.value = withSequence(
      withTiming(0.7, { duration: 100 }),
      withTiming(1, { duration: 200 })
    );

    pulseScale.value = withSequence(
      withTiming(0.8, { duration: 10 }),
      withTiming(1.5, { duration: 300, easing: Easing.out(Easing.ease) })
    );

    shadowOpacity.value = withSequence(
      withTiming(0.3, { duration: 50 }),
      withTiming(0, { duration: 300 })
    );

    setTimeout(() => {
      iconRotation.value = withTiming(0, { duration: 300 });
      onPress();
    }, 200);
  };
  
  return (
    <View style={styles.centerTabButton}>
      <Animated.View style={animatedPulseStyle} />
      
      <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <Animated.View style={animatedGradientStyle}>
          <LinearGradient
            colors={[colors.brand.primary, colors.brand.primaryGradient]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.playButtonGradient,
              { 
                shadowColor: colors.black,
                borderColor: colors.background.tertiary,
                backgroundColor: 'transparent',
              }
            ]}
          >
            <Animated.View style={[
              styles.playButtonInner,
              { backgroundColor: colors.background.primary+'CC' },
              animatedInnerStyle
            ]}>
              <Animated.View style={animatedIconStyle}>
                <Plus size={28} strokeWidth={3} color={colors.text.brand} />
              </Animated.View>
            </Animated.View>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const colors = useThemeColors();
  const { isDark } = useTheme();
  
  // Find the play tab index
  const playTabIndex = state.routes.findIndex(route => route.name === 'play');
  
  // Rearrange routes to ensure Play tab is in the middle
  const arrangedRoutes = [...state.routes];
  if (playTabIndex !== -1) {
    const playTab = arrangedRoutes.splice(playTabIndex, 1)[0];
    const middleIndex = Math.floor(arrangedRoutes.length / 2);
    arrangedRoutes.splice(middleIndex, 0, playTab);
  }
  
  return (
    <View style={styles.container}>
      {/* Play button that sits on top and won't be cut off */}
      <View style={styles.playButtonContainer}>
        {arrangedRoutes.map((route, index) => {
          const isPlayTab = route.name === 'play';
          if (isPlayTab) {
            return (
              <PlayButton 
                key={route.key}
                onPress={() => navigation.navigate(route.name)}
              />
            );
          }
          return null;
        })}
      </View>
      
      {/* BlurView with the regular tab items */}
      <BlurView 
        intensity={30}
        tint={isDark ? 'dark' : 'light'}
        style={[
          styles.tabBarContainer,
          {
            borderTopColor: 'transparent',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            borderWidth: 0.5,
          }
        ]}
      >
        {arrangedRoutes.map((route, index) => {
          // Skip the play tab in the regular tab items since we render it separately
          const isPlayTab = route.name === 'play';
          if (isPlayTab) {
            return <View key={route.key} style={styles.placeholderTab} />;
          }
        // Find the original index to get the correct descriptor
        const originalIndex = state.routes.findIndex(r => r.key === route.key);
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === originalIndex;
        
        // Get the icon element
        const icon = options.tabBarIcon ? options.tabBarIcon({
          color: isFocused ? colors.brand.primary : colors.text.secondary,
          size: 24,
        }) : null;
        
        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => {
              // Add light haptic feedback for regular tab buttons
              haptics.lightImpact();
              navigation.navigate(route.name);
            }}
            style={styles.tabButton}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
          >
            {icon}
            <Text 
              size="xs" 
              weight={isFocused ? "semibold" : "regular"}
              style={[
                { marginTop: 4 },
                isFocused ? { color: colors.brand.primary } : { color: colors.text.secondary }
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  playButtonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    zIndex: 20,
    pointerEvents: 'box-none',
  },
  tabBarContainer: {
    flexDirection: 'row',
    height: 80,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    overflow: 'hidden',
    zIndex: 10,
  },
  placeholderTab: {
    flex: 1,
    opacity: 0,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerTabButton: {
    justifyContent: 'flex-start',
    overflow: 'visible',
    paddingTop: 5,
  },
  playButtonGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    overflow: 'visible',
    alignItems: 'center',
    marginTop: -30,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
    borderWidth: 2,
  },
  playButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});