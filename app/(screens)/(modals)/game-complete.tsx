import { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { X } from 'lucide-react-native';
import { usePlayers } from '@/hooks/usePlayers';
import { Text } from '@/components/core/atoms/Text';
import { Button } from '@/components/core/atoms/Button';
import { PlayerAccordion } from '@/components/features/game/common/PlayerAccordion';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Player } from '@/types/game';

export default function GameCompleteModal() {
  const router = useRouter();
  const colors = useThemeColors();
  const params = useLocalSearchParams();
  const { players: savedPlayers } = usePlayers();
  
  // Parse game data from params
  const gameData = params.gameData ? JSON.parse(params.gameData as string) : null;
  const players: Player[] = gameData?.players || [];
  const winner: Player | undefined = gameData?.winner || players[0];

  useEffect(() => {
    if (!gameData || !winner) {
      router.back();
    }
  }, [gameData, winner]);

  const handleClose = () => {
    import('@/utils/navigation').then(({ goBack }) => {
      goBack();
    });
  };

  const handleRestart = () => {
    // Navigate to game setup with the same players
    import('@/utils/navigation').then(({ navigateToGameSetup }) => {
      navigateToGameSetup(
        gameData.gameType === 'cricket' ? 'cricket' : 'x01', 
        players.map(p => ({ id: p.id, name: p.name, color: p.color }))
      );
    });
  };

  const handleHome = () => {
    import('@/utils/navigation').then(({ navigateToHome }) => {
      navigateToHome();
    });
  };

  if (!gameData || !winner) {
    return null;
  }

  const getHighlights = () => {
    const highlights = [];
    
    // Highest score
    const highestScore = Math.max(...players.flatMap(p => p.turns));
    const playerWithHighest = players.find(p => p.turns.includes(highestScore));
    if (playerWithHighest && highestScore >= 140) {
      highlights.push({
        title: 'Highest Score',
        description: `${playerWithHighest.name} hit ${highestScore}`
      });
    }

    // Best checkout
    const bestCheckout = Math.max(...players.map(p => p.highestCheckout || 0));
    const playerWithBestCheckout = players.find(p => p.highestCheckout === bestCheckout);
    if (playerWithBestCheckout && bestCheckout > 0) {
      highlights.push({
        title: 'Best Checkout',
        description: `${playerWithBestCheckout.name} checked out ${bestCheckout}`
      });
    }

    // Best leg average
    const bestLegAvg = Math.max(...players.map(p => p.legAvg));
    const playerWithBestLeg = players.find(p => p.legAvg === bestLegAvg);
    if (playerWithBestLeg && bestLegAvg > 0) {
      highlights.push({
        title: 'Best Leg Average',
        description: `${playerWithBestLeg.name} averaged ${bestLegAvg.toFixed(1)}`
      });
    }

    return highlights;
  };

  const highlights = getHighlights();
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.id === winner.id) return -1;
    if (b.id === winner.id) return 1;
    return b.gameAvg - a.gameAvg;
  });

  return (
    <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
      <Animated.View 
        entering={SlideInDown.springify().damping(15)}
        style={[styles.modalContainer, { backgroundColor: colors.background.primary }]}
      >
        <View style={styles.modalHeader}>
          <Text size="xl" weight="semibold">Game Complete!</Text>
          <TouchableOpacity 
            onPress={handleClose}
            style={[styles.closeButton, { backgroundColor: colors.background.secondary }]}
          >
            <X size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.playersContainer}>
          {sortedPlayers.map((player, index) => {
            const savedPlayer = savedPlayers.find(p => p.id === player.id);
            return (
              <Animated.View
                key={player.id}
                entering={FadeIn.delay(index * 100)}
              >
                <PlayerAccordion
                  player={player}
                  index={index}
                  isWinner={player.id === winner.id}
                  isExpanded={index === 0}
                  onToggle={() => {}}
                  savedGameAvg={savedPlayer?.gameAvg}
                />
              </Animated.View>
            );
          })}
        </View>
        
        {highlights.length > 0 && (
          <View style={styles.highlightsContainer}>
            <Text size="lg" weight="semibold" style={styles.highlightsTitle}>
              Game Highlights
            </Text>
            <View style={[styles.highlightsCard, { backgroundColor: colors.background.card.primary }]}>
              {highlights.map((highlight, index) => (
                <View key={index} style={styles.highlightItem}>
                  <View>
                    <Text weight="semibold" size="sm">{highlight.title}</Text>
                    <Text variant="secondary" size="xs">{highlight.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
        
        <View style={styles.actionButtons}>
          <Button
            label="Play Again"
            variant="secondary"
            onPress={handleRestart}
            style={styles.actionButton}
          />
          <Button
            label="Home"
            variant="primary"
            onPress={handleHome}
            style={styles.actionButton}
          />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.container,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    borderRadius: layout.radius.xl,
    padding: spacing.xl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playersContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  highlightsContainer: {
    marginBottom: spacing.xl,
  },
  highlightsTitle: {
    marginBottom: spacing.md,
  },
  highlightsCard: {
    borderRadius: layout.radius.xl,
    padding: spacing.lg,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});