import { View, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Button } from '@/components/ui/atoms/Button';
import { Text } from '@/components/ui/atoms/Text';
import { PlayerDrawer } from '@/components/setup/PlayerDrawer';
import { PlayerDetailsCard } from '@/components/setup/PlayerDetailsCard';
import { CricketSettingsCard } from '@/components/setup/CricketSettingsCard';
import Animated, { FadeIn } from 'react-native-reanimated';

interface PlayerItem {
  id: string;
  name: string;
  color?: string;
}

export default function CricketSetup() {
  const router = useRouter();
  const colors = useThemeColors();
  const [players, setPlayers] = useState<PlayerItem[]>([]);
  const [error, setError] = useState('');
  const [scoringType, setScoringType] = useState<'cricket' | 'route'>('cricket');
  const [marksRequired, setMarksRequired] = useState(3);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<PlayerItem | null>(null);

  const removePlayer = (id: string) => {
    const newPlayers = players.filter(p => p.id !== id);
    setPlayers(newPlayers);
    setError('');
  };

  const handleEditPlayer = (player: PlayerItem) => {
    setEditingPlayer(player);
    setDrawerVisible(true);
  };

  const handleSelectPlayer = (player: any) => {
    if (editingPlayer) {
      setPlayers(currentPlayers => 
        currentPlayers.map(p => 
          p.id === editingPlayer.id 
            ? { id: p.id, name: player.name, color: player.color }
            : p
        )
      );
      setEditingPlayer(null);
    } else if (players.length < 4) {
      setPlayers([...players, { 
        id: player.id,
        name: player.name,
        color: player.color,
      }]);
    }
    setDrawerVisible(false);
  };

  const handleCloseDrawer = () => {
    setDrawerVisible(false);
    setEditingPlayer(null);
  };

  const startGame = () => {
    if (players.length === 0) {
      setError('At least one player is required');
      return;
    }

    const duplicateNames = new Set(players.map(p => p.name.trim())).size !== players.length;

    if (duplicateNames) {
      setError('Player names must be unique');
      return;
    }

    const gameState = players.map((player, index) => ({
      id: player.id,
      name: player.name.trim(),
      isActive: index === 0,
      color: player.color || '#22C55E',
      scores: {
        20: 0,
        19: 0,
        18: 0,
        17: 0,
        16: 0,
        15: 0,
        25: 0 // Bull
      },
      totalPoints: 0
    }));

    router.push({
      pathname: '/game/cricket',
      params: {
        players: JSON.stringify(gameState),
        scoringType,
        marksRequired,
      }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <PlayerDetailsCard
          players={players}
          error={error}
          onRemovePlayer={removePlayer}
          onEditPlayer={handleEditPlayer}
          onOpenPlayerDrawer={() => setDrawerVisible(true)}
        />

        <CricketSettingsCard
          scoringType={scoringType}
          marksRequired={marksRequired}
          onScoringTypeChange={setScoringType}
          onMarksRequiredChange={setMarksRequired}
        />

        {error ? (
          <Animated.Text 
            entering={FadeIn}
            style={[styles.error, { color: colors.brand.error }]}
          >
            {error}
          </Animated.Text>
        ) : null}

        <Button
          onPress={startGame}
          label="Start Game"
          variant="primary"
        />

        <PlayerDrawer
          visible={drawerVisible}
          onClose={handleCloseDrawer}
          onSelectPlayer={handleSelectPlayer}
          editingPlayer={editingPlayer}
          selectedPlayers={players}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.container,
    gap: spacing.xl,
    paddingTop: Platform.OS === 'ios' ? spacing.md : spacing.container,
  },
  error: {
    textAlign: 'center',
  },
});