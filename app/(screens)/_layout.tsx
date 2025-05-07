import { Stack } from 'expo-router';

export default function ScreensLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(game)" />
      <Stack.Screen name="(players)" />
      <Stack.Screen name="(modals)" />
    </Stack>
  );
}