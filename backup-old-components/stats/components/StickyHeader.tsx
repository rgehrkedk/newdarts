import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@core/atoms/Text';
import { Avatar } from '@core/atoms/Avatar';
import { SavedPlayer } from '@/types/game';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/useTheme';
import { PeriodFilter, Period } from './PeriodFilter';

interface StickyHeaderProps {
  player: SavedPlayer;
  period: Period;
  onPeriodChange: (period: Period) => void;
  isSticky: boolean;
}

export function StickyHeader({ 
  player, 
  period, 
  onPeriodChange,
  isSticky = false
}: StickyHeaderProps) {
  const colors = useThemeColors();
  const { isDark } = useTheme();

  // Simplified to show either regular or sticky header based on props
  if (isSticky) {
    return (
      <View style={styles.container}>
        <BlurView
          intensity={70}
          tint={isDark ? 'dark' : 'light'}
          style={[styles.blurContainer, { 
            backgroundColor: isDark 
              ? colors.background.primary + 'E6' // 90% opacity
              : colors.background.primary + 'E6' // 90% opacity
          }]}
        >
          <View style={styles.stickyContent}>
            {/* Compact player info */}
            <View style={styles.compactPlayerInfo}>
              <Avatar 
                name={player.name}
                color={player.color}
                size={30}
              />
              <Text weight="semibold" numberOfLines={1} ellipsizeMode="tail" style={styles.compactName}>
                {player.name}
              </Text>
            </View>
            
            {/* Compact period filter */}
            <View style={styles.compactFilterContainer}>
              <PeriodFilter
                value={period}
                onChange={onPeriodChange}
                isSticky={true}
              />
            </View>
          </View>
        </BlurView>
      </View>
    );
  }
  
  // Regular header view with inline player header
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.playerInfoContainer}>
          <Avatar
            name={player.name}
            color={player.color}
            size={64}
            withShadow
          />
          <View style={styles.playerTextInfo}>
            <Text size="xl" weight="semibold">{player.name}</Text>
            <View style={styles.badges}>
              <View style={[styles.badge, { backgroundColor: player.color+'4D' }]}>
                <Text variant="primary" size="xs">
                  {player.isGuest ? 'Guest Player' : 'You'}
                </Text>
              </View>
              <Text variant="secondary" size="xs">•</Text>
              <Text variant="primary" size="xs">
                {player.gamesPlayed} {player.gamesPlayed === 1 ? 'Game' : 'Games'} Played
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.periodFilterContainer}>
        <PeriodFilter
          value={period}
          onChange={onPeriodChange}
          isSticky={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  // Player header styles
  headerContainer: {
    marginVertical: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor: 'transparent',
    borderRadius: layout.radius.lg,
  },
  playerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerTextInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
    flexWrap: 'wrap',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: layout.radius.full,
  },
  // Period filter styles
  periodFilterContainer: {
    marginTop: spacing.md,
  },
  // Sticky header styles
  blurContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  stickyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    height: 52, // Fixed height for consistent appearance
    flexWrap: 'nowrap', // Prevent wrapping to multiple lines
  },
  compactPlayerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '40%', // Ensure name doesn't take too much space
  },
  compactName: {
    flex: 1,
  },
  compactFilterContainer: {
    flexShrink: 0, // Don't allow this to shrink
    alignItems: 'flex-end',
    width: 170, // Fixed width area for the filter, slightly larger than filter width
  },
});