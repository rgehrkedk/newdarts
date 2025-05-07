import { Stack } from 'expo-router';

export default function X01Layout() {
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