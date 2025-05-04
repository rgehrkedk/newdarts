import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/ui/atoms/Text';
import { Input } from '@/components/ui/atoms/Input';
import { Button } from '@/components/ui/atoms/Button';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Lock, LogIn, UserPlus, Zap } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function Auth() {
  const colors = useThemeColors();
  const { signIn, signUp, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleAuth = async () => {
    try {
      setError('');

      if (!validateEmail(email)) {
        setError('Please enter a valid email address');
        return;
      }

      if (!validatePassword(password)) {
        setError('Password must be at least 6 characters long');
        return;
      }

      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleTestLogin = async () => {
    try {
      setError('');
      await signIn('test@example.com', 'password123');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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

          <Animated.View 
            entering={FadeInDown.delay(400)}
            style={[styles.form, { backgroundColor: colors.background.card.primary }]}
          >
            <Input
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              placeholder="Email"
              icon={Mail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={error && !validateEmail(email) ? 'Invalid email address' : undefined}
            />

            <Input
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              placeholder="Password"
              icon={Lock}
              secureTextEntry
              error={error && !validatePassword(password) ? 'Password too short' : undefined}
            />

            {error ? (
              <Text variant="error" align="center">
                {error}
              </Text>
            ) : null}

            <Button
              label={isLogin ? "Sign In" : "Sign Up"}
              onPress={handleAuth}
              loading={isLoading}
              icon={isLogin ? LogIn : UserPlus}
            />

            <Button
              label={isLogin ? "Create Account" : "Back to Login"}
              onPress={() => {
                setIsLogin(!isLogin);
                setError('');
                setEmail('');
                setPassword('');
              }}
              variant="ghost"
            />

            {isLogin && (
              <Button
                label="Quick Test Login"
                onPress={handleTestLogin}
                variant="secondary"
                icon={Zap}
              />
            )}
          </Animated.View>
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
  form: {
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: layout.radius.xl,
  },
});