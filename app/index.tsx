import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function Index() {
  const { session } = useAuth();

  // For debugging - we'll log the session state
  useEffect(() => {
    console.log('Index screen loaded');
    console.log('Session:', session ? 'Logged in' : 'Not logged in');
  }, [session]);

  // Simplified decision flow:
  // 1. If user is authenticated, go to main app
  // 2. If user is not authenticated, go to auth
  
  return session ? (
    <Redirect href="/(tabs)" />
  ) : (
    <Redirect href="/auth" />
  );
}