import { useEffect } from 'react';
import { usePlayerStore } from '@/stores/usePlayerStore';
import { useAuth } from '@/hooks/useAuth';

export function usePlayers() {
  const { 
    players,
    fetchPlayers,
    createPlayer,
    updatePlayer,
    deletePlayer,
    supabase
  } = usePlayerStore();
  const { session } = useAuth();

  // Initial fetch when component mounts
  useEffect(() => {
    if (session) {
      fetchPlayers();
    }
  }, [session, fetchPlayers]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel('player_updates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'players'
      }, () => {
        // Refresh player data when any changes occur
        fetchPlayers();
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [session, supabase, fetchPlayers]);

  return {
    players,
    createPlayer,
    updatePlayer,
    deletePlayer,
    loading: usePlayerStore(state => state.isLoading),
    error: usePlayerStore(state => state.error)
  };
}