import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@core/atoms/Text';
import { useAuth } from '@/hooks/useAuth';
import { AuthForm } from '@features/auth';
import Animated, { FadeIn } from 'react-native-reanimated';

export default function Auth() {
  const colors = useThemeColors();
  const { signIn, signUp, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async (email: string, password: string) => {
    if (isLogin) {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }
  };

  const handleTestLogin = async () => {
    await signIn('test@example.com', 'password123');
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
        <View style={styles.content}>
          <Animated.View 
            entering={FadeIn.delay(200)}
            style={styles.header}
          >
            <Text size="xxl" weight="semibold" align="center">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
            <Text 
              variant="secondary" 
              align="center"
              style={styles.subtitle}
            >
              {isLogin ? 'Sign in to continue' : 'Create an account to get started'}
            </Text>
          </Animated.View>

          <AuthForm
            isLogin={isLogin}
            isLoading={isLoading}
            onToggleMode={() => setIsLogin(!isLogin)}
            onSubmit={handleAuth}
            onTestLogin={handleTestLogin}
          />
        </View>
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
});