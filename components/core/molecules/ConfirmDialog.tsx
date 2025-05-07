import { View, Modal, StyleSheet } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';
import Animated, { FadeIn } from 'react-native-reanimated';

interface ConfirmDialogProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmDialog({ 
  visible, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel'
}: ConfirmDialogProps) {
  const colors = useThemeColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.8)' }]}>
        <Animated.View 
          entering={FadeIn}
          style={[styles.content, { backgroundColor: colors.background.secondary }]}
        >
          <View style={styles.iconContainer}>
            <AlertTriangle size={32} color={colors.brand.error} />
          </View>
          
          <Text size="xl" weight="semibold" align="center">{title}</Text>
          <Text variant="secondary" align="center" style={styles.message}>
            {message}
          </Text>

          <View style={styles.actions}>
            <Button
              label={cancelLabel}
              variant="ghost"
              onPress={onClose}
            />
            <Button
              label={confirmLabel}
              variant="primary"
              onPress={() => {
                onConfirm();
                onClose();
              }}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.container,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: layout.radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  message: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});