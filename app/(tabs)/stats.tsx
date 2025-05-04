// app/(tabs)/stats.tsx
import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/ui/atoms/Text';
import { usePlayers } from '@/hooks/usePlayers';
import { PlayerStats } from '@/components/stats/PlayerStats';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function Stats() {
  const colors = useThemeColors();
  const { players, isLoading, error } = usePlayers();

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Text size="xl" weight="semibold" style={styles.title}>Player Statistics</Text>
      <Text variant="secondary" style={styles.subtitle}>View detailed statistics for all players</Text>

      {isLoading ? (
        <Text variant="secondary">Loading statistics...</Text>
      ) : error ? (
        <Text variant="error">{error}</Text>
      ) : (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={Platform.OS === 'web'}
        >
          {players.map((player, index) => (
            <Animated.View
              key={player.id}
              entering={FadeIn.delay(index * 100)}
              style={styles.playerCard}
            >
              <PlayerStats player={player} />
            </Animated.View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginTop: spacing.xl,
    marginHorizontal: spacing.container,
  },
  subtitle: {
    marginHorizontal: spacing.container,
    marginBottom: spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.container,
    gap: spacing.lg,
  },
  playerCard: {
    marginBottom: spacing.md,
  },
});
