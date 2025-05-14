import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import ScoreInput from './ScoreInput';
import QuickScoreButtons from './QuickScoreButtons';
import NumberPad from './NumberPad';
import GradientBorderContainer from './GradientBorderContainer';

interface NumberPadSectionProps {
  currentScore: string;
  onNumberPress: (num: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  onQuickScore: (score: string) => void;
  onUndo?: () => void;
  onNext?: () => void;
}

export default function NumberPadSection({
  currentScore,
  onNumberPress,
  onDelete,
  onSubmit,
  onQuickScore,
  onUndo,
  onNext
}: NumberPadSectionProps) {
  const { theme, isDark } = useTheme();
  
  // Define gradient colors based on theme
  const gradientColors = isDark 
    ? [theme.colors.gradient.container.start, theme.colors.gradient.container.end] 
    : [theme.colors.gradient.container.start, theme.colors.gradient.container.end];
  
  return (
    <GradientBorderContainer 
      style={styles(theme).container}
      gradientColors={gradientColors}
      contentBackgroundColor={theme.colors.background.primary}
      gradientStart={{ x: 0, y: 0 }}
      gradientEnd={{ x: 1, y: 1 }}
      gradientOpacity={theme.opacity.subtle}
      borderRadius={theme.borderRadius.xxxl}
    >
      <View style={styles(theme).content}>
        <ScoreInput 
          currentScore={currentScore}
          onUndo={onUndo}
          onNext={onNext}
        />
        
        <QuickScoreButtons onPress={onQuickScore} />
        
        <NumberPad 
          onNumberPress={onNumberPress}
          onDelete={onDelete}
          onSubmit={onSubmit}
        />
      </View>
    </GradientBorderContainer>
  );
}

const styles = (theme: any) => StyleSheet.create({
  container: {
    marginTop: theme.spacing.lg,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  }
});
