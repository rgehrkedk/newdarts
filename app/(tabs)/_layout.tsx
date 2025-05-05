import { Tabs } from 'expo-router';
import { LayoutGrid, User, Target, ChartBar, Settings as SettingsIcon } from 'lucide-react-native';
import { TouchableOpacity, StyleSheet, View, Platform } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColors } from '@/constants/theme/colors';
import { spacing, layout } from '@/constants/theme';
import { Redirect, useRouter } from 'expo-router';
import { Text } from '@/components/ui/atoms/Text';
import { usePlayers } from '@/hooks/usePlayers';
import { useTheme } from '@/hooks/useTheme';
import { BlurView } from 'expo-blur';

function HeaderTitle({ currentPlayer }: { currentPlayer?: { name: string } | null }) {
  return (
    <View style={styles.headerTitle}>
      <Text variant="secondary" size="sm">Welcome back,</Text>
      <Text weight="semibold" size="xl">
        {currentPlayer?.name || 'Player'}
      </Text>
    </View>
  );
}

function HeaderRight({ colors, router }: { colors: any; router: any }) {
  const { isDark } = useTheme();
  return (
    <View style={styles.headerButtons}>
      <TouchableOpacity 
        onPress={() => router.push('/(tabs)/stats')}
        style={[styles.headerButton, { 
          backgroundColor: isDark 
            ? `${colors.background.tertiary}80` 
            : `${colors.background.tertiary}90` 
        }]}
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
  
  return (
    <BlurView 
      intensity={35} 
      tint={isDark ? 'dark' : 'light'}
      style={[styles.customHeaderContainer, { backgroundColor: colors.background.primary + '20' }]}
    >
      <View style={styles.headerInner}>
        {title === 'Home' ? (
          <HeaderTitle currentPlayer={currentPlayer} />
        ) : (
          <Text size="lg" weight="semibold" style={[styles.headerText, { color: colors.text.primary }]}>
            {title}
          </Text>
        )}
        <HeaderRight colors={colors} router={router} />
      </View>
    </BlurView>
  );
}

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
        },
        headerTitleStyle: {
          color: colors.text.primary,
        },
        tabBarStyle: {
          backgroundColor: colors.background.primary,
          borderTopColor: colors.border.primary,
        },
        tabBarActiveTintColor: colors.brand.primary,
        tabBarInactiveTintColor: colors.text.secondary,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <LayoutGrid size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="play"
        options={{
          title: 'Play',
          tabBarIcon: ({ color }) => <Target size={24} color={color} />,
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
        name="settings"
        options={{
          title: 'Preferences', // Changed from 'Settings' to 'Preferences'
          tabBarIcon: ({ color }) => <SettingsIcon size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  customHeaderContainer: {
    width: '100%',
    paddingTop: 50, // Space for status bar
    height: 120,
    zIndex: 100,
    overflow: 'hidden',
    // iOS-style bottom border
    borderBottomWidth: 0.5, 
    borderBottomColor: 'rgba(140, 140, 140, 0.3)',
    // Subtle shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
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
  },
  headerTitle: {
    flex: 1,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    alignItems: 'flex-start',
  },
});