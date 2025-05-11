import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColors } from '@/constants/theme/colors';
import { spacing, layout } from '@/constants/theme';
import { Text } from '@core/atoms/Text';
import { Button } from '@core/atoms/Button';
import { router, Link } from 'expo-router';
import { Mail, LogIn } from 'lucide-react-native';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useOnboardingStore } from '@/stores/useOnboardingStore';
import { useState } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';

export default function AuthOptionsScreen() {
  const colors = useThemeColors();
  const { playerName } = useOnboardingStore();
  const { signUp, isLoading } = useAuthContext();
  const [error, setError] = useState('');
  
  // For this iteration, we'll mock the auth flows
  // In a real app, these would connect to authentication providers
  
  const handleEmailAuth = () => {
    // Simulate email auth by creating a random account
    const randomEmail = `user${Math.floor(Math.random() * 10000)}@example.com`;
    const password = 'password123';
    
    try {
      // Create account with player name from onboarding
      signUp(randomEmail, password, playerName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <Animated.View 
        entering={SlideInRight.duration(300)}
        style={styles.content}
      >
        <Animated.View 
          entering={FadeIn.delay(200)}
          style={styles.header}
        >
          <Text size="xxl" weight="semibold" align="center">
            Almost there!
          </Text>
          <Text 
            variant="secondary" 
            align="center"
            style={styles.subtitle}
          >
            Choose how you'd like to sign up
          </Text>
        </Animated.View>

        <View style={styles.optionsContainer}>
          <Link href="/(onboarding)/welcome-complete" asChild onPress={handleEmailAuth}>
            <TouchableOpacity style={styles.button}>
              <Button
                label="Continue with Email"
                icon={Mail}
                loading={isLoading}
                onPress={() => {}}
              />
            </TouchableOpacity>
          </Link>
          
          {error ? (
            <Text variant="error" align="center">
              {error}
            </Text>
          ) : null}
          
          <View style={styles.socialButtons}>
            <Link href="/(onboarding)/welcome-complete" asChild>
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: colors.background.card.primary }]}
              >
                <View style={styles.iconContainer}>
                  <GoogleIcon />
                </View>
                <Text>Google</Text>
              </TouchableOpacity>
            </Link>
            
            <Link href="/(onboarding)/welcome-complete" asChild>
              <TouchableOpacity
                style={[styles.socialButton, { backgroundColor: colors.background.card.primary }]}
              >
                <View style={[styles.iconContainer, { backgroundColor: '#000' }]}>
                  <AppleIcon />
                </View>
                <Text>Apple</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          <Text variant="secondary" align="center" style={styles.privacyText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

// Simple SVG icons for Google and Apple
function GoogleIcon() {
  return (
    <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
      <LinearGradient
        colors={['#4285F4', '#34A853', '#FBBC05', '#EA4335']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: 18, height: 18, borderRadius: 9 }}
      />
    </View>
  );
}

function AppleIcon() {
  return (
    <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
      <LogIn size={14} color="#FFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  optionsContainer: {
    gap: spacing.md,
  },
  button: {
    alignSelf: 'stretch',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: spacing.md,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    borderRadius: layout.radius.lg,
    gap: spacing.md,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  privacyText: {
    marginTop: spacing.xl,
    fontSize: 12,
  },
});