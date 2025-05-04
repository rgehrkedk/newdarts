import 'react-native-get-random-values'; // Tilføj denne linje
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { useEffect } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeContext, useThemeProvider } from '@/hooks/useTheme';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/providers/AuthProvider';

export default function RootLayout() {
  useFrameworkReady();
  const theme = useThemeProvider();

  const [fontsLoaded] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <AuthProvider>
        <ThemeContext.Provider value={theme}>
          <StatusBar style={theme.isDark ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="auth" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen 
              name="game" 
              options={{ 
                presentation: Platform.select({
                  ios: 'fullScreenModal',
                  default: 'modal'
                })
              }} 
            />
            <Stack.Screen name="+not-found" options={{ presentation: 'modal' }} />
          </Stack>
        </ThemeContext.Provider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});