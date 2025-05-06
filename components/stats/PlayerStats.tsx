import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { Text } from '@/components/ui/atoms/Text';
import { StatItem } from '../ui/atoms/StatItem';
import { Trophy, Target, Award, Crown, Hash, Percent, Zap, TrendingUp, Timer, BarChart as BarChart3 } from 'lucide-react-native';
import { useThemeColors } from '@/constants/theme/colors';
import { SavedPlayer } from '@/types/game';
import { FadeIn } from 'react-native-reanimated';
import { useState } from 'react';
import { PerformanceSummary } from './components/PerformanceSummary';
import { TrendChart } from './components/TrendChart';
import { Highlights } from './components/Highlights';
import { HighScores } from './components/HighScores';
import { GameHistoryList } from './components/GameHistoryList';
import { Period } from './components/PeriodFilter';
import { StickyHeader } from './components/StickyHeader';

interface PlayerStatsContentProps {
  player: SavedPlayer;
}

type Tab = 'Overview' | 'History' | 'Achievements';

// Main component containing all player stats content with tabs
export function PlayerStatsContent({ player }: PlayerStatsContentProps) {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [period, setPeriod] = useState<Period>('7d');
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  
  const tabs: Tab[] = ['Overview', 'History', 'Achievements'];
  const themedStyles = styles(colors);

  return (
    <View style={{ flex: 1 }}>
      <View style={[themedStyles.tabs, { borderBottomColor: colors.border.primary }]}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              themedStyles.tab,
              activeTab === tab && { borderBottomColor: colors.brand.primary }
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              weight={activeTab === tab ? 'semibold' : 'regular'}
              variant={activeTab === tab ? 'primary' : 'secondary'}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={themedStyles.content}>
        {activeTab === 'Overview' && (
          <View style={{ flex: 1, position: 'relative' }}>
            {/* Fixed position sticky header that appears when scrolling */}
            {isHeaderSticky && (
              <View style={themedStyles.stickyContainer}>
                <StickyHeader
                  player={player}
                  period={period}
                  onPeriodChange={setPeriod}
                  isSticky={true}
                />
              </View>
            )}
            
            <ScrollView 
              style={themedStyles.overview}
              contentContainerStyle={themedStyles.overviewContent}
              scrollEventThrottle={16} // For smooth scroll event handling
              onScroll={(event) => {
                const y = event.nativeEvent.contentOffset.y;
                // Use a threshold for when to show the sticky header
                setIsHeaderSticky(y > 120); 
              }}
            >
              {/* Regular header that's part of scroll content */}
              <StickyHeader
                player={player}
                period={period}
                onPeriodChange={setPeriod}
                isSticky={false}
              />
              
              <PerformanceSummary player={player} period={period} />
              <TrendChart player={player} period={period} />
              <Highlights player={player} period={period} />
              <HighScores player={player} period={period} />
            </ScrollView>
          </View>
        )}
        
        {activeTab === 'History' && (
          <GameHistoryList player={player} />
        )}
        
        {activeTab === 'Achievements' && (
          <View style={themedStyles.comingSoon}>
            <Text variant="secondary" align="center">Achievements coming soon</Text>
          </View>
        )}
      </View>
    </View>
  );
}

// Legacy component - keeping for backwards compatibility
interface PlayerStatsLegacyProps {
  player: any; // Using any to allow for different player types
  showHeader?: boolean;
}

export function PlayerStats({ player, showHeader = true }: PlayerStatsLegacyProps) {
  const colors = useThemeColors();

  const StatGroup = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.statGroup}>
      <Text variant="secondary" size="sm" style={styles.groupTitle}>{title}</Text>
      <View style={styles.groupContent}>
        {children}
      </View>
    </View>
  );

  return (
    <Animated.View entering={FadeIn}>
      {showHeader && (
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <View style={[styles.colorIndicator, { backgroundColor: player.color }]} />
            <View>
              <Text size="lg" weight="semibold">{player.name}</Text>
              <Text variant="secondary" size="sm">
                {player.isGuest ? 'Guest Player' : 'Registered Player'}
              </Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.statsGrid}>
        <StatGroup title="Game Performance">
          <View style={styles.statsRow}>
            <StatItem
              icon={Trophy}
              label="Game Avg"
              value={player.gameAvg?.toFixed(1) || '0.0'}
              color={colors.brand.success}
            />
            <StatItem
              icon={Timer}
              label="First 9"
              value={player.firstNine?.toFixed(1) || '0.0'}
              color={colors.brand.success}
            />
          </View>
          <View style={styles.statsRow}>
            <StatItem
              icon={Award}
              label="Best Leg"
              value={player.bestLegAvg?.toFixed(1) || '0.0'}
              color={colors.brand.success}
            />
            <StatItem
              icon={Crown}
              label="Highest CO"
              value={player.highestCheckout?.toString() || '0'}
              color={colors.brand.success}
            />
          </View>
        </StatGroup>

        <StatGroup title="Win Statistics">
          <View style={styles.statsRow}>
            <StatItem
              icon={Percent}
              label="Win Rate"
              value={`${player.winRate?.toFixed(1) || 0}%`}
              color={colors.brand.primary}
            />
            <StatItem
              icon={Hash}
              label="Games Won"
              value={`${player.gamesWon || 0}/${player.gamesPlayed || 0}`}
              color={colors.brand.primary}
            />
          </View>
          <View style={styles.statsRow}>
            <StatItem
              icon={Target}
              label="Checkout %"
              value={`${player.checkoutPercentage?.toFixed(1) || 0}%`}
              color={colors.brand.primary}
            />
          </View>
        </StatGroup>

        <StatGroup title="Scoring Breakdown">
          <View style={styles.statsRow}>
            <StatItem
              icon={BarChart3}
              label="60+"
              value={player.totalSixtyPlus?.toString() || '0'}
              color={colors.avatar.colors.orange}
            />
            <StatItem
              icon={BarChart3}
              label="80+"
              value={player.totalEightyPlus?.toString() || '0'}
              color={colors.avatar.colors.orange}
            />
          </View>
          <View style={styles.statsRow}>
            <StatItem
              icon={BarChart3}
              label="100+"
              value={player.totalTonPlus?.toString() || '0'}
              color={colors.avatar.colors.orange}
            />
            <StatItem
              icon={Zap}
              label="180s"
              value={player.totalOneEighties?.toString() || '0'}
              color={colors.avatar.colors.orange}
            />
          </View>
        </StatGroup>
      </View>
    </Animated.View>
  );
}

const styles = (colors = useThemeColors()) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  colorIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  statsGrid: {
    gap: spacing.xxxl, // Increased from xxl to xxxl
  },
  statGroup: {
    gap: spacing.lg, // Increased from md to lg
  },
  groupTitle: {
    marginBottom: spacing.sm, // Increased from xs to sm
  },
  groupContent: {
    gap: spacing.lg, // Increased from md to lg
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.lg, // Increased from md to lg
  },
  // Tab styles
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  content: {
    flex: 1,
    gap: spacing.xxxl,
  },
  overview: {
    padding: spacing.lg,
    flex: 1,
  },
  overviewContent: {
    gap: spacing.xxxl,
    paddingBottom: spacing.xxxl,
    paddingTop: 0, // We want the StickyHeader to appear right at the top
  },
  comingSoon: {
    flex: 1,
    padding: spacing.xxxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Sticky container style for the fixed header
  stickyContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
});