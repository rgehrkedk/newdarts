import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/ui/atoms/Text';
import { Avatar } from '@/components/ui/atoms/Avatar';
import { SavedPlayer } from '@/types/game';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/useTheme';
import { PeriodFilter, Period } from './PeriodFilter';
import { PlayerHeader } from './PlayerHeader';

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
  
  // Regular header view
  return (
    <View style={styles.container}>
      <PlayerHeader player={player} />
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
  periodFilterContainer: {
    marginTop: spacing.md,
  },
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
  // Avatar now uses the Avatar component
  compactName: {
    flex: 1,
  },
  compactFilterContainer: {
    flexShrink: 0, // Don't allow this to shrink
    alignItems: 'flex-end',
    width: 170, // Fixed width area for the filter, slightly larger than filter width
  },
});