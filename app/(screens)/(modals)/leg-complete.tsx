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

export default function LegCompleteModal() {
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
    router.back();
  };

  const handleContinue = () => {
    if (params.onContinue === 'true') {
      router.back();
    }
  };

  if (!gameData || !winner) {
    return null;
  }

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
          <Text size="xl" weight="semibold">Leg Complete!</Text>
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
        
        <View style={styles.legStats}>
          <Text size="lg" weight="semibold" style={styles.statsTitle}>
            Leg Statistics
          </Text>
          <View style={[styles.statsCard, { backgroundColor: colors.background.card.primary }]}>
            <View style={styles.statItem}>
              <Text weight="semibold">Winner</Text>
              <Text variant="secondary">{winner.name}</Text>
            </View>
            <View style={styles.statItem}>
              <Text weight="semibold">Leg Average</Text>
              <Text variant="secondary">{winner.legAvg.toFixed(1)}</Text>
            </View>
            {winner.highestCheckout && (
              <View style={styles.statItem}>
                <Text weight="semibold">Checkout</Text>
                <Text variant="secondary">{winner.highestCheckout}</Text>
              </View>
            )}
          </View>
        </View>
        
        <Button
          label="Continue"
          variant="primary"
          onPress={handleContinue}
          style={styles.continueButton}
        />
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
  legStats: {
    marginBottom: spacing.xl,
  },
  statsTitle: {
    marginBottom: spacing.md,
  },
  statsCard: {
    borderRadius: layout.radius.xl,
    padding: spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  continueButton: {
    marginTop: spacing.md,
  },
});