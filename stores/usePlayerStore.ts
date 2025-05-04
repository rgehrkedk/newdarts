import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { SavedPlayer } from '@/types/game';

interface PlayerState {
  players: SavedPlayer[];
  isLoading: boolean;
  error: string | null;
  supabase: typeof supabase;
  fetchPlayers: () => Promise<void>;
  createPlayer: (player: Omit<SavedPlayer, 'id'> & { isGuest?: boolean }) => Promise<SavedPlayer>;
  updatePlayer: (id: string, updates: Partial<SavedPlayer>) => Promise<SavedPlayer>;
  deletePlayer: (id: string) => Promise<void>;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  players: [],
  isLoading: false,
  error: null,
  supabase,

  fetchPlayers: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('player_statistics')
        .select('*')
        .order('name');

      if (error) throw error;

      set({
        players: data.map(player => ({
          id: player.id,
          name: player.name,
          color: player.color,
          gameAvg: player.game_avg,
          checkoutPercentage: player.checkout_percentage,
          gamesPlayed: player.games_played,
          gamesWon: player.games_won,
          isGuest: !player.user_id,
          user_id: player.user_id,
          highestCheckout: player.highest_checkout,
          bestLegAvg: player.best_leg_avg,
          winRate: player.win_rate,
        })),
        error: null,
      });
    } catch (err) {
      console.error('Error fetching players:', err);
      set({ error: err instanceof Error ? err.message : 'Failed to fetch players' });
    } finally {
      set({ isLoading: false });
    }
  },

  createPlayer: async (player) => {
    set({ isLoading: true, error: null });
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        throw new Error('Not authenticated');
      }

      const userId = session.data.session.user.id;
      const userEmail = session.data.session.user.email;

      // Only check for existing owned player if creating a non-guest player
      if (!player.isGuest) {
        const { data: existingPlayers, error: queryError } = await supabase
          .from('players')
          .select('id')
          .eq('user_id', userId)
          .limit(1);

        if (queryError) throw queryError;

        if (existingPlayers && existingPlayers.length > 0) {
          throw new Error('You can only have one owned player profile. Create a guest player instead.');
        }
      }

      // Create profile if it doesn't exist
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          username: userEmail?.split('@')[0] || `user_${userId.substring(0, 8)}`,
          display_name: player.name,
        }, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Create player after ensuring profile exists
      const { data, error } = await supabase
        .from('players')
        .insert({
          name: player.name,
          color: player.color,
          game_avg: 0,
          checkout_percentage: 0,
          user_id: player.isGuest ? null : userId,
          created_by: userId,
          is_guest: player.isGuest || false
        })
        .select()
        .single();

      if (error) throw error;

      const newPlayer: SavedPlayer = {
        id: data.id,
        name: data.name,
        color: data.color,
        gameAvg: data.game_avg,
        checkoutPercentage: data.checkout_percentage,
        gamesPlayed: 0,
        gamesWon: 0,
        isGuest: !data.user_id,
        user_id: data.user_id,
        highestCheckout: 0,
        bestLegAvg: 0,
        winRate: 0,
      };

      set(state => ({
        players: [...state.players, newPlayer],
        error: null,
      }));

      return newPlayer;
    } catch (err) {
      console.error('Error creating player:', err);
      const error = err instanceof Error ? err.message : 'Failed to create player';
      set({ error });
      throw new Error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  updatePlayer: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('players')
        .update({
          name: updates.name,
          color: updates.color,
          game_avg: updates.gameAvg,
          checkout_percentage: updates.checkoutPercentage,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedPlayer: SavedPlayer = {
        id: data.id,
        name: data.name,
        color: data.color,
        gameAvg: data.game_avg,
        checkoutPercentage: data.checkout_percentage,
        gamesPlayed: 0,
        gamesWon: 0,
        isGuest: !data.user_id,
        user_id: data.user_id,
        highestCheckout: 0,
        bestLegAvg: 0,
        winRate: 0,
      };

      set(state => ({
        players: state.players.map(p => p.id === id ? updatedPlayer : p),
        error: null,
      }));

      return updatedPlayer;
    } catch (err) {
      console.error('Error updating player:', err);
      const error = err instanceof Error ? err.message : 'Failed to update player';
      set({ error });
      throw new Error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  deletePlayer: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        players: state.players.filter(p => p.id !== id),
        error: null,
      }));
    } catch (err) {
      console.error('Error deleting player:', err);
      const error = err instanceof Error ? err.message : 'Failed to delete player';
      set({ error });
      throw new Error(error);
    } finally {
      set({ isLoading: false });
    }
  },
}));