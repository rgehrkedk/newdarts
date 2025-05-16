import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@core/atoms/Text';
import { BlurView } from 'expo-blur';
import { useTheme } from '@/hooks/useTheme';
import { ChevronLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export type HeaderVariant = 'default' | 'solid';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightContent?: React.ReactNode;
  blurIntensity?: number;
  variant?: HeaderVariant;
}

export function Header({
  title,
  showBackButton = false,
  onBackPress,
  rightContent,
  blurIntensity = 40,
  variant = 'default',
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

  // Solid variant with centered title
  if (variant === 'solid') {
    return (
      <View 
        style={[styles.container, { 
          backgroundColor: colors.background.primary,
          borderBottomColor: colors.border.primary,
          borderRadius: 0,
        }]}
      >
        <View style={styles.headerInner}>
          {/* Left side with back button */}
          <View style={styles.solidLeft}>
            {showBackButton && (
              <TouchableOpacity 
                onPress={handleBack}
                style={[styles.backButton, { backgroundColor: colors.background.tertiary + '90' }]}
              >
                <ChevronLeft size={20} color={colors.text.primary} />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Center with title */}
          <View style={styles.solidCenter}>
            <Text size="xl" weight="semibold" style={styles.solidHeaderText}>
              {title}
            </Text>
          </View>
          
          {/* Right side with optional content or placeholder */}
          <View style={styles.solidRight}>
            {rightContent ? rightContent : 
              (showBackButton && <View style={styles.backButtonPlaceholder} />)}
          </View>
        </View>
      </View>
    );
  }

  // Default blur variant
  return (
    <BlurView 
      intensity={blurIntensity} 
      tint={isDark ? 'dark' : 'light'}
      style={[styles.container, { 
        backgroundColor: colors.background.secondary + '80',

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
  solidLeft: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  solidCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  solidRight: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  solidHeaderText: {
    textAlign: 'center',
  },
  backButtonPlaceholder: {
    width: 36,
    height: 36,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
});