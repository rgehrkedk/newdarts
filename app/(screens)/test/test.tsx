import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { LeaderboardPlayer, LeaderboardItem } from '@/components/core/molecules';
import { SavedPlayer } from '@/types/game';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { ChipButton, Text } from '@/components/core/atoms';
import { ArrowRight, AlertTriangle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { usePlayers } from '@/hooks/usePlayers';

export default function TestScreen() {
  const colors = useThemeColors();
  const [selectedSortCategory, setSelectedSortCategory] = useState<'average' | 'winrate' | '180s'>('average');
  const { players, loading, error } = usePlayers();

  const handlePlayerPress = (player: SavedPlayer, position: { x: number, y: number, width: number, height: number }) => {
    console.log(`Selected ${player.name}`, position);
    // You would typically use the position info for showing a modal or animation
    alert(`Selected player: ${player.name}`);
  };

  // Sort players based on selected category
  const getSortedPlayers = () => {
    if (!players || players.length === 0) return [];

    return [...players].sort((a, b) => {
      switch (selectedSortCategory) {
        case 'average':
          return (b.gameAvg || 0) - (a.gameAvg || 0);
        case 'winrate':
          return (b.winRate || 0) - (a.winRate || 0);
        case '180s':
          return (b.totalOneEighties || 0) - (a.totalOneEighties || 0);
        default:
          return (b.gameAvg || 0) - (a.gameAvg || 0);
      }
    });
  };

  const topPlayers = getSortedPlayers().slice(0, 3);

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.headerContainer}>
          <Text weight="bold" size="xxl" style={{ color: colors.text.primary }}>
            Darts Leaderboard
          </Text>
          <Text variant="secondary" size="md" style={{ marginTop: spacing.xs }}>
            Top players based on performance
          </Text>
        </Animated.View>

        {/* Leaderboard with New Player Component */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text size="lg" weight="semibold" style={{ color: colors.text.primary }}>
              Leaderboard
            </Text>
            <ChipButton
              onPress={() => console.log('View All pressed')}
              label="View All"
              icon={ArrowRight}
            />
          </View>

          <View style={styles.sortButtons}>
            <ChipButton
              onPress={() => setSelectedSortCategory('average')}
              label="Average"
              variant={selectedSortCategory === 'average' ? 'primary' : 'secondary'}
            />
            <ChipButton
              onPress={() => setSelectedSortCategory('winrate')}
              label="Win Rate"
              variant={selectedSortCategory === 'winrate' ? 'primary' : 'secondary'}
            />
            <ChipButton
              onPress={() => setSelectedSortCategory('180s')}
              label="180s"
              variant={selectedSortCategory === '180s' ? 'primary' : 'secondary'}
            />
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.brand.primary} />
              <Text style={{ marginTop: spacing.md, color: colors.text.secondary }}>
                Loading players...
              </Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <AlertTriangle size={24} color={colors.brand.error} />
              <Text style={{ marginTop: spacing.md, color: colors.text.secondary }}>
                {error}
              </Text>
            </View>
          ) : players.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={{ color: colors.text.secondary }}>
                No players found. Create some players to see them here.
              </Text>
            </View>
          ) : (
            <View style={styles.leaderboard}>
              {topPlayers.map((player, index) => (
                <LeaderboardPlayer
                  key={player.id}
                  player={player}
                  index={index}
                  sortBy={selectedSortCategory}
                  variant="avatar"
                  clean={false} // Use gradient backgrounds
                  activeOpacity={0.3}
                />
              ))}
            </View>
          )}
        </Animated.View>

        {/* Alternative Leaderboard with Gradient Cards */}
        {!loading && !error && players.length > 0 && (
          <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text size="lg" weight="semibold" style={{ color: colors.text.primary }}>
                Alternative Style
              </Text>
              <ChipButton
                onPress={() => console.log('View All pressed')}
                label="View All"
                icon={ArrowRight}
              />
            </View>

            <View style={styles.leaderboard}>
              {topPlayers.map((player, index) => (
                <LeaderboardPlayer
                  key={player.id}
                  player={player}
                  index={index}
                  sortBy={selectedSortCategory}
                  onPress={handlePlayerPress}
                  clean={false} // Use gradient backgrounds
                  variant="neutral"
                  activeVariant="avatar"
                  activeOpacity={0.3}
                />
              ))}
            </View>
          </Animated.View>
        )}

        {/* Primary Brand Leaderboard */}
        {!loading && !error && players.length > 0 && (
          <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text size="lg" weight="semibold" style={{ color: colors.text.primary }}>
                Brand Primary Style
              </Text>
            </View>

            <View style={styles.leaderboard}>
              {topPlayers.slice(0, 2).map((player, index) => (
                <LeaderboardPlayer
                  key={player.id}
                  player={player}
                  index={index}
                  sortBy={selectedSortCategory}
                  onPress={handlePlayerPress}
                  clean={false}
                  variant="primary"
                />
              ))}
            </View>
          </Animated.View>
        )}

        {/* Secondary Brand Leaderboard */}
        {!loading && !error && players.length > 0 && (
          <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text size="lg" weight="semibold" style={{ color: colors.text.primary }}>
                Brand Secondary Style
              </Text>
            </View>

            <View style={styles.leaderboard}>
              {topPlayers.slice(0, 2).map((player, index) => (
                <LeaderboardPlayer
                  key={player.id}
                  player={player}
                  index={index}
                  sortBy={selectedSortCategory}
                  onPress={handlePlayerPress}
                  clean={false}
                  variant="secondary"
                />
              ))}
            </View>
          </Animated.View>
        )}

        {/* Original vs New Comparison */}
        {!loading && !error && players.length > 0 && topPlayers.length > 0 && (
          <Animated.View entering={FadeInDown.delay(700).duration(600)} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text size="lg" weight="semibold" style={{ color: colors.text.primary }}>
                Original vs New
              </Text>
            </View>

            <Text weight="medium" size="sm" style={[{ color: colors.text.secondary, marginBottom: spacing.xs }]}>
              Original LeaderboardItem
            </Text>
            <View style={styles.comparisonItem}>
              <LeaderboardItem
                player={topPlayers[0]}
                index={0}
                sortBy={selectedSortCategory}
                onPress={handlePlayerPress}
              />
            </View>

            <Text weight="medium" size="sm" style={[{ color: colors.text.secondary, marginTop: spacing.md, marginBottom: spacing.xs }]}>
              New LeaderboardPlayer
            </Text>
            <View style={styles.comparisonItem}>
              <LeaderboardPlayer
                player={topPlayers[0]}
                index={0}
                sortBy={selectedSortCategory}
                onPress={handlePlayerPress}
                clean={true}
                variant="avatar"
              />
            </View>
          </Animated.View>
        )}
        
        {/* Interactive Variant Transition Demo */}
        {!loading && !error && players.length > 0 && (
          <Animated.View entering={FadeInDown.delay(800).duration(600)} style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text size="lg" weight="semibold" style={{ color: colors.text.primary }}>
                Interactive Variant Transitions
              </Text>
            </View>
            
            <Text variant="secondary" style={{ marginBottom: spacing.md }}>
              Press and hold to see the variant transition effect
            </Text>
            
            <View style={styles.leaderboard}>
              <Text weight="medium" size="sm" style={[{ color: colors.text.secondary, marginBottom: spacing.xs }]}>
                Neutral → Avatar (Clean)
              </Text>
              <LeaderboardPlayer
                player={topPlayers[0]}
                index={0}
                sortBy={selectedSortCategory}
                onPress={handlePlayerPress}
                variant="neutral"
                activeVariant="avatar"
                clean={true}
                transitionDuration={300}
                activeOpacity={0.85}
              />
              
              <Text weight="medium" size="sm" style={[{ color: colors.text.secondary, marginTop: spacing.md, marginBottom: spacing.xs }]}>
                Neutral → Primary (Gradient)
              </Text>
              <LeaderboardPlayer
                player={topPlayers[0]}
                index={1}
                sortBy={selectedSortCategory}
                onPress={handlePlayerPress}
                variant="neutral"
                activeVariant="primary"
                clean={false}
                transitionDuration={300}
                activeOpacity={0.9}
              />
              
              <Text weight="medium" size="sm" style={[{ color: colors.text.secondary, marginTop: spacing.md, marginBottom: spacing.xs }]}>
                Neutral → Secondary (Gradient)
              </Text>
              <LeaderboardPlayer
                player={topPlayers[0]}
                index={2}
                sortBy={selectedSortCategory}
                onPress={handlePlayerPress}
                variant="neutral"
                activeVariant="secondary"
                clean={false}
                transitionDuration={300}
                activeOpacity={0.9}
              />
            </View>
          </Animated.View>
        )}
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
  content: {
    padding: spacing.container,
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  headerContainer: {
    marginBottom: spacing.md,
  },
  sectionContainer: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  leaderboard: {
    gap: spacing.sm,
  },
  comparisonItem: {
    marginBottom: spacing.xs,
  },
  loadingContainer: {
    padding: spacing.xl * 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: layout.radius.lg,
  },
  errorContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,0,0,0.05)',
    borderRadius: layout.radius.lg,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: layout.radius.lg,
  },
});