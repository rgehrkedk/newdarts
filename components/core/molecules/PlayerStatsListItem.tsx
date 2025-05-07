// components/core/molecules/PlayerStatsListItem.tsx
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@core/atoms/Text';
import { SavedPlayer } from '@/types/game';
import Animated, { FadeIn } from 'react-native-reanimated';

interface PlayerStatsListItemProps {
  player: SavedPlayer;
  index?: number;
  onPress?: () => void;
}

export function PlayerStatsListItem({ player, index = 0, onPress }: PlayerStatsListItemProps) {
  const colors = useThemeColors();

  return (
    <Animated.View entering={FadeIn.delay(index * 100)}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.container, { backgroundColor: colors.background.card.primary }]}
      >
        <View style={styles.content}>
          <Animated.View 
            style={[styles.avatar, { backgroundColor: player.color }]}
            sharedTransitionTag={`avatar-${player.id}`}
          >
            <Animated.Text 
              style={[styles.avatarText, { color: colors.white }]}
              sharedTransitionTag={`avatar-text-${player.id}`}
            >
              {player.name.charAt(0).toUpperCase()}
            </Animated.Text>
          </Animated.View>

          <View style={styles.textContainer}>
            <Animated.Text 
              style={[styles.name, { color: colors.text.primary }]}
              sharedTransitionTag={`name-${player.id}`}
            >
              {player.name}
            </Animated.Text>
            <Text variant="secondary" size="sm">
              {player.gamesPlayed} games played
            </Text>
          </View>
        </View>

        <View style={styles.stats}>
          <Text weight="semibold" style={{ color: colors.brand.primary }}>
            {player.gameAvg.toFixed(1)}
          </Text>
          <Text size="xs" variant="secondary">avg</Text>
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
  },
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