import { View, StyleSheet, ScrollView, Platform, Pressable } from 'react-native';
import { ChipButton } from '@/components/ui/atoms/ChipButton';
import { PlayerStatsListItem } from '@/components/ui/molecules/PlayerStatsListItem';
import { Users, TrendingUp, Target, Clock, Swords, Trophy, ArrowRight, Plus } from 'lucide-react-native';
import { usePlayers } from '@/hooks/usePlayers';
import { useState, useEffect } from 'react';
import { PlayerStatsModal } from '@/components/stats/PlayerStatsModal';
import { SavedPlayer } from '@/types/game';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/atoms/Button';
import { useAuth } from '@/hooks/useAuth';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/ui/atoms/Text';
import { StatItem } from '@/components/ui/atoms/StatItem';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();
  const colors = useThemeColors();
  const { session } = useAuth();
  const { players, isLoading, error } = usePlayers();
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [currentUserPlayer, setCurrentUserPlayer] = useState<SavedPlayer | null>(null);
  const [recentProgress, setRecentProgress] = useState({
    type: 'average',
    value: 0,
    period: 'last month'
  });
  const [lastMatch, setLastMatch] = useState({
    result: 'None',
    score: '-',
    opponent: '-',
    average: 0,
    date: 'No recent games'
  });
  const [quickStats, setQuickStats] = useState([
    { label: '180s', value: '0', icon: Target, color: colors.avatar?.purple || colors.brand.primary },
    { label: 'Matches', value: '0', icon: Swords, color: colors.avatar?.blue || colors.brand.primary },
    { label: 'Win Rate', value: '0%', icon: Trophy, color: colors.avatar?.gold?.start || colors.brand.primary }
  ]);

  const topPlayers = [...(players || [])]
    .sort((a, b) => b.gameAvg - a.gameAvg)
    .slice(0, 3);

  // Find the current user's player data
  useEffect(() => {
    if (players && players.length > 0 && session?.user?.id) {
      const userPlayer = players.find(player => player.user_id === session.user.id);
      
      if (userPlayer) {
        setCurrentUserPlayer(userPlayer);
        
        // Update stats with the player data
        setQuickStats([
          { 
            label: '180s', 
            value: userPlayer.totalOneEighties?.toString() || '0', 
            icon: Target, 
            color: colors.avatar?.purple || colors.brand.primary 
          },
          { 
            label: 'Matches', 
            value: userPlayer.gamesPlayed?.toString() || '0', 
            icon: Swords, 
            color: colors.avatar?.blue || colors.brand.primary 
          },
          { 
            label: 'Win Rate', 
            value: `${userPlayer.winRate?.toFixed(0) || 0}%`, 
            icon: Trophy, 
            color: colors.avatar?.gold?.start || colors.brand.primary 
          }
        ]);
        
        // Set recent progress based on trends
        if (userPlayer.gameAvg) {
          setRecentProgress({
            type: 'average',
            value: Math.round((userPlayer.gameAvg * 0.08) * 10) / 10, // Mock trend data as 8% improvement
            period: 'last month'
          });
        }
      }
    }
  }, [players, session, colors.avatar, colors.brand.primary]);
  
  // If the user has game history, update lastMatch
  useEffect(() => {
    const fetchLastGame = async () => {
      if (currentUserPlayer) {
        try {
          const { data, error } = await supabase
            .from('game_participants')
            .select(`
              game_id,
              game_average,
              won,
              legs_won,
              sets_won,
              games (
                id,
                created_at,
                completed_at,
                total_legs,
                total_sets
              )
            `)
            .eq('player_id', currentUserPlayer.id)
            .order('created_at', { ascending: false })
            .limit(1);
            
          if (data && data.length > 0 && data[0].games.completed_at) {
            // Get opponent info
            const { data: opponents } = await supabase
              .from('game_participants')
              .select(`
                player_id,
                game_average,
                legs_won,
                sets_won,
                players (
                  name,
                  color
                )
              `)
              .eq('game_id', data[0].game_id)
              .neq('player_id', currentUserPlayer.id)
              .limit(1);
              
            if (opponents && opponents.length > 0) {
              const gameDate = new Date(data[0].games.created_at);
              const today = new Date();
              
              let dateText = 'Today';
              if (gameDate.getDate() !== today.getDate() || 
                  gameDate.getMonth() !== today.getMonth() || 
                  gameDate.getFullYear() !== today.getFullYear()) {
                dateText = gameDate.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }
              
              setLastMatch({
                result: data[0].won ? 'Won' : 'Lost',
                score: `${data[0].sets_won || 0}-${opponents[0].sets_won || 0}`,
                opponent: opponents[0].players.name,
                average: data[0].game_average || 0,
                date: dateText
              });
            }
          }
        } catch (err) {
          console.error('Error fetching last game:', err);
        }
      }
    };
    
    fetchLastGame();
  }, [currentUserPlayer]);

  const handlePlayerPress = (player) => {
    setSelectedPlayer(player);
    setStatsModalVisible(true);
  };

  const platformSpecificStyles = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background.primary }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: 130, // Account for the blurred header height
        }
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Message */}
      <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.welcomeContainer}>
  <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
    <Text weight="light" variant="secondary" size="xxl" style={{ marginRight: 6 }}>Welcome back,</Text>
    <Text weight="bold" size="xxl">
      {players.find(player => player.user_id === session?.user?.id)?.name || 'Player'}
    </Text>
  </View>
