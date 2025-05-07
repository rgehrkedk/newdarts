import { View, StyleSheet } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Zap, Target, Clock } from 'lucide-react-native';
import { useState } from 'react';
import { BaseModal } from './BaseModal';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';

// Define types for players (simplified from game.ts for portability)
interface Player {
  id: string;
  name: string;
  turns: number[];
  gameAvg: number;
  legAvg: number;
  highestCheckout?: number;
}

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
  // The PlayerAccordion component will be feature-specific, so we'll accept a renderPlayer prop
  renderPlayer?: (player: Player, index: number, isExpanded: boolean, onToggle: () => void) => React.ReactNode;
  savedPlayers?: Player[]; // Optional saved players for comparison
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
  onContinue,
  renderPlayer,
  savedPlayers = []
}: CompletionModalProps) {
  const colors = useThemeColors();
  const [expandedPlayer, setExpandedPlayer] = useState<string | null>(winner.id);

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

  // Render footer with action buttons
  const renderFooter = showActions ? (
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
  ) : null;

  return (
    <BaseModal
      visible={visible}
      title={title}
      footer={renderFooter}
    >
      <View style={styles.playersContainer}>
        {sortedPlayers.map((player, index) => {
          const savedPlayer = savedPlayers.find(p => p.id === player.id);
          
          if (renderPlayer) {
            return renderPlayer(
              player, 
              index, 
              expandedPlayer === player.id,
              () => setExpandedPlayer(expandedPlayer === player.id ? null : player.id)
            );
          }
          
          // If no custom renderPlayer function is provided, we render a simple player info
          return (
            <View 
              key={player.id} 
              style={[
                styles.playerItem, 
                { 
                  backgroundColor: colors.background.card.primary,
                  borderColor: player.id === winner.id ? colors.brand.success : 'transparent',
                }
              ]}
            >
              <Text weight="semibold">{player.name}</Text>
              <Text variant="secondary">Avg: {player.gameAvg.toFixed(1)}</Text>
            </View>
          );
        })}
      </View>

      {showStats && (
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
      )}
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  playersContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  playerItem: {
    borderRadius: layout.radius.xl,
    padding: spacing.md,
    borderWidth: 2,
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
  highlightIcon: {
    padding: spacing.sm,
    borderRadius: layout.radius.xl,
    marginRight: spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});