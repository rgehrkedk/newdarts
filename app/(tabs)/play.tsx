import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/ui/atoms/Text';
import { Target, Hash } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function Play() {
  const router = useRouter();
  const colors = useThemeColors();

  const games = [
    {
      id: 'x01',
      title: 'X01',
      description: 'Classic darts game. Start with a score and work your way down to zero.',
      icon: Hash,
      route: '/game/setup',
      gradientColors: [colors.brand.primary, colors.brand.primaryGradient],
      overlayColor: `${colors.background.overlay}`,
    },
    {
      id: 'cricket',
      title: 'Cricket',
      description: 'Strategic scoring game. Close numbers and score points.',
      icon: Target,
      route: '/game/setup/cricket',
      gradientColors: [colors.brand.secondary, colors.brand.secondaryGradient],
      overlayColor: `${colors.background.overlay}`,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Text size="xl" weight="semibold" style={styles.title}>Choose Game Type</Text>
      <View style={styles.cardsContainer}>
        {games.map((game, index) => (
          <Animated.View
            key={game.id}
            entering={FadeInDown.delay(index * 200).duration(600)}
            style={styles.cardWrapper}
          >
            <LinearGradient
              colors={game.gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientContainer}
            >
              <Pressable
                style={[
                  styles.card,
                  { backgroundColor: colors.background.card.primary + '80' }
                ]}
                onPress={() => router.push(game.route)}
                android_ripple={{ color: 'rgba(0,0,0,0.1)' }}
              >
                <View style={[styles.overlay, { backgroundColor: game.overlayColor }]} />
                <View style={styles.content}>

                  <Text size="xl" weight="semibold" style={styles.cardTitle}>
                    {game.title}
                  </Text>
                  <Text style={styles.description}>
                    {game.description}
                  </Text>
                </View>
              </Pressable>
            </LinearGradient>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.container,
  },
  title: {
    marginBottom: spacing.xl,
  },
  cardsContainer: {
    gap: spacing.lg,
  },
  cardWrapper: {
    borderRadius: layout.radius.xl,
    overflow: 'hidden',
  },
  gradientContainer: {
    borderRadius: layout.radius.xl,
  },
  card: {
    height: 200,
    margin: spacing.xxs,
    borderRadius: layout.radius.xl,
    overflow: 'hidden',
    backdropFilter: 'blur(20px)',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'flex-end',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {

    marginBottom: spacing.xs,
  },
  description: {

  },
});