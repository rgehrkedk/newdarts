import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@core/atoms/Text';
import { StatItem } from '@core/atoms/StatItem';
import { Avatar } from '@core/atoms/Avatar';
import { Trophy, Target, Award, Crown, Hash, Percent, Zap, Timer, BarChart3 } from 'lucide-react-native';
import { SavedPlayer, SortCategory } from '@/types/game';
import { GradientCard } from '@core/molecules/GradientCard';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { IconButton } from '@core/atoms/IconButton';
import { LeaderboardPlayer } from '@core/molecules/LeaderboardPlayer';

interface PlayerOverlayProps {
  player: SavedPlayer & { rank?: number };
  onClose: () => void;
}

export function PlayerOverlay({ player, onClose }: PlayerOverlayProps) {
  const colors = useThemeColors();
  const router = useRouter();

  // Format rank suffix for display
  const getRankSuffix = (rank: number): string => {
    if (rank === 1) return 'st';
    if (rank === 2) return 'nd';
    if (rank === 3) return 'rd';
    return 'th';
  };

  const handleViewStats = () => {
    // Navigate to full player stats
    router.push(`/players/stats/${player.id}`);
    onClose();
  };

  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
      style={styles.container}
    >
      <GradientCard
        variant="avatar"
        avatarColor={player.color}
        avatarGradientColor={player.color}
        height={700}
        borderRadius={layout.radius.xl}
        style={styles.card}
      >
        <View style={styles.closeButtonContainer}>
          <IconButton
            icon={X}
            size="sm"
            variant="subtle"
            onPress={onClose}
            style={styles.closeButton}
          />
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
          {/* LeaderboardPlayer at the top */}
          <View style={styles.leaderboardPlayerContainer}>
            <LeaderboardPlayer
              player={player}
              index={player.rank ? player.rank - 1 : 0}
              sortBy={(player.gameAvg ? 'average' : 'games') as SortCategory}
              variant="primary"
              clean={true}
              isPressable={false}
              showRank={false}
            />
          </View>

          {/* Header with player info - kept for shared transition elements */}
          <View style={[styles.header, { opacity: 0, height: 0, overflow: 'hidden', marginBottom: 0 }]}>
            <View style={styles.playerInfoContainer}>
              <Animated.View
                style={styles.avatarContainer}
                sharedTransitionTag={`avatar-container-${player.id}`}
              >
                <Avatar
                  name={player.name}
                  color={player.color}
                  size={60}
                  sharedTransitionTag={`avatar-${player.id}`}
                />
              </Animated.View>

              <View style={styles.nameContainer}>
                <Animated.Text
                  style={[styles.playerName, { color: colors.text.primary }]}
                  sharedTransitionTag={`name-${player.id}`}
                >
                  {player.name}
                </Animated.Text>
                <Text variant="secondary" size="sm">
                  {player.gamesPlayed || 0} games played
                </Text>
              </View>

              {player.rank && (
                <Animated.View
                  style={[
                    styles.rankBadge,
                    { backgroundColor: player.rank <= 3 ? `${player.color}30` : colors.background.secondary }
                  ]}
                  sharedTransitionTag={`rank-${player.id}`}
                >
                  <Text
                    weight="semibold"
                    style={[
                      styles.rankText,
                      { color: player.rank <= 3 ? player.color : colors.text.secondary }
                    ]}
                  >
                    {player.rank}{getRankSuffix(player.rank)}
                  </Text>
                </Animated.View>
              )}
            </View>
          </View>

          {/* Stats Sections */}
          <View style={styles.statsContainer}>
            <StatSection title="Game Performance">
              <View style={styles.statRow}>
                <StatItem
                  icon={Trophy}
                  label="Game Avg"
                  value={(player.gameAvg || 0).toFixed(1)}
                  color={colors.brand.success}
                />
                <StatItem
                  icon={Timer}
                  label="First 9"
                  value={(player.avgFirstNine || 0).toFixed(1)}
                  color={colors.brand.success}
                />
              </View>
              <View style={styles.statRow}>
                <StatItem
                  icon={Award}
                  label="Best Leg"
                  value={(player.bestLegAvg || 0).toFixed(1)}
                  color={colors.brand.success}
                />
                <StatItem
                  icon={Crown}
                  label="Highest CO"
                  value={`${player.highestCheckout || 0}`}
                  color={colors.brand.success}
                />
              </View>
            </StatSection>

            <StatSection title="Win Statistics">
              <View style={styles.statRow}>
                <StatItem
                  icon={Percent}
                  label="Win Rate"
                  value={`${(player.winRate || 0).toFixed(1)}%`}
                  color={colors.brand.primary}
                />
                <StatItem
                  icon={Hash}
                  label="Games Won"
                  value={`${player.gamesWon || 0}/${player.gamesPlayed || 0}`}
                  color={colors.brand.primary}
                />
              </View>
              <View style={styles.statRow}>
                <StatItem
                  icon={Target}
                  label="Checkout %"
                  value={`${(player.checkoutPercentage || 0).toFixed(1)}%`}
                  color={colors.brand.primary}
                />
              </View>
            </StatSection>

            <StatSection title="Scoring Breakdown">
              <View style={styles.statRow}>
                <StatItem
                  icon={BarChart3}
                  label="60+"
                  value={`${player.totalSixtyPlus || 0}`}
                  color={colors.avatar.colors.orange}
                />
                <StatItem
                  icon={BarChart3}
                  label="80+"
                  value={`${player.totalEightyPlus || 0}`}
                  color={colors.avatar.colors.orange}
                />
              </View>
              <View style={styles.statRow}>
                <StatItem
                  icon={BarChart3}
                  label="100+"
                  value={`${player.totalTonPlus || 0}`}
                  color={colors.avatar.colors.orange}
                />
                <StatItem
                  icon={Zap}
                  label="180s"
                  value={`${player.totalOneEighties || 0}`}
                  color={colors.avatar.colors.orange}
                />
              </View>
            </StatSection>
          </View>
          
          {/* View Player Profile button */}
          <TouchableOpacity 
            style={[styles.viewProfileButton, { backgroundColor: player.color }]}
            onPress={handleViewStats}
          >
            <Text color="white" weight="medium">
              View Full Profile
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </GradientCard>
    </Animated.View>
  );
}

