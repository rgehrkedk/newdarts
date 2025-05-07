import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { useRouter } from 'expo-router';
import { usePlayers } from '@/hooks/usePlayers';
import { Avatar } from '@/components/core/atoms/Avatar';
import { Text } from '@/components/core/atoms/Text';
import { Button } from '@/components/core/atoms/Button';
import { Plus, User, ChevronRight } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function PlayerList() {
  const colors = useThemeColors();
  const router = useRouter();
  const { players } = usePlayers();

  const handleCreatePlayer = () => {
    import('@/utils/navigation').then(({ navigateToCreatePlayer }) => {
      navigateToCreatePlayer();
    });
  };

  const handleSelectPlayer = (playerId: string) => {
    import('@/utils/navigation').then(({ navigateToPlayerDetails }) => {
      navigateToPlayerDetails(playerId);
    });
  };

  const handleEditPlayer = (playerId: string) => {
    import('@/utils/navigation').then(({ navigateToPlayerEdit }) => {
      navigateToPlayerEdit(playerId);
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.header}>
        <Text size="xl" weight="semibold">Players</Text>
        <Button 
          label="Create"
          variant="primary"
          icon={Plus}
          onPress={handleCreatePlayer}
        />
      </View>
      
      {players.length === 0 ? (
        <View style={styles.emptyContainer}>
          <User size={48} color={colors.text.secondary} />
          <Text 
            size="lg" 
            weight="semibold" 
            variant="secondary"
            style={styles.emptyText}
          >
            No players yet
          </Text>
          <Text variant="secondary" style={styles.emptySubtext}>
            Create your first player to get started
          </Text>
          <Button
            label="Create Player"
            variant="secondary"
            icon={Plus}
            onPress={handleCreatePlayer}
            style={styles.createButton}
          />
        </View>
      ) : (
        <FlatList
          data={players}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(index * 100).springify()}
              style={[
                styles.playerItem,
                {
                  backgroundColor: colors.background.secondary,
                }
              ]}
            >
              <TouchableOpacity 
                style={styles.playerButton}
                onPress={() => handleSelectPlayer(item.id)}
              >
                <Avatar
                  name={item.name}
                  color={item.color || "#4F46E5"}
                  size={40}
                />
                <View style={styles.playerInfo}>
                  <Text weight="semibold">{item.name}</Text>
                  {item.gameAvg > 0 && (
                    <Text variant="secondary" size="xs">
                      Avg: {item.gameAvg.toFixed(1)}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={[styles.editButton, { backgroundColor: colors.background.tertiary }]}
                  onPress={() => handleEditPlayer(item.id)}
                >
                  <ChevronRight size={20} color={colors.text.secondary} />
                </TouchableOpacity>
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.container,
    paddingBottom: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },
  emptyText: {
    marginTop: spacing.md,
  },
  emptySubtext: {
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  createButton: {
    minWidth: 180,
  },
  listContent: {
    padding: spacing.container,
    gap: spacing.md,
  },
  playerItem: {
    borderRadius: layout.radius.xl,
    overflow: 'hidden',
  },
  playerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  playerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});