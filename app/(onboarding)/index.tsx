import { useEffect } from 'react';
import { Redirect } from 'expo-router';

export default function OnboardingIndex() {
  // Redirects to the welcome screen
  return <Redirect href="/(onboarding)/welcome" />;
}