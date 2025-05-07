import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@core/atoms/Text';
import { spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useLoadingScreen } from '@/hooks/useLoadingScreen';
import { Target } from 'lucide-react-native';

interface BasicLoadingScreenProps {
  onFinish?: () => void;
  message?: string;
}

export function BasicLoadingScreen({ onFinish, message = 'Loading...' }: BasicLoadingScreenProps) {
  const colors = useThemeColors();
  const { isDark } = useTheme();
  const { isLoading } = useLoadingScreen();
  
  useEffect(() => {
    if (!isLoading) return;
    
    // Set a timeout to trigger the onFinish callback
    const timer = setTimeout(() => {
      onFinish?.();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [isLoading, onFinish]);
  
  if (!isLoading) {
    return null;
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <LinearGradient
        colors={[
          colors.brand.primary,
          colors.brand.secondary,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Target icon without animations */}
          <View style={styles.iconContainer}>
            <Target size={100} color={isDark ? colors.white : colors.white} />
          </View>
          
          {/* Loading indicator */}
          <ActivityIndicator 
            size="large" 
            color={isDark ? colors.white : colors.white} 
            style={styles.loadingIndicator}
          />
          
          {/* App name and message */}
          <View style={styles.textContainer}>
            <Text size="2xl" weight="bold" style={{ color: colors.white, textAlign: 'center' }}>
              NewDarts
            </Text>
            <Text size="md" weight="regular" style={{ color: colors.white, textAlign: 'center', marginTop: spacing.sm }}>
              {message}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 9999,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIndicator: {
    marginTop: spacing.xl,
  },
  textContainer: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
});