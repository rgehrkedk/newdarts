import { View, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme';
import { Text } from '@/components/core/atoms/Text';
import { Input } from '@/components/core/atoms/Input';
import { Button } from '@/components/core/atoms/Button';
import { ColorPicker } from '@/components/core/molecules/ColorPicker';
import { ChartBar as BarChart3, Trash2 } from 'lucide-react-native';

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
  return (
    <View style={styles.container}>
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
        <View style={styles.guestSection}>
          <Text variant="secondary">Player Type</Text>
          <Button
            label={isGuest ? "Guest Player (Temporary)" : "Owned Player (Permanent)"}
            variant="secondary"
            onPress={onGuestToggle}
          />
          <Text variant="caption" style={styles.guestInfo}>
            {isGuest 
              ? "Guest players are temporary and can be deleted after the game."
              : "You can only have one owned player profile linked to your account."}
          </Text>
        </View>
      )}
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
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  guestSection: {
    gap: spacing.sm,
  },
  guestInfo: {
    marginTop: spacing.xs,
  },
  actions: {
    gap: spacing.md,
  },
});