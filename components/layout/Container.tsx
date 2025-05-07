import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';

interface ContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  padding?: boolean;
  paddingBottom?: boolean;
  paddingTop?: boolean;
  keyboardAvoiding?: boolean;
  contentContainerStyle?: any;
  style?: any;
  safeArea?: boolean;
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
}

export function Container({
  children,
  scroll = false,
  padding = true,
  paddingBottom = true,
  paddingTop = true,
  keyboardAvoiding = false,
  contentContainerStyle,
  style,
  safeArea = true,
  keyboardShouldPersistTaps = 'handled',
}: ContainerProps) {
  const colors = useThemeColors();
  
  const containerStyle = [
    styles.container,
    { backgroundColor: colors.background.primary },
    style
  ];
  
  const contentStyle = [
    padding && styles.padding,
    paddingBottom && styles.paddingBottom,
    paddingTop && styles.paddingTop,
    contentContainerStyle
  ];
  
  // Wrap content in KeyboardAvoidingView if needed
  const Content = () => (
    keyboardAvoiding ? (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {scroll ? (
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={contentStyle}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={contentStyle}>
            {children}
          </View>
        )}
      </KeyboardAvoidingView>
    ) : (
      scroll ? (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={contentStyle}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={contentStyle}>
          {children}
        </View>
      )
    )
  );
  
  // Wrap in SafeAreaView if needed
  return safeArea ? (
    <SafeAreaView style={containerStyle}>
      <Content />
    </SafeAreaView>
  ) : (
    <View style={containerStyle}>
      <Content />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  padding: {
    paddingHorizontal: spacing.container,
  },
  paddingTop: {
    paddingTop: spacing.container,
  },
  paddingBottom: {
    paddingBottom: spacing.container,
  },
});