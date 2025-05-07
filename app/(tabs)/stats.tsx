// app/(tabs)/stats.tsx
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@core/atoms/Text';
import { usePlayers } from '@/hooks/usePlayers';
import { PlayerStatsContent } from '@features/stats/PlayerStats';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { ChevronDown } from 'lucide-react-native';
import { SavedPlayer } from '@/types/game';

export default function Stats() {
  const colors = useThemeColors();
  const { players, isLoading, error } = usePlayers();
  const { session } = useAuth();
  const [selectedPlayer, setSelectedPlayer] = useState<SavedPlayer | null>(null);
  const [showPlayerDropdown, setShowPlayerDropdown] = useState(false);

  // Find current user's player record
  useEffect(() => {
    if (players.length > 0 && session?.user?.id) {
      const currentUserPlayer = players.find(p => p.user_id === session.user.id);
      if (currentUserPlayer) {
        setSelectedPlayer(currentUserPlayer);
      } else if (players[0]) {
        // Fallback to first player if user doesn't have a player record
        setSelectedPlayer(players[0]);
      }
    }
  }, [players, session?.user?.id]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={{ height: 90 }} />
      <Text size="xl" weight="semibold" style={styles.title}>Player Statistics</Text>
      <Text variant="secondary" style={styles.subtitle}>View detailed statistics for your players</Text>

      {isLoading ? (
        <View style={styles.centered}>
          <Text variant="secondary">Loading statistics...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text variant="error">{error}</Text>
        </View>
      ) : players.length === 0 ? (
        <View style={styles.centered}>
          <Text variant="secondary">No players found. Create a player to view statistics.</Text>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Player Selector Dropdown */}
          <View style={styles.dropdownContainer}>
            <TouchableOpacity 
              style={[styles.dropdown, { backgroundColor: colors.background.tertiary }]}
              onPress={() => setShowPlayerDropdown(!showPlayerDropdown)}
            >
              <View style={[styles.playerIndicator, { backgroundColor: selectedPlayer?.color || colors.brand.primary }]} />
              <Text>{selectedPlayer?.name || 'Select Player'}</Text>
              <ChevronDown size={20} color={colors.text.primary} />
            </TouchableOpacity>

            {/* Dropdown Menu */}
            {showPlayerDropdown && (
              <Animated.View 
                entering={FadeIn}
                style={[styles.dropdownMenu, { backgroundColor: colors.background.tertiary }]}
              >
                {players.map((player) => (
                  <TouchableOpacity
                    key={player.id}
                    style={[
                      styles.dropdownItem,
                      selectedPlayer?.id === player.id && { backgroundColor: colors.background.secondary }
                    ]}
                    onPress={() => {
                      setSelectedPlayer(player);
                      setShowPlayerDropdown(false);
                    }}
                  >
                    <View style={[styles.playerIndicator, { backgroundColor: player.color }]} />
                    <Text>{player.name}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}
          </View>

          {/* Player Statistics Content */}
          {selectedPlayer && (
            <Animated.View 
              entering={FadeIn}
              style={styles.statsContent}
            >
              <PlayerStatsContent player={selectedPlayer} />
            </Animated.View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginTop: spacing.sm,
    marginHorizontal: spacing.container,
  },
  subtitle: {
    marginHorizontal: spacing.container,
    marginBottom: spacing.lg,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.container,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.container,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 10,
    marginBottom: spacing.md,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: layout.radius.lg,
    justifyContent: 'space-between',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderRadius: layout.radius.lg,
    marginTop: spacing.xs,
    padding: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 20,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: layout.radius.md,
  },
  playerIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: spacing.md,
  },
  statsContent: {
    flex: 1,
  },
});
