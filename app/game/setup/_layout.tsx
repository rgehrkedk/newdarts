import { Stack } from 'expo-router';
import { useThemeColors } from '@/constants/theme/colors';

export default function SetupLayout() {
  const colors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          color: colors.text.primary,
        },
        presentation: 'modal',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'X01 Game',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="cricket"
        options={{
          title: 'Cricket Game',
          headerBackTitle: 'Back',
        }}
      />
    </Stack>
  );
}