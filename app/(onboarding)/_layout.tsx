import { Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function OnboardingLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 200,
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});