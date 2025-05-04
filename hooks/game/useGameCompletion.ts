import { supabase } from '@/lib/supabase';
import { Player } from '@/types/game';

interface GameCompletionProps {
  gameId: string;
  totalLegs: number;
  totalSets: number;
  currentSet: number;
  currentLeg: number;
  variant: number;
}

export function useGameCompletion({
  gameId,
  totalLegs,
  totalSets,
  currentSet,
  currentLeg,
  variant
}: GameCompletionProps) {
  const initializeGame = async (players: Player[]) => {
    try {
      // First, deactivate any existing active games for these players
      const playerIds = players.map(player => player.id);
      
      const { error: deactivateError } = await supabase
        .from('game_participants')
        .update({ is_active: false })
        .in('player_id', playerIds)
        .eq('is_active', true);

      if (deactivateError) throw deactivateError;

      // Create the game
      const { data: game, error: gameError } = await supabase
        .from('games')
        .insert({
          id: gameId,
          game_type: 'x01',
          variant,
          total_legs: totalLegs,
          total_sets: totalSets,
          current_round: 1,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          status: 'in_progress'
        })
        .select()
        .single();

      if (gameError) throw gameError;

      // Add participants
      const participants = players.map(player => ({
        game_id: gameId,
        player_id: player.id,
        starting_score: variant,
        current_score: variant,
        variant,
        is_active: player.isActive,
        turn_scores: [],
        legs_won: 0,
        sets_won: 0,
        leg_average: 0,
        game_average: 0,
        darts_thrown_in_leg: 0,
        total_score_in_leg: 0,
        total_score_thrown: 0,
        checkout_attempts: 0,
        checkout_successes: 0,
        highest_checkout: 0
      }));

      const { error: participantsError } = await supabase
        .from('game_participants')
        .insert(participants);

      if (participantsError) throw participantsError;

      return true;
    } catch (error) {
      console.error('Failed to initialize game:', error);
      return false;
    }
  };

  const handleGameCompletion = async (
    winner: Player,
    players: Player[],
    updatePlayers: (players: Player[]) => void,
    updateGameState: (state: any) => void
  ) => {
    // Validate that winner's score is exactly zero
    if (winner.score !== 0) {
      console.error('Cannot complete game: Winner score is not zero');
      updateGameState({
        error: 'Invalid game completion: Score must be zero',
        isProcessing: false
      });
      return false;
    }

    const updatedPlayers = [...players];
    winner.legs += 1;

    // Get the last score from the winner's turns (this was their checkout score)
    const checkoutScore = winner.turns[0] || 0;

    if (winner.legs >= totalLegs) {
      winner.sets += 1;
      updatedPlayers.forEach(p => p.legs = 0);

      if (winner.sets >= totalSets) {
        try {
          // Update all participants with their final statistics
          for (const player of players) {
            const { error: statsError } = await supabase
              .from('game_participants')
              .update({
                is_active: false,
                won: player.id === winner.id,
                current_score: player.score,
                turn_scores: player.turns,
                legs_won: player.legs,
                sets_won: player.sets,
                leg_average: player.legAvg,
                game_average: player.gameAvg,
                darts_thrown_in_leg: player.dartsThrownThisLeg,
                total_score_in_leg: player.totalScoreThrownThisLeg,
                total_score_thrown: player.totalScoreThrownThisMatch,
                checkout_attempts: player.totalCheckoutAttempts,
                checkout_successes: player.successfulCheckouts,
                highest_checkout: player.id === winner.id ? checkoutScore : 0 // Store the actual checkout score
              })
              .eq('game_id', gameId)
              .eq('player_id', player.id);

            if (statsError) throw statsError;
          }

          // Update game status
          const { error: gameError } = await supabase
            .from('games')
            .update({
              status: 'completed',
              winner_id: winner.id,
              completed_at: new Date().toISOString()
            })
            .eq('id', gameId);

          if (gameError) throw gameError;

          updatePlayers(updatedPlayers);
          updateGameState({
            winner,
            gameCompletionVisible: true,
            isProcessing: false,
            message: `GAME SHOT AND THE MATCH! ${winner.name} wins!`
          });
          return true;
        } catch (error) {
          console.error('Failed to complete game in database:', error);
          updateGameState({
            error: 'Failed to save game completion',
            isProcessing: false
          });
          return false;
        }
      } else {
        updateGameState({
          setWinner: { ...winner },
          setCompletionVisible: true,
          message: `Set ${currentSet} won by ${winner.name}!`,
          currentSet: currentSet + 1,
          currentLeg: 1,
          isProcessing: false
        });
        updatePlayers(updatedPlayers);
        return true;
      }
    } else {
      updateGameState({
        legWinner: { ...winner },
        legCompletionVisible: true,
        message: `Leg ${currentLeg} won by ${winner.name}!`,
        currentLeg: currentLeg + 1,
        isProcessing: false
      });
      updatePlayers(updatedPlayers);
      return true;
    }
  };

  return {
    initializeGame,
    handleGameCompletion
  };
}