// Helper component for stat sections
const StatSection = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const colors = useThemeColors();
  
  return (
    <View style={styles.statSection}>
      <Text variant="secondary" size="sm" style={styles.sectionTitle}>
        {title}
      </Text>
      <View style={[styles.sectionContent, { borderColor: colors.border.primary }]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    width: '100%',
    maxWidth: 360,
    alignSelf: 'center',
  },
  card: {
    width: '100%',
    borderRadius: layout.radius.xl,
    overflow: 'hidden',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    zIndex: 10,
  },
  closeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: layout.radius.full,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingTop: spacing.xl + spacing.md, // Extra padding to account for close button
    gap: spacing.xl,
  },
  leaderboardPlayerContainer: {
    marginBottom: spacing.lg,
  },
  header: {
    marginBottom: spacing.md,
  },
  playerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    borderRadius: 30,
    overflow: 'hidden',
    marginRight: spacing.md,
  },
  nameContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  playerName: {
    fontSize: 20,
    fontWeight: '600',
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 14,
  },
  statsContainer: {
    gap: spacing.xl,
  },
  statSection: {
    gap: spacing.sm,
  },
  sectionTitle: {
    marginBottom: spacing.xs,
  },
  sectionContent: {
    borderWidth: 1,
    borderRadius: layout.radius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  viewProfileButton: {
    padding: spacing.md,
    borderRadius: layout.radius.md,
    alignItems: 'center',
    marginTop: spacing.md,
  },
});