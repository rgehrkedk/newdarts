import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@core/atoms/Text';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/useTheme';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightContent?: React.ReactNode;
  blurIntensity?: number;
}

export function Header({
  title,
  showBackButton = false,
  onBackPress,
  rightContent,
  blurIntensity = 40,
}: HeaderProps) {
  const colors = useThemeColors();
  const { isDark } = useTheme();
  const router = useRouter();
  
  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  return (
    <BlurView 
      intensity={blurIntensity} 
      tint={isDark ? 'dark' : 'light'}
      style={[styles.container, { 
        backgroundColor: colors.background.secondary + '80',
        borderBottomColor: colors.border.primary,
      }]}
    >
      <View style={styles.headerInner}>
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity 
              onPress={handleBack}
              style={[styles.backButton, { backgroundColor: colors.background.tertiary + '90' }]}
            >
              <ChevronLeft size={20} color={colors.text.primary} />
            </TouchableOpacity>
          )}
          <Text size="xl" weight="semibold" style={styles.headerText}>
            {title}
          </Text>
        </View>
        
        {rightContent && (
          <View style={styles.rightContainer}>
            {rightContent}
          </View>
        )}
      </View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 50, // Space for status bar
    height: 120,
    zIndex: 100,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    borderBottomWidth: 0.5,
    borderRadius: 24,
  },
  headerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});