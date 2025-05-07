import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { spacing, layout, typography } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Video as LucideIcon } from 'lucide-react-native';
import Animated, { SlideInRight } from 'react-native-reanimated';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  maxLength?: number;
  icon?: LucideIcon;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  error?: string;
}

export function Input({ 
  value, 
  onChangeText, 
  placeholder,
  maxLength,
  icon: Icon,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error,
}: InputProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.container, 
          { backgroundColor: colors.background.input },
          error && { borderColor: colors.brand.error, borderWidth: 1 }
        ]}
      >
        {Icon && (
          <View style={[styles.iconContainer, { backgroundColor: colors.background.tertiary }]}>
            <Icon size={20} color={colors.text.secondary} />
          </View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.secondary}
          style={[styles.input, { color: colors.text.primary }]}
          maxLength={maxLength}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
      </View>
      {error && (
        <Animated.Text 
          entering={SlideInRight}
          style={[styles.errorText, { color: colors.brand.error }]}
        >
          {error}
        </Animated.Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: layout.radius.lg,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: layout.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: typography.sizes.md,
    fontFamily: typography.families.regular,
  },
  errorText: {
    fontSize: typography.sizes.sm,
    fontFamily: typography.families.regular,
    paddingHorizontal: spacing.sm,
  },
});