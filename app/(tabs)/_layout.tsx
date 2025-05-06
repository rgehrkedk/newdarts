import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutGrid, User, Target, ChartBar, Settings as SettingsIcon, Medal, Plus } from 'lucide-react-native';
import { TouchableOpacity, StyleSheet, View, Platform } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColors } from '@/constants/theme/colors';
import { spacing, layout } from '@/constants/theme';
import { Redirect, useRouter } from 'expo-router';
import { Text } from '@/components/ui/atoms/Text';
import { usePlayers } from '@/hooks/usePlayers';
import { useTheme } from '@/hooks/useTheme';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';

function PlayButton({ colors, isDark, onPress }) {
  // Animation values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const bgOpacity = useSharedValue(1);
  const pulseScale = useSharedValue(1);
  const shadowOpacity = useSharedValue(0.4);
  const iconRotation = useSharedValue(0); // New rotation value for the plus icon
  
  // Get styles based on current theme
  const styles = createStyles(colors);
  
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
      backgroundColor: colors.brand.primary + '30', // Semi-transparent 
      transform: [{ scale: pulseScale.value }],
      opacity: shadowOpacity.value,
    };
  });
  
  // Add animated style for the Plus icon
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
      // Existing pulse animations
      pulseScale.value = withSequence(
        withTiming(1.2, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      );
      
      shadowOpacity.value = withSequence(
        withTiming(0.15, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.05, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      );
      
      // Subtle continuous rotation for the plus icon
      iconRotation.value = withSequence(
        withTiming(5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-5, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      );
      
      // Loop the animation
      setTimeout(setupIdleAnimation, 6000);
    };
    
    setupIdleAnimation();
  }, []);
  
  // Handle press with animation sequence
  const handlePress = () => {
    // Pulse animation
    scale.value = withSequence(
      withTiming(1.15, { duration: 200 }),
      withTiming(0.95, { duration: 150 }),
      withTiming(1.05, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    // Rotate the gradient button slightly
    rotation.value = withSequence(
      withTiming(15, { duration: 150 }),
      withTiming(-10, { duration: 100 }),
      withTiming(0, { duration: 150 })
    );
    
    // Rotate the plus icon 
    iconRotation.value = withSequence(
      withTiming(0, { duration: 10 }), // Reset to 0 first for consistent animation
      withTiming(135, { duration: 300, easing: Easing.out(Easing.ease) }),
      withTiming(90, { duration: 150, easing: Easing.inOut(Easing.ease) })
    );
    
    // Flash the inner background
    bgOpacity.value = withSequence(
      withTiming(0.7, { duration: 100 }),
      withTiming(1, { duration: 200 })
    );
    
    // Extra pulse ring effect
    pulseScale.value = withSequence(
      withTiming(0.8, { duration: 10 }),
      withTiming(1.5, { duration: 300, easing: Easing.out(Easing.ease) })
    );
    
    shadowOpacity.value = withSequence(
      withTiming(0.3, { duration: 50 }),
      withTiming(0, { duration: 300 })
    );
    
    // Navigate after a tiny delay - increased slightly to allow more of the animation to be seen
    setTimeout(() => {
      // Reset the icon rotation
      iconRotation.value = withTiming(0, { duration: 300 });
      onPress();
    }, 200);
  };
  
  return (
    <View style={styles.centerTabButton}>
      {/* Subtle background pulse effect */}
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
            style={styles.playButtonGradient}
          >
            <Animated.View style={[styles.playButtonInner, animatedInnerStyle]}>
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

function HeaderRight({ colors, router }: { colors: any; router: any }) {
  // Create styles with current theme colors
  const styles = createStyles(colors);
  
  return (
    <View style={styles.headerButtons}>
      <TouchableOpacity 
        onPress={() => router.push('/(tabs)/stats')}
        style={styles.headerButton}
      >
        <User size={20} color={colors.text.primary} />
      </TouchableOpacity>
    </View>
  );
}

function CustomHeader({ title, scene, colors, router, currentPlayer }) {
  // Get theme state directly from useTheme
  const { isDark } = useTheme();
  // We don't need to use colors.scheme anymore as we have isDark directly
  
  // Create styles with current theme colors
  const styles = createStyles(colors);
  
  return (
    <BlurView 
      intensity={40} 
      tint={isDark ? 'dark' : 'light'}
      style={styles.customHeaderContainer}
    >
      <View style={styles.headerInner}>
        <Text size="xxl" weight="semibold" style={styles.headerText}>
          {title}
        </Text>
        <HeaderRight colors={colors} router={router} />
      </View>
    </BlurView>
  );
}

function CustomTabBar({ state, descriptors, navigation }) {
  const colors = useThemeColors();
  const { isDark } = useTheme();
  
  // Create styles with current theme colors
  const styles = createStyles(colors);

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
    <View style={styles.tabBarContainer}>
      {arrangedRoutes.map((route, index) => {
        // Find the original index to get the correct descriptor
        const originalIndex = state.routes.findIndex(r => r.key === route.key);
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === originalIndex;
        
        // Special styling for the Play tab
        const isPlayTab = route.name === 'play';
        
        // Get the icon element
        const icon = options.tabBarIcon ? options.tabBarIcon({
          color: isFocused ? colors.brand.primary : colors.text.secondary,
          size: isPlayTab ? 28 : 24,
        }) : null;
        
        return isPlayTab ? (
          <PlayButton 
            key={route.key}
            colors={colors} 
            isDark={isDark} 
            onPress={() => navigation.navigate(route.name)}
          />
        ) : (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
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
    </View>
  );
}

export default function TabLayout() {
  const { signOut, session } = useAuth();
  const colors = useThemeColors();
  const router = useRouter();
  const { players } = usePlayers();
  
  // Create styles with current theme colors
  const styles = createStyles(colors);

  if (!session) {
    return <Redirect href="/auth" />;
  }

  const currentPlayer = players.find(player => player.user_id === session.user.id);

  return (
    <Tabs
      screenOptions={{
        header: ({ navigation, route, options }) => {
          const title = options.title || route.name;
          return (
            <CustomHeader 
              title={title} 
              scene={{ route }} 
              colors={colors} 
              router={router} 
              currentPlayer={currentPlayer}
            />
          );
        },
        headerTransparent: true,
        headerStyle: {
          backgroundColor: 'transparent',
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          color: colors.text.primary,
        },
        // Tab bar is now handled by custom component
        tabBarStyle: { display: 'none' },
      }}
      tabBar={props => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <LayoutGrid size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <ChartBar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="play"
        options={{
          title: 'Play',
          tabBarIcon: ({ color, size }) => <Plus size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ color }) => <Medal size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Preferences',
          tabBarIcon: ({ color }) => <SettingsIcon size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

// Need to create styles outside the component for better performance
// But we need to use the theme colors, so we'll create a function that returns styles
const createStyles = (colors) => StyleSheet.create({
  customHeaderContainer: {
    width: '100%',
    paddingTop: 50, // Space for status bar
    height: 120,
    zIndex: 100,
    overflow: 'hidden',
    // Shadow properties with theme colors
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    borderBottomColor: colors.border.primary,
    borderBottomWidth: 0.5,
    backgroundColor: colors.background.secondary + '80',
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerText: {
    flex: 1,
    color: colors.text.primary,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.tertiary + '90',
  },
  // Tab bar styles
  tabBarContainer: {
    flexDirection: 'row',
    height: 80,
    paddingBottom: Platform.OS === 'ios' ? 25 : 15, // Extra padding for iOS to account for home indicator
    borderTopWidth: 0.5,
    backgroundColor: colors.background.primary,
    borderTopColor: colors.border.primary,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerTabButton: {
    justifyContent: 'flex-start',
    paddingTop: 5,
  },
  playButtonGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30, // Elevate further above the tab bar
    // Enhanced shadow for more prominence
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 10,
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  playButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary+'CC',
  },
});