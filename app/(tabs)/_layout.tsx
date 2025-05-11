import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutGrid, User, Target, ChartBar, Settings as SettingsIcon, Medal, Plus, TestTubeDiagonal } from 'lucide-react-native';
import { TouchableOpacity, StyleSheet, View, Platform } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColors } from '@/constants/theme/colors';
import { spacing, layout } from '@/constants/theme';
import { Redirect, useRouter } from 'expo-router';
import { Text } from '@core/atoms/Text';
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
import { TabBar } from '@/components/layout/TabBar';
import { Header } from '@/components/layout/Header';

// Using the Play button from the TabBar component which now has haptic feedback

function getHeaderRight({ colors, router }: { colors: any; router: any }) {
  return (
    <View style={{ flexDirection: 'row', gap: spacing.sm }}>
      <TouchableOpacity
        onPress={() => router.push('/(tabs)/stats')}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background.tertiary + '90',
        }}
      >
        <User size={20} color={colors.text.primary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push('/(screens)/test/test')}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background.tertiary + '90',
        }}
      >
        <TestTubeDiagonal size={20} color={colors.text.primary} />
      </TouchableOpacity>
    </View>
  );
}

function CustomHeader({ title, scene, colors, router, currentPlayer }) {
  return (
    <Header
      title={title}
      rightContent={getHeaderRight({ colors, router })}
    />
  );
}

// Using the imported TabBar component with haptic feedback

export default function TabLayout() {
  const { signOut, session } = useAuth();
  const colors = useThemeColors();
  const router = useRouter();
  const { players } = usePlayers();

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
      tabBar={props => <TabBar {...props} />}
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

// Styles are no longer needed here since we're using the imported Header and TabBar components