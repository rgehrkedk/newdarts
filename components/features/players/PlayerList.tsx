import { View, StyleSheet, ScrollView, Platform, KeyboardAvoidingView, Keyboard } from 'react-native';
import { spacing } from '@/constants/theme';
import { Plus } from 'lucide-react-native';
import { Text } from '@core/atoms/Text';
import { Button } from '@core/atoms/Button';
import { ListItem } from '@core/molecules/ListItem';
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

interface PlayerListProps {
  players: SavedPlayer[];
  loading: boolean;
  error: string | null;
  currentUserId: string | null;
  onSelectPlayer: (player: SavedPlayer) => void;
  onEditPlayer: (player: SavedPlayer) => void;
  onShowStats: (player: SavedPlayer) => void;
  onAddNew: () => void;
}

export function PlayerList({
  players,
  loading,
  error,
  currentUserId,
  onSelectPlayer,
  onEditPlayer,
  onShowStats,
  onAddNew,
}: PlayerListProps) {
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
  
  // Style for button container with keyboard awareness
  const buttonContainerStyle = {
    ...styles.stickyButton,
    backgroundColor: colors.background.primary,
    paddingBottom: Math.max(insets.bottom, spacing.sm),
  };
  
  if (loading) {
    return (
      <View style={styles.container}>
        <Text variant="secondary" align="center">Loading players...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text variant="error" align="center">{error}</Text>
      </View>
    );
  }

  if (players.length === 0) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={keyboardOffset}
      >
        <View style={styles.emptyState}>
          <Text variant="secondary" align="center">
            No players found. Create your first player!
          </Text>
          <Button
            label="Add New Player"
            variant="primary"
            icon={Plus}
            onPress={onAddNew}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={keyboardOffset}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {players.map((player, index) => (
          <ListItem
            key={player.id}
            title={player.name}
            showAvatar
            avatarColor={player.color}
            rightIcon={Plus}
            showEdit
            showStats
            onPress={() => onSelectPlayer(player)}
            onEdit={() => onEditPlayer(player)}
            onStats={() => onShowStats(player)}
            index={index}
            isOwned={player.user_id === currentUserId}
            isGuest={player.isGuest}
          />
        ))}
        {/* Add extra space at the bottom to ensure content isn't hidden behind the button */}
        <View style={{ paddingBottom: 80 + insets.bottom }} />
      </ScrollView>
      <View style={buttonContainerStyle}>
        <Button
          label="Add New Player"
          variant="secondary"
          icon={Plus}
          onPress={onAddNew}
        />
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
  },
  emptyState: {
    gap: spacing.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
  stickyButton: {
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
  bottomPadding: {
    paddingBottom: spacing.xxl * 2, // Extra padding at the bottom to ensure content is visible above the sticky button
  },
});