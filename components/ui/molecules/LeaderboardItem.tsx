// components/ui/molecules/LeaderboardItem.tsx
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '../atoms/Text';
import { Avatar } from '../atoms/Avatar';
import { SavedPlayer, SortCategory } from '@/types/game';
import Animated, { FadeIn } from 'react-native-reanimated';

interface LeaderboardItemProps {
  player: SavedPlayer;
  index: number;
  onPress?: () => void;
  sortBy: SortCategory;
}

export function LeaderboardItem({ 
  player, 
  index, 
  onPress, 
  sortBy 
}: LeaderboardItemProps) {
  const colors = useThemeColors();

  // Get display value based on sort category
  const getStatValue = (): string => {
    switch (sortBy) {
      case 'average':
        return (player.gameAvg || 0).toFixed(1);
      case 'checkout':
        return `${(player.checkoutPercentage || 0).toFixed(1)}%`;
      case 'first9':
        return (player.avgFirstNine || 0).toFixed(1);
      case 'winrate':
        return `${(player.winRate || 0).toFixed(1)}%`;
      case 'games':
        return `${player.gamesPlayed || 0}`;
      case 'highestCheckout':
        return `${player.highestCheckout || 0}`;
      case 'bestLeg':
        return (player.bestLegAvg || 0).toFixed(1);
      case '180s':
        return `${player.totalOneEighties || 0}`;
      default:
        return (player.gameAvg || 0).toFixed(1);
    }
  };

  // Get label for the stat
  const getStatLabel = (): string => {
    switch (sortBy) {
      case 'average':
        return 'avg';
      case 'checkout':
        return 'checkout';
      case 'first9':
        return 'first 9';
      case 'winrate':
        return 'win rate';
      case 'games':
        return 'games';
      case 'highestCheckout':
        return 'high CO';
      case 'bestLeg':
        return 'best leg';
      case '180s':
        return '180s';
      default:
        return 'avg';
    }
  };

  return (
    <Animated.View entering={FadeIn.delay(index * 100)}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.container, { backgroundColor: colors.background.card.primary }]}
      >
        <View style={styles.rankAndContent}>
          <View style={[
            styles.rankContainer, 
            { backgroundColor: index < 3 ? `${player.color}30` : 'transparent' }
          ]}>
            <Text 
              weight="semibold" 
              size="lg" 
              style={[
                styles.rankText, 
                { color: index < 3 ? player.color : colors.text.secondary }
              ]}
            >
              {index + 1}
            </Text>
          </View>

          <View style={styles.content}>
            <Avatar
              name={player.name}
              color={player.color}
              size={40}
              sharedTransitionTag={player.id}
            />

            <View style={styles.textContainer}>
              <Animated.Text 
                style={[styles.name, { color: colors.text.primary }]}
                sharedTransitionTag={`name-${player.id}`}
              >
                {player.name}
              </Animated.Text>
              <Text variant="secondary" size="sm">
                {player.gamesPlayed || 0} games played
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.stats}>
          <Text weight="semibold" style={{ color: colors.brand.primary }}>
            {getStatValue()}
          </Text>
          <Text size="xs" variant="secondary">{getStatLabel()}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: layout.radius.lg,
  },
  rankAndContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  rankText: {
    textAlign: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  // Avatar now uses the Avatar component
  textContainer: {
    gap: spacing.xs,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  stats: {
    alignItems: 'flex-end',
  },
});