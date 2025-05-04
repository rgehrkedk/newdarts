import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useEffect } from 'react';
import { router } from 'expo-router';

interface AuthState {
  session: Session | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isLoading: true,
  error: null,

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      if (!data.session) throw new Error('No session returned after sign in');
      
      set({ session: data.session, error: null });
      router.replace('/(tabs)');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (signUpError) throw signUpError;
      if (!user) throw new Error('No user returned after signup');

      // Create profile for new user
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          username: email.split('@')[0],
          display_name: null,
          avatar_url: null,
        });

      if (profileError) throw profileError;
      
      router.replace('/(tabs)');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ session: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      set({ error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    // Initialize auth state
    const initAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        useAuthStore.setState({ session, isLoading: false });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize auth';
        useAuthStore.setState({ error: errorMessage, isLoading: false });
      }
    };

    initAuth();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      useAuthStore.setState({ session, isLoading: false });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return store;
}