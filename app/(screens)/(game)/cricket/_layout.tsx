import { Stack } from 'expo-router';

export default function CricketLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="setup" />
      <Stack.Screen 
        name="play" 
        options={{ 
          gestureEnabled: false,
        }} 
      />
    </Stack>
  );
}