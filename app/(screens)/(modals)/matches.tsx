import { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { X, Trophy, Calendar, ArrowRight } from 'lucide-react-native';
import { usePlayers } from '@/hooks/usePlayers';
import { Text } from '@/components/core/atoms/Text';
import { Button } from '@/components/core/atoms/Button';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Player, SavedPlayer } from '@/types/game';
import { Card } from '@/components/core/atoms/Card';

interface Match {
  id: string;
  date: string;
  players: {
    id: string;
    name: string;
    position: number;
    score?: number;
  }[];
  gameType: 'x01' | 'cricket';
  variant?: number; // 501, 301, etc. for X01 games
  completed: boolean;
}

export default function MatchesModal() {
  const router = useRouter();
  const colors = useThemeColors();
  const params = useLocalSearchParams();
  const { players: savedPlayers } = usePlayers();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  
  const playerId = params.playerId as string;
  const player = savedPlayers.find(p => p.id === playerId);

  useEffect(() => {
    // In a real implementation, this would fetch matches from the database
    // For now, we'll simulate some match data
    const mockMatches: Match[] = [
      {
        id: '1',
        date: new Date(2025, 4, 5).toISOString(),
        players: [
          { id: playerId, name: player?.name || 'Player', position: 1 },
          { id: '2', name: 'John Doe', position: 2 },
        ],
        gameType: 'x01',
        variant: 501,
        completed: true
      },
      {
        id: '2',
        date: new Date(2025, 4, 3).toISOString(),
        players: [
          { id: '3', name: 'Jane Smith', position: 1 },
          { id: playerId, name: player?.name || 'Player', position: 2 },
        ],
        gameType: 'x01',
        variant: 501,
        completed: true
      },
      {
        id: '3',
        date: new Date(2025, 4, 1).toISOString(),
        players: [
          { id: playerId, name: player?.name || 'Player', position: 1 },
          { id: '4', name: 'Bob Johnson', position: 2 },
          { id: '5', name: 'Alice Brown', position: 3 },
        ],
        gameType: 'cricket',
        completed: true
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setMatches(mockMatches);
      setLoading(false);
    }, 500);
  }, [playerId]);

  const handleClose = () => {
    import('@/utils/navigation').then(({ goBack }) => {
      goBack();
    });
  };

  const handleMatchDetails = (matchId: string) => {
    // In a real implementation, this would navigate to a match details screen
    console.log(`View match details for ${matchId}`);
    // For now, just close the modal
    handleClose();
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (e) {
      return 'Unknown date';
    }
  };

  const renderMatchItem = ({ item }: { item: Match }) => {
    const playerPosition = item.players.find(p => p.id === playerId)?.position || 0;
    const wonMatch = playerPosition === 1;
    const gameTypeLabel = item.gameType === 'x01' 
      ? `${item.variant} X01`
      : 'Cricket';
    
    return (
      <TouchableOpacity 
        onPress={() => handleMatchDetails(item.id)}
        style={styles.matchCard}
      >
        <Card>
          <View style={styles.matchHeader}>
            <View style={styles.matchDateContainer}>
              <Calendar size={16} color={colors.text.secondary} />
              <Text variant="secondary" size="xs" style={styles.dateText}>
                {formatDate(item.date)}
              </Text>
            </View>
            <Text variant="secondary" size="xs">{gameTypeLabel}</Text>
          </View>
          
          <View style={styles.playersList}>
            {item.players.map((p, index) => (
              <View 
                key={p.id}
                style={[
                  styles.playerRow,
                  p.id === playerId && { backgroundColor: colors.background.secondary }
                ]}
              >
                <View style={styles.playerInfo}>
                  {p.position === 1 && (
                    <Trophy size={14} color={colors.brand.success} style={styles.trophyIcon} />
                  )}
                  <Text
                    weight={p.id === playerId ? 'semibold' : 'regular'}
                    style={styles.playerName}
                  >
                    {p.name}
                  </Text>
                </View>
                <ArrowRight size={16} color={colors.text.tertiary} />
              </View>
            ))}
          </View>
          
          <View style={styles.matchResult}>
            <Text 
              size="xs" 
              variant={wonMatch ? 'success' : 'secondary'}
              weight={wonMatch ? 'semibold' : 'regular'}
            >
              {wonMatch ? 'Winner' : `Finished ${playerPosition}${getOrdinalSuffix(playerPosition)}`}
            </Text>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
      <Animated.View 
        entering={SlideInDown.springify().damping(15)}
        style={[styles.modalContainer, { backgroundColor: colors.background.primary }]}
      >
        <View style={styles.modalHeader}>
          <Text size="xl" weight="semibold">Match History</Text>
          <TouchableOpacity 
            onPress={handleClose}
            style={[styles.closeButton, { backgroundColor: colors.background.secondary }]}
          >
            <X size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading matches...</Text>
          </View>
        ) : matches.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text>No match history found</Text>
          </View>
        ) : (
          <FlatList
            data={matches}
            renderItem={renderMatchItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.matchList}
            showsVerticalScrollIndicator={false}
          />
        )}
        
        <View style={styles.actionButtons}>
          <Button
            label="Close"
            variant="secondary"
            onPress={handleClose}
            style={styles.actionButton}
          />
        </View>
      </Animated.View>
    </View>
  );
}

// Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(position: number): string {
  if (position === 1) return 'st';
  if (position === 2) return 'nd';
  if (position === 3) return 'rd';
  return 'th';
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
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchList: {
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  matchCard: {
    marginBottom: spacing.md,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  matchDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dateText: {
    marginLeft: 4,
  },
  playersList: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  playerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: layout.radius.sm,
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerName: {
    marginLeft: spacing.xs,
  },
  trophyIcon: {
    marginRight: spacing.xs,
  },
  matchResult: {
    alignItems: 'flex-end',
    marginTop: spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});