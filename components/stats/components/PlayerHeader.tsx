import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { CreditCard as Edit } from 'lucide-react-native';
import { Text } from '@/components/ui/atoms/Text';
import { Card } from '@/components/ui/atoms/Card';
import { SavedPlayer } from '@/types/game';

interface PlayerHeaderProps {
  player: SavedPlayer;
}

export function PlayerHeader({ player }: PlayerHeaderProps) {
  const colors = useThemeColors();

  return (
    <Card variant="secondary">
      <View style={styles.content}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatar, { backgroundColor: player.color }]}>
            <Text style={styles.avatarText}>{player.name[0].toUpperCase()}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.editButton, { 
              backgroundColor: colors.background.secondary,
              borderColor: player.color,
            }]}
          >
            <Edit size={16} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.info}>
          <Text size="xl" weight="semibold">{player.name}</Text>
          <View style={styles.badges}>
            <View style={[styles.badge, { backgroundColor: colors.background.tertiary }]}>
              <Text variant="secondary" size="xs">
                {player.isGuest ? 'Guest Player' : 'Registered Player'}
              </Text>
            </View>
            <Text variant="secondary" size="xs">•</Text>
            <Text variant="secondary" size="xs">
              {player.gamesPlayed} {player.gamesPlayed === 1 ? 'Game' : 'Games'} Played
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
  },
  editButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  info: {
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
});