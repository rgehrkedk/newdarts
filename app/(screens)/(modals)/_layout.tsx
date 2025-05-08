import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: 'transparentModal',
        animation: 'fade',
        headerShown: false,
      }}
    >
      <Stack.Screen name="game-complete" />
      <Stack.Screen name="leg-complete" />
      <Stack.Screen name="set-complete" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="player-details/[id]" />
      <Stack.Screen name="matches" />
    </Stack>
  );
}