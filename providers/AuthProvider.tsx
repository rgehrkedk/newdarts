import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components/ui/atoms/Text';
import { Button } from '@/components/ui/atoms/Button';
import { useAuth } from '@/hooks/useAuth';
import { spacing } from '@/constants/theme';

interface AuthContextType {
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <View style={styles.errorContainer}>
      <Text variant="error" size="lg" weight="semibold">
        Something went wrong
      </Text>
      <Text variant="error" style={styles.errorMessage}>
        {error.message}
      </Text>
      <Button
        label="Try Again"
        onPress={resetError}
        variant="primary"
      />
    </View>
  );
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoading, error, signIn, signUp, signOut } = useAuth();
  const [authError, setAuthError] = useState<Error | null>(null);

  useEffect(() => {
    if (error) {
      setAuthError(new Error(error));
    }
  }, [error]);

  if (authError) {
    return (
      <ErrorFallback
        error={authError}
        resetError={() => setAuthError(null)}
      />
    );
  }

  const value = {
    isLoading,
    error,
    signIn: async (email: string, password: string) => {
      try {
        await signIn(email, password);
      } catch (err) {
        setAuthError(err instanceof Error ? err : new Error('Authentication failed'));
      }
    },
    signUp: async (email: string, password: string) => {
      try {
        await signUp(email, password);
      } catch (err) {
        setAuthError(err instanceof Error ? err : new Error('Registration failed'));
      }
    },
    signOut: async () => {
      try {
        await signOut();
      } catch (err) {
        setAuthError(err instanceof Error ? err : new Error('Sign out failed'));
      }
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.container,
    gap: spacing.md,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});
