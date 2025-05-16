import { View, StyleSheet } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { Users, Plus, GripVertical } from 'lucide-react-native';
import { Card } from '@core/atoms/Card';
import { Button } from '@core/atoms/Button';
import { ListItem } from '@core/molecules/ListItem';
import { Text } from '@core/atoms/Text';
import { useAuth } from '@/hooks/useAuth';
import { useState, useCallback } from 'react';
import { useThemeColors } from '@/constants/theme/colors';
import haptics from '@/utils/haptics';
import DraggableFlatList, { 
  ScaleDecorator, 
  RenderItemParams,
  OpacityDecorator 
} from 'react-native-draggable-flatlist';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PlayerItem {
  id: string;
  name: string;
  color?: string;
  gameAvg?: number;
  checkoutPercentage?: number;
  isGuest?: boolean;
  user_id?: string | null;
}

interface PlayerDetailsCardProps {
  players: PlayerItem[];
  error?: string;
  onRemovePlayer: (id: string) => void;
  onEditPlayer: (player: { id: string; name: string; color?: string }) => void;
  onOpenPlayerDrawer: () => void;
  onReorderPlayers?: (reorderedPlayers: PlayerItem[]) => void;
}

export function PlayerDetailsCard({
  players,
  error,
  onRemovePlayer,
  onEditPlayer,
  onOpenPlayerDrawer,
  onReorderPlayers,
}: PlayerDetailsCardProps) {
  const { session } = useAuth();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const currentUserId = session?.user?.id;

  const formatStats = (gameAvg?: number, checkoutPercentage?: number) => {
    const avg = typeof gameAvg === 'number' ? gameAvg.toFixed(1) : '0.0';
    const checkout = typeof checkoutPercentage === 'number' ? checkoutPercentage.toFixed(1) : '0.0';
    return `${avg} Avg • ${checkout}% Checkout`;
  };

  // Handle drag end event from the flatlist
  const handleDragEnd = useCallback(({ data }: { data: PlayerItem[] }) => {
    if (onReorderPlayers) {
      onReorderPlayers(data);
      haptics.lightImpact();
    }
  }, [onReorderPlayers]);

  // Render each player item
  const renderItem = useCallback(({ item, drag, isActive, getIndex }: RenderItemParams<PlayerItem>) => {
    const index = getIndex() || 0;
    
    return (
      <ScaleDecorator activeScale={1.03}>
        <OpacityDecorator activeOpacity={0.8}>
          <View style={[
            styles.playerItemContainer,
            isActive && { 
              shadowColor: colors.brand.primary,
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 5
            }
          ]}>
            {players.length > 1 && (
              <View 
                style={styles.dragHandle}
              >
                <GripVertical
                  size={16}
                  color={colors.text.secondary}
                  onTouchStart={() => {
                    haptics.selectionFeedback();
                    drag();
                  }}
                />
              </View>
            )}
            
            <View style={styles.playerCard}>
              <ListItem
                title={item.name}
                subtitle={formatStats(item.gameAvg, item.checkoutPercentage)}
                showAvatar
                avatarColor={item.color || '#22C55E'}
                showEdit
                showDelete
                onEdit={() => onEditPlayer(item)}
                onDelete={() => onRemovePlayer(item.id)}
                index={index}
                isOwned={item.user_id === currentUserId}
                isGuest={item.isGuest}
                onPress={undefined} /* Avoid touch conflicts */
              />
            </View>
          </View>
        </OpacityDecorator>
      </ScaleDecorator>
    );
  }, [players.length, colors, currentUserId, onEditPlayer, onRemovePlayer]);

  return (
    <Card
      heading="Player Details"
      subtitle="Select up to 4 players for the game"
      icon={Users}
      showIcon
    >
      <View style={styles.playersContainer}>
        {players.length > 0 ? (
          <DraggableFlatList
            data={players}
            onDragEnd={handleDragEnd}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            containerStyle={styles.listContainer}
            contentContainerStyle={styles.listContent}
            activationDistance={5}
            dragItemOverflow
            scrollEnabled={false}
            autoscrollThreshold={30}
            dragHitSlop={{ top: 5, bottom: 5, left: 10, right: 5 }}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text variant="secondary" align="center">
              No players selected. Add players to start the game.
            </Text>
          </View>
        )}
      </View>

      <View style={[styles.buttonContainer, { paddingBottom: Math.max(insets.bottom / 3, spacing.xs) }]}>
        <Button
          onPress={onOpenPlayerDrawer}
          label="Add Player"
          variant="secondary"
          icon={Plus}
          disabled={players.length >= 4}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  playersContainer: {
    marginBottom: spacing.md,
    minHeight: 70,
  },
  listContainer: {
    width: '100%',
  },
  listContent: {
    gap: spacing.sm,
    paddingTop: 2,
    paddingBottom: 2,
  },
  playerItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0.1,
    elevation: 2,
  },
  dragHandle: {
    height: 54,
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 2,
    paddingHorizontal: 6,
  },
  playerCard: {
    flex: 1,
    borderRadius: layout.radius.md,
    overflow: 'hidden',
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  buttonContainer: {
    width: '100%',
    zIndex: 5,
  },
});