import React from 'react';
import { View, Modal, StyleSheet, ScrollView, Platform } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '../atoms/Text';
import Animated, { FadeIn } from 'react-native-reanimated';

interface BaseModalProps {
  visible: boolean;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  scrollable?: boolean;
  headerComponent?: React.ReactNode;
  animationDelay?: number;
  onClose?: () => void;
}

export function BaseModal({
  visible,
  title,
  children,
  footer,
  scrollable = true,
  headerComponent,
  animationDelay = 0,
  onClose,
}: BaseModalProps) {
  const colors = useThemeColors();

  const Content = scrollable ? ScrollView : View;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <Content style={styles.contentContainer}>
          {(title || headerComponent) && (
            <Animated.View
              entering={FadeIn.delay(animationDelay)}
              style={[styles.header, { backgroundColor: colors.background.primary }]}
            >
              {headerComponent || (
                <Text size="xl" weight="semibold" align="center">{title}</Text>
              )}
            </Animated.View>
          )}

          <Animated.View
            entering={FadeIn.delay(animationDelay + 100)}
            style={styles.content}
          >
            {children}
          </Animated.View>
        </Content>

        {footer && (
          <Animated.View
            entering={FadeIn.delay(animationDelay + 200)}
            style={[styles.footer, { backgroundColor: colors.background.primary }]}
          >
            {footer}
          </Animated.View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? spacing.xxxl : spacing.xxl,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.container,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.container,
  },
  footer: {
    padding: spacing.container,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
});