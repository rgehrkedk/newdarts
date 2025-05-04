import { View, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { ChevronLeft, MoveVertical as MoreVertical } from 'lucide-react-native';
import { Text } from '@/components/ui/atoms/Text';
import { SavedPlayer } from '@/types/game';
import { PlayerHeader } from './components/PlayerHeader';
import { PerformanceSummary } from './components/PerformanceSummary';
import { TrendChart } from './components/TrendChart';
import { Highlights } from './components/Highlights';
import { HighScores } from './components/HighScores';
import { RecentGame } from './components/RecentGame';
import { useState } from 'react';

interface PlayerStatsModalProps {
  visible: boolean;
  onClose: () => void;
  player: SavedPlayer | null;
}

type Tab = 'Overview' | 'History' | 'Achievements';

export function PlayerStatsModal({ visible, onClose, player }: PlayerStatsModalProps) {
  const colors = useThemeColors();
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  
  if (!player) return null;

  const tabs: Tab[] = ['Overview', 'History', 'Achievements'];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={[styles.container, { backgroundColor: colors.background.primary }]}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={onClose} 
            style={[styles.headerButton, { backgroundColor: colors.background.secondary }]}
          >
            <ChevronLeft size={20} color={colors.text.primary} />
          </TouchableOpacity>
          <Text size="lg" weight="semibold">Player Profile</Text>
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: colors.background.secondary }]}
          >
            <MoreVertical size={20} color={colors.text.primary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.tabs, { borderBottomColor: colors.border.primary }]}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && { borderBottomColor: colors.brand.primary }
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                weight={activeTab === tab ? 'semibold' : 'regular'}
                variant={activeTab === tab ? 'primary' : 'secondary'}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.content}>
          {activeTab === 'Overview' && (
            <View style={styles.overview}>
              <PlayerHeader player={player} />
              <PerformanceSummary player={player} />
              <TrendChart />
              <Highlights player={player} />
              <HighScores player={player} />
              <RecentGame player={player} />
            </View>
          )}
          
          {activeTab === 'History' && (
            <View style={styles.comingSoon}>
              <Text variant="secondary" align="center">History view coming soon</Text>
            </View>
          )}
          
          {activeTab === 'Achievements' && (
            <View style={styles.comingSoon}>
              <Text variant="secondary" align="center">Achievements coming soon</Text>
            </View>
          )}
        </ScrollView>
      </View>
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
    padding: spacing.lg,
    paddingTop: spacing.xxxl,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  content: {
    flex: 1,
  },
  overview: {
    padding: spacing.lg,
    gap: spacing.xl,
  },
  comingSoon: {
    flex: 1,
    padding: spacing.xxxl,
    justifyContent: 'center',
    alignItems: 'center',
  },
});