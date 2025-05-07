import { Stack } from 'expo-router';
import { useThemeColors } from '@/constants/theme/colors';
import { IconButton } from '@core/atoms/IconButton';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SetupLayout() {
  const colors = useThemeColors();
  const router = useRouter();

  const BackButton = () => (
    <IconButton
      onPress={() => router.back()}
      icon={ChevronLeft}
      variant="transparent"
      size={24}
    />
  );

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
        headerLeft: () => <BackButton />,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'X01 Game',
        }}
      />
      <Stack.Screen
        name="cricket"
        options={{
          title: 'Cricket Game',
        }}
      />
    </Stack>
  );
}