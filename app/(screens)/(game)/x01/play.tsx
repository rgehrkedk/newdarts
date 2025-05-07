import { View, StyleSheet, ScrollView, SafeAreaView, Platform, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { ChevronLeft, Moon, Sun } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { PlayerCard } from '@/components/features/game/common/PlayerCard';
import { PlayerStatsCard } from '@/components/features/game/common/PlayerStatsCard';
import { ScoreInput } from '@/components/features/game/common/ScoreInput';
import { 
  CheckoutModal,
  GameCompletionModal,
  LegCompletionModal,
  SetCompletionModal 
} from '@/components/features/game/common/CompletionModals';
import { useGameLogic } from '@/hooks/game/useGameLogic';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { useTheme } from '@/hooks/useTheme';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Player } from '@/types/game';

const isIOS = Platform?.OS === 'ios';

export default function X01Game() {
  const router = useRouter();
  const colors = useThemeColors();
  const { isDark, toggleTheme } = useTheme();
  const params = useLocalSearchParams();
  
  // Initialize game with players and variant from params
  const initialPlayers: Player[] = params.players ? JSON.parse(params.players as string) : [];
  const totalLegs = params.totalLegs ? parseInt(params.totalLegs as string) : 1;
  const totalSets = params.totalSets ? parseInt(params.totalSets as string) : 1;
  const variant = params.variant ? parseInt(params.variant as string) : 501;
  
  const {
    players,
    currentScore,
    error,
    activePlayer,
    winner,
    legWinner,
    setWinner,
    checkoutModalVisible,
    legCompletionVisible,
    setCompletionVisible,
    gameCompletionVisible,
    checkoutOptions,
    pendingScore,
    handleNumberPress,
    handleDelete,
    handleSubmit,
    handleCommonScorePress,
    handleUndo,
    handleNextPlayer,
    handleCheckoutAttempt,
    handleRestart,
    handleHome,
    handleContinue,
  } = useGameLogic(initialPlayers, totalLegs, totalSets, variant);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <KeyboardAvoidingView 
        behavior={isIOS ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
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
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            style={styles.playersContainer}
            entering={FadeIn}
          >
            {players.map((player) => (
              <PlayerCard
                key={player.name}
                name={player.name}
                score={player.score}
                legAvg={player.legAvg}
                isActive={player.isActive}
                legs={player.legs}
                sets={player.sets}
              />
            ))}
          </Animated.View>

          {activePlayer && (
            <PlayerStatsCard 
              key={activePlayer.name} 
              player={activePlayer} 
            />
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <ScoreInput
            currentScore={currentScore}
            error={error}
            onNumberPress={handleNumberPress}
            onDelete={handleDelete}
            onSubmit={handleSubmit}
            onCommonScorePress={handleCommonScorePress}
            onUndo={handleUndo}
            onNextPlayer={handleNextPlayer}
          />
        </View>

        {pendingScore && (
          <CheckoutModal
            visible={checkoutModalVisible}
            options={checkoutOptions}
            onSelect={handleCheckoutAttempt}
            isCheckout={pendingScore.isCheckout}
            score={pendingScore.scored}
          />
        )}

        {winner && (
          <GameCompletionModal
            visible={gameCompletionVisible}
            winner={winner}
            players={players}
            onRestart={handleRestart}
            onHome={handleHome}
          />
        )}

        {legWinner && (
          <LegCompletionModal
            visible={legCompletionVisible}
            winner={legWinner}
            players={players}
            onContinue={handleContinue}
          />
        )}

        {setWinner && (
          <SetCompletionModal
            visible={setCompletionVisible}
            winner={setWinner}
            players={players}
            onContinue={handleContinue}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingTop: isIOS ? 0 : spacing.xl,
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
  inputContainer: {
    paddingBottom: isIOS ? spacing.xl : 0,
  },
});