import 'react-native-get-random-values'; // Tilføj denne linje
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import { useEffect, useState } from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeContext, useThemeProvider } from '@/hooks/useTheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider } from '@/providers/AuthProvider';
import { BasicLoadingScreen } from '@core/organisms/BasicLoadingScreen';
import { useLoadingScreen } from '@/hooks/useLoadingScreen';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function RootLayout() {
  useFrameworkReady();
  const theme = useThemeProvider();
  const { isLoading, hideLoadingScreen, message, showLoadingScreen } = useLoadingScreen();
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Ensure loading screen is shown
        showLoadingScreen('Preparing game...');
        
        // Simulate resource loading
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
        // Hide the native splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  // Handle loading completion
  const handleLoadingComplete = () => {
    // Small delay before hiding the loading screen
    setTimeout(() => {
      hideLoadingScreen();
    }, 500);
  };

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <AuthProvider>
        <ThemeContext.Provider value={theme}>
          <StatusBar style={theme.isDark ? 'light' : 'dark'} translucent={true} />
          
          {/* Loading Screen - Always render but conditionally show */}
          <BasicLoadingScreen 
            onFinish={handleLoadingComplete} 
            message={message} 
          />
          
          {/* Main App Content */}
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(onboarding)" />
            <Stack.Screen name="auth" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(screens)" />
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