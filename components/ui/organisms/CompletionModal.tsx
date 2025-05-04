import { View, Modal, StyleSheet, ScrollView, Platform } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Zap, Target, Clock } from 'lucide-react-native';
import { Player } from '@/types/game';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { PlayerAccordion } from '@/components/game/PlayerAccordion';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useState } from 'react';
import { usePlayers } from '@/hooks/usePlayers';

interface CompletionModalProps {
  visible: boolean;
  title: string;
  winner: Player;
  players: Player[];
  showStats?: boolean;
  showActions?: boolean;
  onRestart?: () => void;
  onHome?: () => void;
  onContinue?: () => void;
}

export function CompletionModal({ 
  visible, 
  title,
  winner, 
  players,
  showStats = true,
  showActions = true,
  onRestart,
  onHome,
  onContinue
}: CompletionModalProps) {
  const colors = useThemeColors();
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(winner.id);
  const { players: savedPlayers } = usePlayers();

  const sortedPlayers = [...players].sort((a, b) => {
    if (a.id === winner.id) return -1;
    if (b.id === winner.id) return 1;
    return b.gameAvg - a.gameAvg;
  });

  const getHighlights = () => {
    const highlights = [];
    
    // Highest score
    const highestScore = Math.max(...players.flatMap(p => p.turns));
    const playerWithHighest = players.find(p => p.turns.includes(highestScore));
    if (playerWithHighest && highestScore >= 140) {
      highlights.push({
        icon: Zap,
        color: colors.brand.primary,
        title: 'Highest Score',
        description: `${playerWithHighest.name} hit ${highestScore}`
      });
    }

    // Best checkout
    const bestCheckout = Math.max(...players.map(p => p.highestCheckout || 0));
    const playerWithBestCheckout = players.find(p => p.highestCheckout === bestCheckout);
    if (playerWithBestCheckout && bestCheckout > 0) {
      highlights.push({
        icon: Target,
        color: colors.brand.success,
        title: 'Best Checkout',
        description: `${playerWithBestCheckout.name} checked out ${bestCheckout}`
      });
    }

    // Best leg average
    const bestLegAvg = Math.max(...players.map(p => p.legAvg));
    const playerWithBestLeg = players.find(p => p.legAvg === bestLegAvg);
    if (playerWithBestLeg && bestLegAvg > 0) {
      highlights.push({
        icon: Clock,
        color: colors.avatar.yellow,
        title: 'Best Leg Average',
        description: `${playerWithBestLeg.name} averaged ${bestLegAvg.toFixed(1)}`
      });
    }

    return highlights;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <ScrollView style={styles.scrollView}>
          <Animated.View 
            entering={FadeIn}
            style={[styles.header, { backgroundColor: colors.background.primary }]}
          >
            <Text size="xl" weight="semibold" align="center">{title}</Text>
          </Animated.View>

          <View style={styles.playersContainer}>
            {sortedPlayers.map((player, index) => {
              const savedPlayer = savedPlayers.find(p => p.id === player.id);
              
              return (
                <PlayerAccordion
                  key={player.id}
                  player={player}
                  index={index}
                  isWinner={player.id === winner.id}
                  isExpanded={expandedPlayer === player.id}
                  onToggle={() => setExpandedPlayer(
                    expandedPlayer === player.id ? null : player.id
                  )}
                  savedGameAvg={savedPlayer?.gameAvg}
                />
              );
            })}
          </View>

          <View style={styles.highlightsContainer}>
            <Text size="lg" weight="semibold" style={styles.highlightsTitle}>
              Game Highlights
            </Text>
            <View style={[styles.highlightsCard, { backgroundColor: colors.background.card.primary }]}>
              {getHighlights().map((highlight, index) => (
                <View key={index} style={styles.highlightItem}>
                  <View style={[styles.highlightIcon, { backgroundColor: `${highlight.color}20` }]}>
                    <highlight.icon size={20} color={highlight.color} />
                  </View>
                  <View>
                    <Text weight="semibold" size="sm">{highlight.title}</Text>
                    <Text variant="secondary" size="xs">{highlight.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {showActions && (
          <Animated.View 
            entering={FadeIn.delay(600)}
            style={[styles.actions, { backgroundColor: colors.background.primary }]}
          >
            <View style={styles.actionButtons}>
              {onRestart && (
                <Button
                  label="Play Again"
                  variant="secondary"
                  onPress={onRestart}
                  style={styles.actionButton}
                />
              )}
              {onHome && (
                <Button
                  label="Home"
                  variant="primary"
                  onPress={onHome}
                  style={styles.actionButton}
                />
              )}
              {onContinue && (
                <Button
                  label="Continue"
                  variant="primary"
                  onPress={onContinue}
                  style={styles.actionButton}
                />
              )}
            </View>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? spacing.xxxl : spacing.xxl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.container,
  },
  playersContainer: {
    paddingHorizontal: spacing.container,
    gap: spacing.md,
  },
  highlightsContainer: {
    padding: spacing.container,
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
  highlightIcon: {
    padding: spacing.sm,
    borderRadius: layout.radius.xl,
    marginRight: spacing.md,
  },
  actions: {
    padding: spacing.container,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});