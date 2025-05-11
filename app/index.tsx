import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

export default function Index() {
  const { session } = useAuth();
  const { hasCompletedOnboarding } = useOnboardingStore();

  // Decision flow:
  // 1. If user has completed onboarding and is authenticated, go to main app
  // 2. If user has completed onboarding but is not authenticated, go to auth
  // 3. If user hasn't completed onboarding, go to onboarding flow

  if (hasCompletedOnboarding) {
    return session ? (
      <Redirect href="/(tabs)" />
    ) : (
      <Redirect href="/auth" />
    );
  } else {
    return <Redirect href="/(onboarding)" />;
  }
}