import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SavedPlayer } from '@/types/game';

export interface GameHistoryItem {
  id: string;
  gameType: string;
  variant: number;
  date: string;
  time: string;
  isWon: boolean;
  average: number;
  opponentAverage: number;
  totalSets: number;
  totalLegs: number;
  setsWon: number;
  legsWon: number;
  opponent: {
    name: string;
    color: string;
  };
}

export function usePlayerGameHistory(player: SavedPlayer | null) {
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!player) return;

    const fetchGameHistory = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First get all games this player participated in
        const { data: participations, error: participationsError } = await supabase
          .from('game_participants')
          .select(`
            game_id,
            game_average,
            won,
            legs_won,
            sets_won,
            games (
              id,
              game_type,
              variant,
              created_at,
              completed_at,
              winner_id,
              total_legs,
              total_sets
            )
          `)
          .eq('player_id', player.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (participationsError) throw participationsError;
        
        if (!participations || participations.length === 0) {
          setGameHistory([]);
          return;
        }

        // Now for each game, we need to find the opponent
        const gameHistoryItems: GameHistoryItem[] = [];
        
        for (const participation of participations) {
          // Skip games that aren't completed
          if (!participation.games.completed_at) continue;
          
          // Get opponents for this game
          const { data: opponents, error: opponentsError } = await supabase
            .from('game_participants')
            .select(`
              player_id,
              game_average,
              legs_won,
              sets_won,
              players (
                name,
                color
              )
            `)
            .eq('game_id', participation.game_id)
            .neq('player_id', player.id)
            .limit(1); // Just get the first opponent for simplicity
            
          if (opponentsError) throw opponentsError;
          
          if (opponents && opponents.length > 0) {
            const opponent = opponents[0];
            
            // Format the date and time
            const gameDate = new Date(participation.games.created_at);
            const formattedDate = gameDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            });
            const formattedTime = gameDate.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            });
            
            // Map the variant number to a game type string
            let gameTypeStr = 'X01 Game';
            if (participation.games.variant === 501) {
              gameTypeStr = '501 Game';
            } else if (participation.games.variant === 301) {
              gameTypeStr = '301 Game';
            } else if (participation.games.variant === 701) {
              gameTypeStr = '701 Game';
            }
            
            gameHistoryItems.push({
              id: participation.game_id,
              gameType: gameTypeStr,
              variant: participation.games.variant,
              date: formattedDate,
              time: formattedTime,
              totalSets: participation.games.total_sets || 1,
              totalLegs: participation.games.total_legs || 3,
              setsWon: participation.sets_won || 0,
              legsWon: participation.legs_won || 0,
              isWon: participation.won || false,
              average: participation.game_average || 0,
              opponentAverage: opponent.game_average || 0,
              opponent: {
                name: opponent.players.name,
                color: opponent.players.color
              }
            });
          }
        }
        
        setGameHistory(gameHistoryItems);
      } catch (err) {
        console.error('Error fetching game history:', err);
        setError('Failed to load game history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGameHistory();
  }, [player]);

  return { gameHistory, isLoading, error };
}