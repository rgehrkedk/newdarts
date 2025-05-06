import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Settings, X, User, Trash2, BarChart } from 'lucide-react-native';
import { Text } from '../atoms/Text';
import { Avatar } from '../atoms/Avatar';
import Animated, { FadeIn, runOnJS } from 'react-native-reanimated';
import { useEffect, useRef } from 'react';

interface ListItemProps {
  title: string;
  subtitle?: string;
  onPress?: (event: any) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onStats?: () => void;
  leftIcon?: typeof Settings;
  rightIcon?: typeof Settings;
  avatarColor?: string;
  showAvatar?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showStats?: boolean;
  isOwned?: boolean;
  isGuest?: boolean;
  index?: number;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  style?: any;
  id?: string;
}

export function ListItem({ 
  title, 
  subtitle, 
  onPress, 
  onEdit,
  onDelete,
  onStats,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  avatarColor,
  showAvatar = false,
  showEdit = false,
  showDelete = false,
  showStats = false,
  isOwned = false,
  isGuest = false,
  index = 0,
  leftContent,
  rightContent,
  style,
  id
}: ListItemProps) {
  const colors = useThemeColors();
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Animated.View 
      entering={FadeIn.delay(index * 100).withCallback((finished) => {
        'worklet';
        if (finished && !mounted.current) {
          runOnJS(() => {})();
        }
      })}
    >
      <Container
        onPress={onPress}
        style={[
          styles.container, 
          { backgroundColor: colors.background.card.primary },
          style
        ]}
      >
        <View style={styles.content}>
          {leftContent}
          {showAvatar && (
            <Avatar
              name={title}
              color={avatarColor || colors.avatar.colors.green}
              size={40}
              sharedTransitionTag={id}
            />
          )}
          {LeftIcon && <LeftIcon size={24} color={colors.text.primary} />}
          <View style={styles.textContainer}>
            <View style={styles.titleContainer}>
              <Animated.Text 
                style={[styles.title, { color: colors.text.primary }]}
                sharedTransitionTag={`title-${id}`}
                numberOfLines={1}
              >
                {title}
              </Animated.Text>
              {isOwned && (
                <View style={[styles.ownerBadge, { backgroundColor: colors.brand.primary }]}>
                  <User size={12} color={colors.white} />
                </View>
              )}
            </View>
            {subtitle && (
              <Text variant="secondary" size="sm">{subtitle}</Text>
            )}
          </View>
        </View>

        <View style={styles.actions}>
          {rightContent}
          {showStats && (
            <TouchableOpacity 
              onPress={onStats} 
              style={[styles.actionButton, { backgroundColor: colors.background.tertiary }]}
            >
              <BarChart size={16} color={colors.text.secondary} />
            </TouchableOpacity>
          )}
          {showEdit && (
            <TouchableOpacity 
              onPress={onEdit} 
              style={[styles.actionButton, { backgroundColor: colors.background.tertiary }]}
            >
              <Settings size={16} color={colors.text.secondary} />
            </TouchableOpacity>
          )}
          {showDelete && (
            <TouchableOpacity 
              onPress={onDelete} 
              style={[styles.actionButton, { backgroundColor: colors.background.tertiary }]}
            >
              {isGuest ? (
                <Trash2 size={16} color={colors.brand.error} />
              ) : (
                <X size={16} color={colors.brand.error} />
              )}
            </TouchableOpacity>
          )}
          {RightIcon && <RightIcon size={20} color={colors.text.secondary} />}
        </View>
      </Container>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: layout.radius.lg,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  // Avatar now uses the Avatar component
  textContainer: {
    gap: spacing.xs,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  ownerBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: layout.radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
});