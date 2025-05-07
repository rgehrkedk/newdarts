import { Stack } from 'expo-router';

export default function GameScreensLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: false,
      animation: 'slide_from_right',
    }}>
      <Stack.Screen name="x01" />
      <Stack.Screen name="cricket" />
    </Stack>
  );
}