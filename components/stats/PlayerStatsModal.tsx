import { View, Modal, StyleSheet, SafeAreaView } from 'react-native';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { ChevronLeft, MoreVertical } from 'lucide-react-native';
import { Text } from '@/components/ui/atoms/Text';
import { IconButton } from '@/components/ui/atoms/IconButton';
import { SavedPlayer } from '@/types/game';
import { PlayerStatsContent } from './PlayerStats';

interface PlayerStatsModalProps {
  visible: boolean;
  onClose: () => void;
  player: SavedPlayer | null;
  onOptionsPress?: () => void;
}

type Tab = 'Overview' | 'History' | 'Achievements';

export function PlayerStatsModal({ visible, onClose, player, onOptionsPress }: PlayerStatsModalProps) {
  const colors = useThemeColors();
  
  if (!player) return null;

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border.primary }]}>
          <View style={styles.headerLeftContainer}>
            <IconButton 
              onPress={onClose} 
              icon={ChevronLeft}
              variant="secondary"
              size={20}
              style={styles.headerButton}
            />
          </View>
          <Text size="lg" weight="semibold">Player Profile</Text>
          <View style={styles.headerRightContainer}>
            <IconButton 
              onPress={onOptionsPress}
              icon={MoreVertical}
              variant="secondary"
              size={20}
              style={styles.headerButton}
            />
          </View>
        </View>

        {/* Content */}
        <PlayerStatsContent player={player} />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
  },
  headerLeftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  headerRightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});