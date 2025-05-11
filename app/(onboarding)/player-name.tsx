import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useState, useMemo } from 'react';
import { useThemeColors } from '@/constants/theme/colors';
import { spacing, layout } from '@/constants/theme';
import { Text } from '@core/atoms/Text';
import { Input } from '@core/atoms/Input';
import { Button } from '@core/atoms/Button';
import { router } from 'expo-router';
import { User, ChevronRight } from 'lucide-react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { useOnboardingStore } from '@/stores/useOnboardingStore';

export default function PlayerNameScreen() {
  const colors = useThemeColors();
  const { setPlayerName } = useOnboardingStore();
  const [playerNameInput, setPlayerNameInput] = useState('');
  const [error, setError] = useState('');

  // Check if the input is valid without setting error (used for conditional rendering)
  const hasValidInput = useMemo(() => {
    return playerNameInput.trim().length > 0;
  }, [playerNameInput]);

  // Validate input and set error if needed
  const validateInput = () => {
    if (!playerNameInput.trim()) {
      setError('Please enter your name');
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validateInput()) {
      // Store player name in the onboarding store
      setPlayerName(playerNameInput.trim());
      // Navigate to the next screen
      router.push('/(onboarding)/auth-options');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background.primary }]}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View 
          entering={SlideInRight.duration(300)}
          style={styles.content}
        >
          <Animated.View 
            entering={FadeIn.delay(200)}
            style={styles.header}
          >
            <Text size="xxl" weight="semibold" align="center">
              What's your name?
            </Text>
            <Text 
              variant="secondary" 
              align="center"
              style={styles.subtitle}
            >
              This will be displayed on your player profile
            </Text>
          </Animated.View>

          <View style={[styles.card, { backgroundColor: colors.background.card.primary }]}>
            <Input
              value={playerNameInput}
              onChangeText={(text) => {
                setPlayerNameInput(text);
                if (error) setError('');
              }}
              placeholder="Your name"
              icon={User}
              error={error}
              autoFocus
            />
          </View>

          <Button
            label="Continue"
            onPress={handleContinue}
            icon={ChevronRight}
            style={styles.button}
            variant={hasValidInput ? "primary" : "secondary"}
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.container,
    gap: spacing.xxl,
  },
  header: {
    gap: spacing.xs,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  card: {
    padding: spacing.xl,
    borderRadius: layout.radius.xl,
    gap: spacing.lg,
  },
  button: {
    alignSelf: 'stretch',
  },
});