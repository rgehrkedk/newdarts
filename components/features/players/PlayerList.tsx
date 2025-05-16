import React, { useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { spacing } from '@/constants/theme';
import { Plus } from 'lucide-react-native';
import { Text } from '@core/atoms/Text';
import { Button } from '@core/atoms/Button';
import { ListItem } from '@core/molecules/ListItem';
import { StickyButtonContainer } from '@core/molecules/StickyButtonContainer';
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
  const scrollViewRef = useRef(null);
  
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
      <View style={styles.container}>
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
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        enableOnAndroid={true}
        extraScrollHeight={120}
        showsVerticalScrollIndicator={false}
        bounces={false}
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
        <View style={{ height: 100 }} />
      </KeyboardAwareScrollView>
      
      <StickyButtonContainer>
        <Button
          label="Add New Player"
          variant="secondary"
          icon={Plus}
          onPress={onAddNew}
        />
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
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.md,
  },
});