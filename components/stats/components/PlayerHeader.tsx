import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { CreditCard as Edit } from 'lucide-react-native';
import { Text } from '@/components/ui/atoms/Text';
import { Avatar } from '@/components/ui/atoms/Avatar';
import { SavedPlayer } from '@/types/game';
import { GradientCard } from '@/components/ui/molecules/GradientCard';

interface PlayerHeaderProps {
  player: SavedPlayer;
}

export function PlayerHeader({ player }: PlayerHeaderProps) {
  const colors = useThemeColors();
  
  // Generate gradient colors based on player's color
  const getGradientColors = (baseColor: string) => {
    // Match the player color to our avatar colors to find the gradient pair
    const colorKeys = Object.keys(colors.avatar.colors);
    
    // Default gradient
    let gradientStart = baseColor;
    let gradientEnd = baseColor;
    
    // Try to find matching gradient
    for (const key of colorKeys) {
      if (key.includes('Gradient')) continue; // Skip gradient keys
      if (colors.avatar.colors[key] === baseColor) {
        const gradientKey = `${key}Gradient`;
        if (colors.avatar.colors[gradientKey]) {
          gradientEnd = colors.avatar.colors[gradientKey];
          break;
        }
      }
    }
    
    return [gradientStart, gradientEnd];
  };
  
  const gradientColors = getGradientColors(player.color);
  
  // Custom content component for inside the card
  const PlayerContent = () => (
    <View style={styles.content}>
      <View style={styles.avatarContainer}>
        <Avatar
          name={player.name}
          color={player.color}
          size={64}
          withShadow
        />

      </View>
      <View style={styles.info}>
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
  );

  return (
    <GradientCard
      title=""
      description=""
      gradientColors={gradientColors}
      onPress={() => {}}
      clean={false}
      height={100}
      contentAlignment="center"
      style={styles.card}
      innerTransparency={colors.transparency.high} // 90% opacity
      outerTransparency={colors.transparency.medium} // 80% opacity for the gradient
    >
      <PlayerContent />
    </GradientCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',

  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  // Avatar now uses the Avatar component
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