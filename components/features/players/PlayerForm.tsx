import { View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Keyboard } from 'react-native';
import { spacing } from '@/constants/theme';
import { Text } from '@core/atoms/Text';
import { Input } from '@core/atoms/Input';
import { Button } from '@core/atoms/Button';
import { ColorPicker } from '@core/molecules/ColorPicker';
import { ChartBar as BarChart3, Trash2 } from 'lucide-react-native';
import { useThemeColors } from '@/constants/theme/colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';

// Define the SavedPlayer interface within the component file for portability
interface SavedPlayer {
  id: string;
  name: string;
  color: string;
  isGuest?: boolean;
  user_id?: string | null;
  gameAvg?: number;
  checkoutPercentage?: number;
}

interface PlayerFormProps {
  name: string;
  color: string;
  isGuest: boolean;
  isEditing: boolean;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
  onGuestToggle: () => void;
  onSubmit: () => void;
  onShowStats?: () => void;
  onDelete?: () => void;
  player?: SavedPlayer;
}

export function PlayerForm({
  name,
  color,
  isGuest,
  isEditing,
  onNameChange,
  onColorChange,
  onGuestToggle,
  onSubmit,
  onShowStats,
  onDelete,
  player,
}: PlayerFormProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  // Track keyboard visibility
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);
  
  // Determine padding based on keyboard state and platform
  const keyboardOffset = Platform.OS === 'ios' ? 0 : 0;
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={keyboardOffset}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Input
          value={name}
          onChangeText={onNameChange}
          placeholder="Player Name"
        />
        <ColorPicker
          selectedColor={color}
          onSelectColor={onColorChange}
        />
        {!isEditing && (
          <View style={styles.infoSection}>
            <Text variant="caption" style={styles.guestInfo}>
              Players are created as guests and can be deleted after the game.
            </Text>
          </View>
        )}
        
        {/* Extra padding to ensure content isn't hidden behind button */}
        <View style={{ paddingBottom: 80 + insets.bottom }} />
      </ScrollView>
      
      <View style={[
        styles.stickyContainer, 
        { 
          backgroundColor: colors.background.primary,
          paddingBottom: Math.max(insets.bottom, spacing.sm),
        }
      ]}>
        <View style={styles.actions}>
          <Button
            label={isEditing ? "Save Changes" : "Add Player"}
            variant="primary"
            onPress={onSubmit}
            disabled={!name.trim()}
          />
          {isEditing && (
            <>
              {onShowStats && (
                <Button
                  label="View Stats"
                  variant="secondary"
                  icon={BarChart3}
                  onPress={onShowStats}
                />
              )}
              {onDelete && player?.isGuest && (
                <Button
                  label="Delete Player"
                  variant="error"
                  icon={Trash2}
                  onPress={onDelete}
                />
              )}
            </>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  infoSection: {
    marginTop: spacing.sm,
  },
  guestInfo: {
    marginTop: spacing.xs,
  },
  stickyContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  actions: {
    gap: spacing.md,
  },
});