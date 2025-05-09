import { View, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/core/atoms/Text';
import { Target, Hash } from 'lucide-react-native';
import { GradientCard } from '@/components/core/molecules/GradientCard';
import { navigateToGameSetup } from '@/utils/navigation';

export default function Play() {
  const colors = useThemeColors();

  const games = [
    {
      id: 'x01',
      title: 'X01',
      description: 'Classic darts game. Start with a score and work your way down to zero.',
      icon: Hash,
      gameType: 'x01' as const,
      gradientColors: [colors.brand.primary, colors.brand.primaryGradient],
      overlayColor: `${colors.background.overlay}`,
    },
    {
      id: 'cricket',
      title: 'Cricket',
      description: 'Strategic scoring game. Close numbers and score points.',
      icon: Target,
      gameType: 'cricket' as const,
      gradientColors: [colors.brand.secondary, colors.brand.secondaryGradient],
      overlayColor: `${colors.background.overlay}`,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.contentContainer}>
        <Text size="xl" weight="semibold" style={styles.title}>Choose Game Type</Text>
        <View style={styles.cardsContainer}>
          {games.map((game, index) => (
            <GradientCard
              key={game.id}
              title={game.title}
              description={game.description}
              gradientColors={game.gradientColors}
              overlayColor={game.overlayColor}
              onPress={() => navigateToGameSetup(game.gameType)}
              animationDelay={index * 200}
              icon={game.icon}
              iconSize={24}
              innerTransparency={colors.transparency.mediumLow}
              outerTransparency={colors.transparency.full}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 120, // Fixed padding for all platforms
    paddingHorizontal: spacing.container,
    paddingBottom: spacing.container,
  },
  title: {
    marginBottom: spacing.xl,
  },
  cardsContainer: {
    gap: spacing.lg,
    flex: 1,
  }
});