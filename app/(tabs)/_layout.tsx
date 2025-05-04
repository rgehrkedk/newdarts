import { Tabs } from 'expo-router';
import { LayoutGrid, User, Target, ChartBar } from 'lucide-react-native';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColors } from '@/constants/theme/colors';
import { spacing, layout } from '@/constants/theme';
import { Redirect, useRouter } from 'expo-router';
import { Text } from '@/components/ui/atoms/Text';
import { usePlayers } from '@/hooks/usePlayers';

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
  return (
    <View style={styles.headerButtons}>
      <TouchableOpacity 
        onPress={() => router.push('/(tabs)/stats')}
        style={[styles.headerButton, { backgroundColor: colors.background.tertiary }]}
      >
        <User size={20} color={colors.text.primary} />
      </TouchableOpacity>
    </View>
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
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTitleStyle: {
          color: colors.text.primary,
        },
        headerRight: () => <HeaderRight colors={colors} router={router} />,
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
          headerTitle: () => <HeaderTitle currentPlayer={currentPlayer} />,
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
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginRight: spacing.lg,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    paddingVertical: spacing.xs,
  },
});