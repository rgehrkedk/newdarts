import { StyleSheet, Platform, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Button } from '@/components/core/atoms/Button';
import { Text } from '@/components/core/atoms/Text';
import { PlayerDrawer } from '@/components/features/players/PlayerDrawer';
import { PlayerDetailsCard } from '@/components/features/players/PlayerDetailsCard';
import { GameSettingsCard } from '@/components/features/game/setup/GameSettingsCard';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Container } from '@/components/layout/Container';
import { Header } from '@/components/layout/Header';
import { StickyButtonContainer } from '@/components/core/molecules';

interface PlayerItem {
  id: string;
  name: string;
  color?: string;
}

export default function X01Setup() {
  const router = useRouter();
  const colors = useThemeColors();
  const [players, setPlayers] = useState<PlayerItem[]>([]);
  const [error, setError] = useState('');
  const [gameVariant, setGameVariant] = useState(501);
  const [legs, setLegs] = useState(1);
  const [sets, setSets] = useState(1);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<PlayerItem | null>(null);

  const removePlayer = (id: string) => {
    const newPlayers = players.filter(p => p.id !== id);
    setPlayers(newPlayers);
    setError('');
  };

  const handleReorderPlayers = (reorderedPlayers: PlayerItem[]) => {
    setPlayers(reorderedPlayers);
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
      score: gameVariant,
      legAvg: 0,
      gameAvg: 0,
      checkoutPercentage: 0,
      darts: 0,
      isActive: index === 0,
      turns: [],
      legs: 0,
      sets: 0,
      color: player.color || '#22C55E'
    }));

    // Use type-safe navigation
    import('@/utils/navigation').then(({ navigate }) => {
      navigate('(screens)/(game)/x01/play', {
        players: JSON.stringify(gameState),
        totalLegs: legs.toString(),
        totalSets: sets.toString(),
        variant: gameVariant.toString(),
      });
    });
  };

  // Modified to avoid nesting issues
  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Header title="X01 Setup" showBackButton variant="solid" />

      {/* Container with scrolling for all content */}
      <Container scroll contentContainerStyle={styles.scrollContent}>
        {/* Players section with drag-and-drop managed by PlayerDetailsCard */}
        <PlayerDetailsCard
          players={players}
          error={error}
          onRemovePlayer={removePlayer}
          onEditPlayer={handleEditPlayer}
          onOpenPlayerDrawer={() => setDrawerVisible(true)}
          onReorderPlayers={handleReorderPlayers}
        />

        {/* Game settings */}
        <GameSettingsCard
          gameVariant={gameVariant}
          legs={legs}
          sets={sets}
          onGameVariantChange={setGameVariant}
          onLegsChange={value => setLegs(Math.max(1, Math.min(9, value)))}
          onSetsChange={value => setSets(Math.max(1, Math.min(9, value)))}
        />

        {error ? (
          <Animated.Text 
            entering={FadeIn}
            style={[styles.error, { color: colors.brand.error }]}
          >
            {error}
          </Animated.Text>
        ) : null}

        {/* Extra padding at the bottom to ensure content isn't hidden behind the sticky button */}
        <View style={styles.bottomPadding} />
      </Container>
      
      <StickyButtonContainer>
        <Button
          onPress={startGame}
          label="Start Game"
          variant="primary"
        />
      </StickyButtonContainer>

      <PlayerDrawer
        visible={drawerVisible}
        onClose={handleCloseDrawer}
        onSelectPlayer={handleSelectPlayer}
        editingPlayer={editingPlayer}
        selectedPlayers={players}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.xl,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.container,
  },
  error: {
    textAlign: 'center',
  },
  bottomPadding: {
    height: 80, // Extra space for the sticky button
  },
});