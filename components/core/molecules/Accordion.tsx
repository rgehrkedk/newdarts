import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { ChevronDown } from 'lucide-react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

interface AccordionProps {
  index?: number;
  isExpanded?: boolean;
  onToggle?: () => void;
  header: React.ReactNode;
  content: React.ReactNode;
  isHighlighted?: boolean;
  highlightColor?: string;
  animationDelay?: number;
}

export function Accordion({
  index = 0,
  isExpanded = false,
  onToggle,
  header,
  content,
  isHighlighted = false,
  highlightColor,
  animationDelay = 0,
}: AccordionProps) {
  const colors = useThemeColors();

  return (
    <Animated.View
      entering={SlideInUp.delay(animationDelay)}
      style={[
        styles.container,
        { 
          backgroundColor: colors.background.card.primary,
          borderColor: isHighlighted ? highlightColor : 'transparent',
          borderWidth: isHighlighted ? 2 : 0,
        }
      ]}
    >
      <TouchableOpacity
        style={styles.header}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          {header}
        </View>
        <Animated.View
          style={[
            styles.chevron,
            { transform: [{ rotate: isExpanded ? '180deg' : '0deg' }] }
          ]}
        >
          <ChevronDown 
            size={20} 
            color={colors.text.secondary}
          />
        </Animated.View>
      </TouchableOpacity>

      {isExpanded && (
        <Animated.View 
          entering={FadeIn}
          style={styles.content}
        >
          {content}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: layout.radius.xl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    marginLeft: spacing.sm,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
});