import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { COLORS } from './constants/theme';
import LeaderboardScreen from './screens/LeaderboardScreen';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaProvider>
        <LeaderboardScreen />
        <StatusBar style="light" backgroundColor={COLORS.background} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