</Animated.View>
      
      {/* Game Buttons */}
      <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.gameButtonsContainer}>
        <Button
          variant="gradient-border-primary"
          label="X01 Game"
          icon={Plus}
          onPress={() => router.push('/game/setup')}
          style={styles.gameButtonFlex}
          android_ripple={{ color: 'rgba(0,0,0,0.05)', borderless: false }}
        />
        
        <Button
          variant="gradient-border-secondary"
          label="Cricket"
          icon={Plus}
          onPress={() => router.push('/game/setup/cricket')}
          style={styles.gameButtonFlex}
          android_ripple={{ color: 'rgba(0,0,0,0.05)', borderless: false }}
        />
      </Animated.View>

      {/* Progress Card */}
      <Animated.View 
        entering={FadeInDown.delay(300).duration(600)} 
        style={[styles.card, { backgroundColor: colors.background.tertiary }, platformSpecificStyles]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.headerWithIcon}>
            <View style={[styles.iconCircle, { backgroundColor: 'rgba(34, 197, 94, 0.2)' }]}>
              <TrendingUp size={20} color={colors.brand.success} />
            </View>
            <Text size="md" weight="semibold">Recent Progress</Text>
          </View>
        </View>
        
        <View style={styles.progressContent}>
          <View>
            <Text size="xxl" weight="semibold" style={{ color: colors.brand.success }}>
              +{recentProgress.value}
            </Text>
            <Text variant="secondary" size="sm">
              Average improvement
            </Text>
          </View>
          <Text variant="secondary" size="sm">
            since {recentProgress.period}
          </Text>
        </View>
      </Animated.View>

      {/* Quick Stats */}
      <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.statsGrid}>
        {quickStats.map((stat, index) => (
          <View
            key={index}
            style={[
              styles.statCard,
              { backgroundColor: colors.background.card.primary },
              platformSpecificStyles
            ]}
          >
            <View style={[styles.statIconCircle, { backgroundColor: `${stat.color}20` }]}>
              <stat.icon size={18} color={stat.color} />
            </View>
            <Text size="xl" weight="semibold">{stat.value}</Text>
            <Text variant="secondary" size="sm">{stat.label}</Text>
          </View>
        ))}
      </Animated.View>

      {/* Last Match */}
      <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.headerWithIcon}>
            <Clock size={20} color={colors.brand.primary} />
            <Text size="md" weight="semibold">Last Match</Text>
          </View>
          <ChipButton 
            onPress={() => router.push('/(tabs)/stats')} 
            label="History" 
            icon={ArrowRight}
          />
        </View>
        
        <Pressable
          style={[styles.card, { backgroundColor: colors.background.tertiary, padding: 0 }, platformSpecificStyles]}
          onPress={() => router.push('/(tabs)/stats')}
          android_ripple={{ color: 'rgba(0,0,0,0.05)', borderless: false }}
        >
          <View style={styles.matchContent}>
            <View style={styles.matchResultContainer}>
              <View>
                <Text 
                  size="lg" 
                  weight="semibold" 
                  style={{ color: lastMatch.result === 'Won' ? colors.brand.success : 
                          lastMatch.result === 'Lost' ? colors.brand.error : colors.text.secondary }}
                >
                  {lastMatch.result}
                </Text>
                <Text variant="secondary" size="sm">vs {lastMatch.opponent}</Text>
              </View>
              <View style={styles.scoreContainer}>
                <Text size="xl" weight="semibold">{lastMatch.score}</Text>
                <Text variant="secondary" size="sm">{lastMatch.average > 0 ? `${lastMatch.average.toFixed(1)} avg` : ''}</Text>
              </View>
            </View>
            <View style={styles.matchDate}>
              <Text variant="secondary" size="xs">{lastMatch.date}</Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>

      {/* Leaderboard */}
      <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.headerWithIcon}>
            <Users size={20} color={colors.brand.primary} />
            <Text size="md" weight="semibold">Top Players</Text>
          </View>
          <ChipButton 
            onPress={() => router.push('/(tabs)/leaderboard')} 
            label="View All" 
            icon={ArrowRight}
          />
        </View>
        
        {isLoading ? (
          <View style={styles.emptyStateContainer}>
            <Text variant="secondary">Loading leaderboard...</Text>
          </View>
        ) : error ? (
          <View style={styles.emptyStateContainer}>
            <Text variant="error">{error}</Text>
          </View>
        ) : topPlayers.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text variant="secondary">No players found</Text>
          </View>
        ) : (
          <View style={styles.leaderboard}>
            {topPlayers.map((player, index) => (
              <PlayerStatsListItem
                key={player.id}
                player={player}
                index={index}
                onPress={() => handlePlayerPress(player)}
              />
            ))}
          </View>
        )}
      </Animated.View>

      <PlayerStatsModal
        visible={statsModalVisible}
        onClose={() => {
          setStatsModalVisible(false);
          setSelectedPlayer(null);
        }}
        player={selectedPlayer}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.container,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  welcomeContainer: {
    marginBottom: spacing.md,
  },

  gameButtonsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  gameButton: {
    flex: 1,
    borderRadius: layout.radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  gameButtonFlex: {
    flex: 1,
  },
  card: {
    borderRadius: layout.radius.xl,
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  headerWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: layout.radius.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  sectionContainer: {
    gap: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  matchContent: {
    padding: spacing.lg,
  },
  matchResultContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  matchDate: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    alignItems: 'flex-end',
  },
  leaderboard: {
    gap: spacing.sm,
  },
  emptyStateContainer: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: layout.radius.lg,
  },
});