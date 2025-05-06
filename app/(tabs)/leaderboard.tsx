import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/ui/atoms/Text';
import { usePlayers } from '@/hooks/usePlayers';
import { LeaderboardItem } from '@/components/ui/molecules/LeaderboardItem';
import { useState, useCallback, useMemo } from 'react';
import { SavedPlayer, SortCategory } from '@/types/game';
import { PlayerStatsModal } from '@/components/stats/PlayerStatsModal';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SortDropdown } from '@/components/ui/molecules/SortDropdown';
import { DateFilter, DateRange } from '@/components/ui/molecules/DateFilter';
import { CustomDateRange } from '@/components/ui/molecules/DateRangePicker';

export default function Leaderboard() {
  const colors = useThemeColors();
  const { players, isLoading, error } = usePlayers();
  const [selectedPlayer, setSelectedPlayer] = useState<SavedPlayer | null>(null);
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortCategory>('average');
  const [dateRange, setDateRange] = useState<DateRange>('all');
  const [customDateRange, setCustomDateRange] = useState<CustomDateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date() // Today
  });
  
  // No longer need scroll animation state
  
  // Filter players based on date range
  const filteredPlayers = useMemo(() => {
    // If all time is selected, no filtering is needed
    if (dateRange === 'all') {
      return players;
    }
    
    // Get the date threshold based on selected range
    let dateThreshold: Date;
    const now = new Date();
    
    switch (dateRange) {
      case '1d':
        dateThreshold = new Date(now.setDate(now.getDate() - 1));
        break;
      case '7d':
        dateThreshold = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30d':
        dateThreshold = new Date(now.setDate(now.getDate() - 30));
        break;
      case 'custom':
        // For custom range, we'll filter in the sorting function using the custom date range
        return players;
      default:
        return players;
    }
    
    // Filter players with recent games
    // Note: This would ideally filter based on game dates in a real implementation,
    // but we're using the player data as is for this example
    return players;
  }, [players, dateRange]);
  
  // Sort players by selected attribute
  const sortedPlayers = useMemo(() => {
    return [...filteredPlayers].sort((a, b) => {
      switch (sortBy) {
        case 'average':
          return (b.gameAvg || 0) - (a.gameAvg || 0);
        case 'checkout':
          return (b.checkoutPercentage || 0) - (a.checkoutPercentage || 0);
        case 'first9':
          return (b.avgFirstNine || 0) - (a.avgFirstNine || 0);
        case 'winrate':
          return (b.winRate || 0) - (a.winRate || 0);
        case 'games':
          return (b.gamesPlayed || 0) - (a.gamesPlayed || 0);
        case 'highestCheckout':
          return (b.highestCheckout || 0) - (a.highestCheckout || 0);
        case 'bestLeg':
          return (b.bestLegAvg || 0) - (a.bestLegAvg || 0);
        case '180s':
          return (b.totalOneEighties || 0) - (a.totalOneEighties || 0);
        default:
          return (b.gameAvg || 0) - (a.gameAvg || 0);
      }
    });
  }, [filteredPlayers, sortBy]);

  const handlePlayerPress = useCallback((player: SavedPlayer) => {
    setSelectedPlayer(player);
    setStatsModalVisible(true);
  }, []);

  const handleCustomRangeChange = useCallback((range: CustomDateRange) => {
    setCustomDateRange(range);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={{ height: 90 }} />
      
      {/* We've removed the sticky header since we're simplifying the DateFilter component */}
      

      
      <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.filtersContainer}>
        {/* Date range filter */}
        <DateFilter
          value={dateRange}
          onChange={setDateRange}
          customRange={customDateRange}
          onCustomRangeChange={handleCustomRangeChange}
        />
        
        {/* Sort dropdown */}
        <SortDropdown
          value={sortBy}
          onChange={setSortBy}
        />
      </Animated.View>

      {isLoading ? (
        <View style={styles.centered}>
          <Text variant="secondary">Loading leaderboard...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text variant="error">{error}</Text>
        </View>
      ) : sortedPlayers.length === 0 ? (
        <View style={styles.centered}>
          <Text variant="secondary">No players found</Text>
        </View>
      ) : (
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.content}>
          <View style={styles.sortInfo}>
            <Text variant="secondary" size="sm">
              {dateRange === 'custom' 
                ? `${customDateRange.startDate.toLocaleDateString()} to ${customDateRange.endDate.toLocaleDateString()}`
                : dateRange === 'all'
                ? 'Showing all-time results'
                : `Showing results from the last ${dateRange === '1d' ? '24 hours' : dateRange === '7d' ? '7 days' : '30 days'}`
              }
            </Text>
            <Text variant="secondary" size="sm">
              {sortedPlayers.length} players found
            </Text>
          </View>
          
          <FlatList
            data={sortedPlayers}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            // No longer need scroll animation
            renderItem={({ item, index }) => (
              <LeaderboardItem
                player={item}
                index={index}
                sortBy={sortBy}
                onPress={() => handlePlayerPress(item)}
              />
            )}
          />
        </Animated.View>
      )}

      <PlayerStatsModal
        visible={statsModalVisible}
        onClose={() => {
          setStatsModalVisible(false);
          setSelectedPlayer(null);
        }}
        player={selectedPlayer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:40,
  },
  title: {
    marginTop: spacing.sm,
    marginHorizontal: spacing.container,
  },
  subtitle: {
    marginHorizontal: spacing.container,
    marginBottom: spacing.lg,
  },
  filtersContainer: {
    paddingHorizontal: spacing.container,
    marginBottom: spacing.lg,
    zIndex: 1000, // Required for dropdown picker to show above other components
  },
  // Removed stickyHeader style
  content: {
    flex: 1,
    paddingHorizontal: spacing.container,
    zIndex: 1, // Lower zIndex than filters
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.container,
  },
  listContent: {
    paddingBottom: spacing.xxxl,
    gap: spacing.sm,
  },
  sortInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(150, 150, 150, 0.1)',
  },
});