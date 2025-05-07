import { View, StyleSheet } from 'react-native';
import { spacing } from '@/constants/theme';
import { Users } from 'lucide-react-native';
import { SavedPlayer } from '@/types/game';
import { Drawer } from '@core/molecules/Drawer';
import { ConfirmDialog } from '@core/molecules/ConfirmDialog';
import { usePlayers } from '@/hooks/usePlayers';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { PlayerList } from './drawer/PlayerList';
import { PlayerForm } from './drawer/PlayerForm';
import { PlayerStatsContent } from '@features/stats/PlayerStats';

interface PlayerDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSelectPlayer: (player: SavedPlayer) => void;
  editingPlayer?: { id: string; name: string; color?: string } | null;
  selectedPlayers?: { id: string; name: string }[];
  selectedPlayer?: SavedPlayer | null;
}

type DrawerStep = 'list' | 'new' | 'edit' | 'stats';

export function PlayerDrawer({ 
  visible, 
  onClose, 
  onSelectPlayer, 
  editingPlayer,
  selectedPlayers = [],
  selectedPlayer = null,
}: PlayerDrawerProps) {
  const { players, loading, error, createPlayer, updatePlayer, deletePlayer } = usePlayers();
  const [step, setStep] = useState<DrawerStep>('list');
  const [navigationStack, setNavigationStack] = useState<DrawerStep[]>(['list']);
  const [playerName, setPlayerName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#22C55E');
  const [editingSavedPlayer, setEditingSavedPlayer] = useState<SavedPlayer | null>(null);
  const [selectedPlayerStats, setSelectedPlayerStats] = useState<SavedPlayer | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { session } = useAuth();
  const currentUserId = session?.user?.id;

  const availablePlayers = players.filter(
    player => !selectedPlayers.some(p => p.id === player.id)
  );

  useEffect(() => {
    if (editingPlayer) {
      setPlayerName(editingPlayer.name);
      setSelectedColor(editingPlayer.color || '#22C55E');
      navigateToStep('edit');
    } else if (selectedPlayer) {
      setSelectedPlayerStats(selectedPlayer);
      navigateToStep('stats');
    } else {
      navigateToStep('list');
    }
  }, [editingPlayer, selectedPlayer]);

  useEffect(() => {
    return () => {
      resetForm();
    };
  }, [visible]);

  const navigateToStep = (newStep: DrawerStep) => {
    setStep(newStep);
    setNavigationStack(prev => [...prev, newStep]);
  };

  const handleBack = () => {
    if (navigationStack.length > 1) {
      const newStack = [...navigationStack];
      newStack.pop();
      const previousStep = newStack[newStack.length - 1];
      setStep(previousStep);
      setNavigationStack(newStack);

      if (previousStep === 'list') {
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setPlayerName('');
    setSelectedColor('#22C55E');
    setStep('list');
    setNavigationStack(['list']);
    setEditingSavedPlayer(null);
    setSelectedPlayerStats(null);
    setIsGuest(false);
    setShowDeleteConfirm(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddNewPlayer = async () => {
    if (!playerName.trim()) return;

    try {
      const newPlayer = await createPlayer({
        name: playerName.trim(),
        color: selectedColor,
        gameAvg: 0,
        checkoutPercentage: 0,
        isGuest,
      });

      onSelectPlayer(newPlayer);
      resetForm();
      onClose();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleEditPlayer = async () => {
    if (!playerName.trim()) return;
    const playerId = editingPlayer?.id || editingSavedPlayer?.id;
    if (!playerId) return;

    try {
      const updatedPlayer = await updatePlayer(playerId, {
        name: playerName.trim(),
        color: selectedColor,
      });

      onSelectPlayer(updatedPlayer);
      resetForm();
      onClose();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleDeletePlayer = async () => {
    const playerId = editingPlayer?.id || editingSavedPlayer?.id;
    if (!playerId) return;
    
    try {
      await deletePlayer(playerId);
      resetForm();
      onClose();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const getDrawerTitle = () => {
    switch (step) {
      case 'new':
        return 'Add New Player';
      case 'edit':
        return 'Edit Player';
      case 'stats':
        return 'Player Profile';
      default:
        return 'Select Player';
    }
  };

  return (
    <>
      <Drawer
        visible={visible}
        onClose={handleClose}
        title={getDrawerTitle()}
        icon={Users}
        onBack={handleBack}
        showBack={navigationStack.length > 1}
        fullHeight={step === 'stats'}
      >
        <View style={styles.content}>
          {step === 'list' && (
            <PlayerList
              players={availablePlayers}
              loading={loading}
              error={error}
              currentUserId={currentUserId}
              onSelectPlayer={onSelectPlayer}
              onEditPlayer={(player) => {
                setEditingSavedPlayer(player);
                setPlayerName(player.name);
                setSelectedColor(player.color);
                navigateToStep('edit');
              }}
              onShowStats={(player) => {
                setSelectedPlayerStats(player);
                navigateToStep('stats');
              }}
              onAddNew={() => navigateToStep('new')}
            />
          )}

          {(step === 'new' || step === 'edit') && (
            <PlayerForm
              name={playerName}
              color={selectedColor}
              isGuest={isGuest}
              isEditing={step === 'edit'}
              onNameChange={setPlayerName}
              onColorChange={setSelectedColor}
              onGuestToggle={() => setIsGuest(!isGuest)}
              onSubmit={step === 'new' ? handleAddNewPlayer : handleEditPlayer}
              onShowStats={editingSavedPlayer ? () => {
                setSelectedPlayerStats(editingSavedPlayer);
                navigateToStep('stats');
              } : undefined}
              onDelete={editingSavedPlayer?.isGuest ? () => setShowDeleteConfirm(true) : undefined}
              player={editingSavedPlayer}
            />
          )}

          {step === 'stats' && selectedPlayerStats && (
            <View style={styles.statsContainer}>
              <PlayerStatsContent player={selectedPlayerStats} />
            </View>
          )}
        </View>
      </Drawer>

      <ConfirmDialog
        visible={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeletePlayer}
        title="Delete Player"
        message="Are you sure you want to delete this player? This action cannot be undone."
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.md,
    flex: 1,
  },
  statsContainer: {
    flex: 1,
    marginHorizontal: -spacing.md, // Remove horizontal padding to match the tabs design


  },
});