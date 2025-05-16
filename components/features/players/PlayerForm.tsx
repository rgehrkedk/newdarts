import React, { useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { spacing } from '@/constants/theme';
import { Text } from '@core/atoms/Text';
import { Input } from '@core/atoms/Input';
import { Button } from '@core/atoms/Button';
import { ColorPicker } from '@core/molecules/ColorPicker';
import { StickyButtonContainer } from '@core/molecules/StickyButtonContainer';
import { ChartBar as BarChart3, Trash2 } from 'lucide-react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
  const scrollViewRef = useRef(null);
  
  // Extra offset for button container to ensure it stays above keyboard
  const verticalOffset = Platform.OS === 'ios' ? 120 : 80;
  
  // Prepare button content
  const buttonContent = (
    <>
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
    </>
  );
  
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        extraScrollHeight={verticalOffset}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
        resetScrollToCoords={{ x: 0, y: 0 }}
      >
        <Input
          value={name}
          onChangeText={onNameChange}
          placeholder="Player Name"
          autoFocus={!isEditing}
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
        <View style={{ height: 120 }} />
      </KeyboardAwareScrollView>
      
      {/* Using our new StickyButtonContainer component */}
      <StickyButtonContainer extraBottomPadding={16}>
        {buttonContent}
      </StickyButtonContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  infoSection: {
    marginTop: spacing.md,
  },
  guestInfo: {
    marginTop: spacing.xs,
  },
});