import { View, Modal, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { X, ChevronLeft } from 'lucide-react-native';
import { Video as LucideIcon } from 'lucide-react-native';
import { Heading3 } from '../atoms/Text';
import Animated, { 
  runOnJS,
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming 
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

interface DrawerProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  onBack?: () => void;
  showBack?: boolean;
  headerContent?: React.ReactNode;
  fullHeight?: boolean;
}

export function Drawer({ 
  visible, 
  onClose, 
  title, 
  icon: Icon, 
  children,
  onBack,
  showBack,
  headerContent,
  fullHeight = false
}: DrawerProps) {
  const colors = useThemeColors();
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 });
    } else {
      translateY.value = withSpring(0, { damping: 50 });
    }
  }, [visible]);

  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
    })
    .onEnd(() => {
      if (translateY.value > -SCREEN_HEIGHT / 3) {
        translateY.value = withTiming(0, {}, () => {
          runOnJS(onClose)();
        });
      } else {
        translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 });
      }
    });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.8)' }]}>
        <GestureDetector gesture={gesture}>
          <Animated.View 
            style={[
              styles.drawer, 
              { backgroundColor: colors.background.primary },
              rBottomSheetStyle
            ]}
          >
            <View style={styles.handle} />
            <View style={[styles.header, { borderBottomColor: colors.border.primary }]}>
              <View style={styles.headerContent}>
                {showBack && (
                  <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <ChevronLeft size={24} color={colors.text.primary} />
                  </TouchableOpacity>
                )}
                {headerContent || (
                  <>
                    {Icon && <Icon size={24} color={colors.brand.primary} />}
                    <Heading3>{title}</Heading3>
                  </>
                )}
              </View>
              <TouchableOpacity onPress={onClose}>
                <X size={24} color={colors.text.primary} />
              </TouchableOpacity>
            </View>
            <View style={[styles.content, fullHeight && styles.fullHeightContent]}>
              {children}
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  drawer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderTopLeftRadius: layout.radius.xl,
    borderTopRightRadius: layout.radius.xl,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignSelf: 'center',
    marginVertical: spacing.sm,
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  backButton: {
    marginRight: spacing.xs,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  fullHeightContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: 0,
  },
});