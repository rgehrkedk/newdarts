import { Stack } from 'expo-router';

export default function PlayersLayout() {
  return (
    <Stack screenOptions={{ 
      headerShown: false,
      animation: 'slide_from_bottom',
    }}>
      <Stack.Screen name="list" />
      <Stack.Screen name="create" />
      <Stack.Screen name="edit/[id]" />
      <Stack.Screen name="stats/[id]" />
    </Stack>
  );
}