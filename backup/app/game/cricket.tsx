import { View, StyleSheet, ScrollView, SafeAreaView, Platform, TouchableOpacity } from 'react-native';
import { ChevronLeft, Moon, Sun } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { useTheme } from '@/hooks/useTheme';
import { CricketPlayerCard } from '@features/game/cricket/CricketPlayerCard';
import { CricketPlayerStats } from '@features/game/cricket/CricketPlayerStats';
import { CricketScoreInput } from '@features/game/cricket/CricketScoreInput';
import { useCricketGame } from '@/hooks/game/useCricketGame';
import { CricketPlayer } from '@/types/cricket';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function CricketGame() {
  const router = useRouter();
  const colors = useThemeColors();
  const { isDark, toggleTheme } = useTheme();
  const params = useLocalSearchParams();

  // Initialize game state from params
  const initialPlayers: CricketPlayer[] = params.players ? JSON.parse(params.players as string) : [];
  const scoringType = (params.scoringType as 'cricket' | 'route') || 'cricket';
  const marksRequired = params.marksRequired ? parseInt(params.marksRequired as string) : 3;

  const {
    players,
    activePlayer,
    selectedNumber,
    currentMarks,
    getNextRequiredNumber,
    calculatePlayerStats,
    getAvailableNumbers,
    handleNumberPress,
    handleDelete,
    handleSubmit,
  } = useCricketGame(initialPlayers, scoringType, marksRequired);

  const { marksPerTurn, marksDifference } = calculatePlayerStats();
  const availableNumbers = getAvailableNumbers();
  const nextRequiredNumber = activePlayer ? getNextRequiredNumber(activePlayer) : null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.background.secondary }]}>
          <ChevronLeft color={colors.text.primary} size={24} />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleTheme} style={[styles.themeButton, { backgroundColor: colors.background.secondary }]}>
          {isDark ? (
            <Sun color={colors.text.primary} size={24} />
          ) : (
            <Moon color={colors.text.primary} size={24} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View 
          style={styles.playersContainer}
          entering={FadeIn}
        >
          {players.map((player) => (
            <CricketPlayerCard
              key={player.id}
              player={player}
              marksRequired={marksRequired}
              nextRequiredNumber={player.isActive ? nextRequiredNumber : null}
            />
          ))}
        </Animated.View>

        {activePlayer && nextRequiredNumber && (
          <CricketPlayerStats
            player={activePlayer}
            marksRequired={marksRequired}
            nextRequiredNumber={nextRequiredNumber}
            currentMarks={currentMarks}
            marksPerTurn={marksPerTurn}
            marksDifference={marksDifference}
          />
        )}
      </ScrollView>

      <CricketScoreInput
        onNumberPress={handleNumberPress}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
        selectedNumber={selectedNumber}
        currentMarks={currentMarks}
        availableNumbers={availableNumbers}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: Platform.OS === 'ios' ? 0 : spacing.xl,
    paddingBottom: spacing.sm,
    height: layout.heights.header,
  },
  backButton: {
    padding: spacing.button.padding,
    borderRadius: layout.radius.md,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButton: {
    padding: spacing.button.padding,
    borderRadius: layout.radius.md,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  playersContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.container,
    gap: spacing.card.gap,
    marginBottom: spacing.md,
  },
});