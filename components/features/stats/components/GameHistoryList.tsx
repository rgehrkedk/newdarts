import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/core/atoms/Text';
import { Card } from '@/components/core/atoms/Card';
import { Swords, Award, AlertCircle } from 'lucide-react-native';
import { SavedPlayer } from '@/types/game';
import { usePlayerGameHistory, GameHistoryItem as GameHistoryItemType } from '@/hooks/usePlayerGameHistory';

interface GameHistoryItemProps {
  item: GameHistoryItemType;
  player: SavedPlayer;
}

function GameHistoryItem({ item, player }: GameHistoryItemProps) {
  const colors = useThemeColors();
  const { 
    gameType, 
    date, 
    time,
    isWon, 
    average, 
    opponentAverage,
    totalSets,
    totalLegs,
    setsWon,
    legsWon,
    opponent 
  } = item;

  // Determine who had better average
  const playerBetterAvg = average > opponentAverage;
  const maxAverage = Math.max(average, opponentAverage);
  const playerAvgPercentage = maxAverage > 0 ? (average / maxAverage) * 100 : 50;
  const opponentAvgPercentage = maxAverage > 0 ? (opponentAverage / maxAverage) * 100 : 50;
  
  // Set scores
  const playerSets = setsWon;
  const opponentSets = totalSets - setsWon;
  
  return (
    <Card variant="secondary" style={styles.card}>
      <View style={styles.gameHeader}>
        <View style={styles.gameInfo}>
          <View style={[styles.iconContainer, { backgroundColor: colors.background.tertiary }]}>
            {isWon ? (
              <Award size={16} color={colors.brand.success} />
            ) : (
              <Swords size={16} color={colors.brand.primary} />
            )}
          </View>
          <View>
            <Text weight="semibold">{gameType}</Text>
            <View style={styles.gameDetailsRow}>
              <Text variant="secondary" size="xs">Sets: {totalSets} • Legs: {totalLegs}</Text>
            </View>
            <View style={styles.gameDetailsRow}>
              <Text variant="secondary" size="xs">{date} • {time}</Text>
            </View>
          </View>
        </View>
        <View style={[
          styles.status,
          { backgroundColor: isWon ? `${colors.brand.success}20` : `${colors.brand.error}20` }
        ]}>
          <Text
            size="xs"
            style={{ color: isWon ? colors.brand.success : colors.brand.error }}
          >
            {isWon ? 'Won' : 'Lost'}
          </Text>
        </View>
      </View>

      <View style={styles.comparisonStats}>
        <View style={styles.sideBySideStats}>
          <View style={styles.statColumn}>
            <Text variant="secondary" size="xs">Your Avg</Text>
            <Text weight="semibold">{average.toFixed(1)}</Text>
          </View>
          
          <View style={styles.statColumn}>
            <Text variant="secondary" size="xs" style={styles.rightAlignText}>Opponent Avg</Text>
            <Text weight="semibold" style={styles.rightAlignText}>{opponentAverage.toFixed(1)}</Text>
          </View>
        </View>
        
        <View style={[styles.doubleProgressBar, { backgroundColor: colors.background.tertiary }]}>
          <View 
            style={[
              styles.progressFillLeft, 
              { 
                backgroundColor: playerBetterAvg ? colors.brand.success : colors.brand.primary,
                width: `${playerAvgPercentage}%`
              }
            ]} 
          />
          <View 
            style={[
              styles.progressFillRight, 
              { 
                backgroundColor: !playerBetterAvg ? colors.brand.success : colors.brand.error,
                width: `${opponentAvgPercentage}%`
              }
            ]} 
          />
        </View>
      </View>

      <View style={styles.scoreSection}>
        <View style={styles.scoreRow}>
          <Text variant="secondary">Score</Text>
          <Text variant="secondary" weight="semibold">{playerSets} - {opponentSets}</Text>
        </View>
      </View>

      <View style={styles.players}>
        <View style={styles.playerInfo}>
          <View style={styles.playerRow}>
            <View style={[styles.avatar, { backgroundColor: player.color }]}>
              <Text style={styles.avatarText}>{player.name[0]}</Text>
            </View>
            <Text>{player.name}</Text>
          </View>
          <Text variant="secondary" size="xs" style={styles.playerStatus}>
            {isWon ? 'Winner' : ''}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border.primary }]} />

        <View style={[styles.playerInfo, styles.rightAlign]}>
          <View style={[styles.playerRow, styles.rightAlign]}>
            <Text>{opponent.name}</Text>
            <View style={[styles.avatar, { backgroundColor: opponent.color }]}>
              <Text style={styles.avatarText}>{opponent.name[0]}</Text>
            </View>
          </View>
          <Text variant="secondary" size="xs" style={styles.playerStatus}>
            {!isWon ? 'Winner' : ''}
          </Text>
        </View>
      </View>
    </Card>
  );
}

interface GameHistoryListProps {
  player: SavedPlayer;
}

export function GameHistoryList({ player }: GameHistoryListProps) {
  const colors = useThemeColors();
  const { gameHistory, isLoading, error } = usePlayerGameHistory(player);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <AlertCircle size={32} color={colors.brand.error} style={styles.errorIcon} />
        <Text variant="secondary" size="md" align="center">
          Error loading game history
        </Text>
      </View>
    );
  }

  if (gameHistory.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text variant="secondary" size="md" align="center">
          Game history will appear here as you play more games
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={gameHistory}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GameHistoryItem item={item} player={player} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  list: {
    gap: spacing.md,
  },
  errorIcon: {
    marginBottom: spacing.md,
  },
  card: {
    marginBottom: spacing.md,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  gameInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  gameDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  status: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.full,
  },
  stats: {
    marginBottom: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  comparisonStats: {
    marginBottom: spacing.md,
  },
  sideBySideStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  statColumn: {
    flex: 1,
  },
  rightAlignText: {
    textAlign: 'right',
  },
  doubleProgressBar: {
    height: 4,
    borderRadius: 2,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressFillLeft: {
    height: '100%',
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
  },
  progressFillRight: {
    height: '100%',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  scoreSection: {
    marginBottom: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: spacing.sm,
    borderRadius: spacing.sm,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  players: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerInfo: {
    flex: 1,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rightAlign: {
    alignItems: 'flex-end',
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  playerStatus: {
    marginLeft: 32,
  },
  divider: {
    width: 1,
    height: 32,
    marginHorizontal: spacing.md,
  },
});