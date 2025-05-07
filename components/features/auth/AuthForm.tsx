import { View, StyleSheet } from 'react-native';
import { useState } from 'react';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@core/atoms/Text';
import { Input } from '@core/atoms/Input';
import { Button } from '@core/atoms/Button';
import { Mail, Lock, LogIn, UserPlus, Zap } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface AuthFormProps {
  isLogin: boolean;
  isLoading: boolean;
  onToggleMode: () => void;
  onSubmit: (email: string, password: string) => Promise<void>;
  onTestLogin?: () => Promise<void>;
}

export function AuthForm({
  isLogin,
  isLoading,
  onToggleMode,
  onSubmit,
  onTestLogin
}: AuthFormProps) {
  const colors = useThemeColors();
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

  const handleSubmit = async () => {
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

      await onSubmit(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
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
        onPress={handleSubmit}
        loading={isLoading}
        icon={isLogin ? LogIn : UserPlus}
      />

      <Button
        label={isLogin ? "Create Account" : "Back to Login"}
        onPress={() => {
          onToggleMode();
          setError('');
          setEmail('');
          setPassword('');
        }}
        variant="ghost"
      />

      {isLogin && onTestLogin && (
        <Button
          label="Quick Test Login"
          onPress={onTestLogin}
          variant="secondary"
          icon={Zap}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: spacing.lg,
    padding: spacing.xl,
    borderRadius: layout.radius.xl,
  },
});