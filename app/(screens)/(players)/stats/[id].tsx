import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/core/atoms/Text';
import { usePlayers } from '@/hooks/usePlayers';
import { ChevronLeft, Edit } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/components/core/atoms/Avatar';
import { PlayerStats } from '@/components/features/stats/PlayerStats';

export default function PlayerStatsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colors = useThemeColors();
  const { players } = usePlayers();
  const [player, setPlayer] = useState<any>(null);
  
  useEffect(() => {
    if (id) {
      const foundPlayer = players.find(p => p.id === id);
      if (foundPlayer) {
        setPlayer(foundPlayer);
      } else {
        router.replace('/(screens)/(players)/list');
      }
    }
  }, [id, players]);

  const handleEdit = () => {
    router.push({
      pathname: '/(screens)/(players)/edit/[id]',
      params: { id: player.id }
    });
  };

  if (!player) {
    return null;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={[styles.backButton, { backgroundColor: colors.background.secondary }]}
        >
          <ChevronLeft color={colors.text.primary} size={24} />
        </TouchableOpacity>
        
        <View style={styles.playerHeaderInfo}>
          <Avatar name={player.name} color={player.color} size={40} />
          <Text size="lg" weight="semibold" style={styles.playerName}>{player.name}</Text>
        </View>
        
        <TouchableOpacity 
          onPress={handleEdit} 
          style={[styles.editButton, { backgroundColor: colors.background.secondary }]}
        >
          <Edit color={colors.text.primary} size={24} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <PlayerStats player={player} />
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: spacing.container,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerName: {
    marginLeft: spacing.md,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
});