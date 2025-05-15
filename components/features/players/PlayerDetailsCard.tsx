import { View, StyleSheet } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { Users, Plus, GripVertical } from 'lucide-react-native';
import { Card } from '@core/atoms/Card';
import { Button } from '@core/atoms/Button';
import { ListItem } from '@core/molecules/ListItem';
import { Text } from '@core/atoms/Text';
import { useAuth } from '@/hooks/useAuth';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS, useDerivedValue, interpolate, withSpring } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useState, useRef, useEffect } from 'react';
import { useThemeColors } from '@/constants/theme/colors';
import { triggerHaptic } from '@/utils/haptics';

interface PlayerDetailsCardProps {
  players: Array<{ 
    id: string; 
    name: string; 
    color?: string; 
    gameAvg?: number; 
    checkoutPercentage?: number; 
    isGuest?: boolean;
    user_id?: string | null;
  }>;
  error?: string;
  onRemovePlayer: (id: string) => void;
  onEditPlayer: (player: { id: string; name: string; color?: string }) => void;
  onOpenPlayerDrawer: () => void;
  onReorderPlayers?: (reorderedPlayers: Array<{ id: string; name: string; color?: string }>) => void;
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
  const currentUserId = session?.user?.id;
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);
  const itemHeight = 70; // Approximate height of a ListItem with padding
  const itemRefs = useRef<Animated.View[]>([]);
  // Create a single translation value for drag gesture
  const translationY = useSharedValue(0);
  
  // Create individual animated styles to avoid hook rule violations
  const animatedStyle0 = useAnimatedStyle(() => ({
    zIndex: draggingIdx === 0 ? 10 : 1,
    shadowOpacity: draggingIdx === 0 ? withTiming(0.2) : withTiming(0),
    transform: [
      { translateY: draggingIdx === 0 ? translationY.value : withSpring(0) },
      { scale: draggingIdx === 0 ? withTiming(1.02) : withTiming(1) }
    ],
  }));
  
  const animatedStyle1 = useAnimatedStyle(() => ({
    zIndex: draggingIdx === 1 ? 10 : 1,
    shadowOpacity: draggingIdx === 1 ? withTiming(0.2) : withTiming(0),
    transform: [
      { translateY: draggingIdx === 1 ? translationY.value : withSpring(0) },
      { scale: draggingIdx === 1 ? withTiming(1.02) : withTiming(1) }
    ],
  }));
  
  const animatedStyle2 = useAnimatedStyle(() => ({
    zIndex: draggingIdx === 2 ? 10 : 1,
    shadowOpacity: draggingIdx === 2 ? withTiming(0.2) : withTiming(0),
    transform: [
      { translateY: draggingIdx === 2 ? translationY.value : withSpring(0) },
      { scale: draggingIdx === 2 ? withTiming(1.02) : withTiming(1) }
    ],
  }));
  
  const animatedStyle3 = useAnimatedStyle(() => ({
    zIndex: draggingIdx === 3 ? 10 : 1,
    shadowOpacity: draggingIdx === 3 ? withTiming(0.2) : withTiming(0),
    transform: [
      { translateY: draggingIdx === 3 ? translationY.value : withSpring(0) },
      { scale: draggingIdx === 3 ? withTiming(1.02) : withTiming(1) }
    ],
  }));
  
  // Map index to the appropriate style
  const getAnimatedStyle = (index: number) => {
    switch(index) {
      case 0: return animatedStyle0;
      case 1: return animatedStyle1;
      case 2: return animatedStyle2;
      case 3: return animatedStyle3;
      default: return animatedStyle0;
    }
  };

  // Initialize refs for items
  useEffect(() => {
    // Make sure we have the right number of refs
    itemRefs.current = itemRefs.current.slice(0, players.length);
    while (itemRefs.current.length < players.length) {
      itemRefs.current.push(null);
    }
  }, [players.length]);  // Update when players change

  const formatStats = (gameAvg?: number, checkoutPercentage?: number) => {
    const avg = typeof gameAvg === 'number' ? gameAvg.toFixed(1) : '0.0';
    const checkout = typeof checkoutPercentage === 'number' ? checkoutPercentage.toFixed(1) : '0.0';
    return `${avg} Avg • ${checkout}% Checkout`;
  };

  const handleDragEnd = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || !onReorderPlayers) return;

    // Provide haptic feedback when order changes
    triggerHaptic('light');

    // Create a new array with the reordered players
    const newPlayers = [...players];
    const [movedPlayer] = newPlayers.splice(fromIndex, 1);
    newPlayers.splice(toIndex, 0, movedPlayer);

    // Call the reorder callback with the new order
    onReorderPlayers(newPlayers);
  };

  return (
    <Card
      heading="Player Details"
      subtitle="Select up to 4 players for the game"
      icon={Users}
      showIcon
    >
      <View style={styles.playersContainer}>
        {players.map((player, index) => {
          // Use the pre-created animated style for this index
          return (
            <Animated.View 
              key={`player-${player.id}-${index}`} 
              style={[styles.playerItem, getAnimatedStyle(index)]}
              ref={ref => {
                if (ref) itemRefs.current[index] = ref;
              }}
            >
              <ListItem
                title={player.name}
                subtitle={formatStats(player.gameAvg, player.checkoutPercentage)}
                showAvatar
                avatarColor={player.color || '#22C55E'}
                showEdit
                showDelete
                onEdit={() => onEditPlayer(player)}
                onDelete={() => onRemovePlayer(player.id)}
                index={index}
                isOwned={player.user_id === currentUserId}
                isGuest={player.isGuest}
                leftContent={
                  onReorderPlayers && players.length > 1 ? (
                    <GestureDetector
                      gesture={Gesture.Pan()
                        .onBegin(() => {
                          setDraggingIdx(index);
                          // Vibration feedback when drag starts
                          runOnJS(triggerHaptic)('light');
                        })
                        .onUpdate((e) => {
                          // Update the drag position
                          translationY.value = e.translationY;
                          
                          // Calculate the potential new index
                          const newIdx = Math.max(
                            0,
                            Math.min(
                              players.length - 1,
                              Math.round((e.translationY + index * itemHeight) / itemHeight)
                            )
                          );
                          
                          // If hovering over a different position, give subtle feedback
                          if (newIdx !== index && e.velocityY !== 0) {
                            runOnJS(triggerHaptic)('selection');
                          }
                        })
                        .onEnd(() => {
                          // Calculate final position and apply reordering
                          const newIdx = Math.max(
                            0,
                            Math.min(
                              players.length - 1,
                              Math.round((translationY.value + index * itemHeight) / itemHeight)
                            )
                          );
                          
                          // Reset translation
                          translationY.value = 0;
                          
                          // Apply the reordering if position changed
                          if (newIdx !== index) {
                            runOnJS(handleDragEnd)(index, newIdx);
                          }
                          
                          // Reset dragging state
                          setDraggingIdx(null);
                        })}
                    >
                      <View style={[styles.dragHandle, { backgroundColor: colors.background.tertiary }]}>
                        <GripVertical size={16} color={colors.text.secondary} />
                      </View>
                    </GestureDetector>
                  ) : undefined
                }
              />
            </Animated.View>
          );
        })}
      </View>

      {players.length === 0 && (
        <View style={styles.emptyState}>
          <Text variant="secondary" align="center">
            No players selected. Add players to start the game.
          </Text>
        </View>
      )}

      <Button
        onPress={onOpenPlayerDrawer}
        label="Add Player"
        variant="secondary"
        icon={Plus}
        disabled={players.length >= 4}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  playersContainer: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  playerItem: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  dragHandle: {
    height: 40,
    width: 24,
    borderRadius: layout.radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
});