import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/core/atoms/Text';
import { usePlayers } from '@/hooks/usePlayers';
import { X, PenSquare } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '@/components/core/atoms/Avatar';
import { PlayerStats } from '@/components/features/stats/PlayerStats';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

export default function PlayerDetailModal() {
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
        router.dismiss();
      }
    }
  }, [id, players]);

  const handleEdit = () => {
    router.push({
      pathname: '/(screens)/(players)/edit/[id]',
      params: { id: player.id }
    });
  };

  const handleClose = () => {
    router.dismiss();
  };

  if (!player) {
    return null;
  }

  return (
    <View style={[styles.modalBackground, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
      <Animated.View 
        entering={SlideInUp.springify().damping(15)}
        style={[styles.modalContainer, { backgroundColor: colors.background.primary }]}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={handleClose} 
              style={[styles.headerButton, { backgroundColor: colors.background.secondary }]}
            >
              <X color={colors.text.primary} size={24} />
            </TouchableOpacity>
            
            <View style={styles.playerHeaderInfo}>
              <Avatar name={player.name} color={player.color} size={40} />
              <Text size="lg" weight="semibold" style={styles.playerName}>{player.name}</Text>
            </View>
            
            <TouchableOpacity 
              onPress={handleEdit} 
              style={[styles.headerButton, { backgroundColor: colors.background.secondary }]}
            >
              <PenSquare color={colors.text.primary} size={24} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.scrollView}>
            <Animated.View entering={FadeIn.delay(200)}>
              <PlayerStats player={player} />
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '90%',
    borderTopLeftRadius: layout.radius.xl,
    borderTopRightRadius: layout.radius.xl,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.container,
    paddingVertical: spacing.md,
  },
  headerButton: {
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
  scrollView: {
    flex: 1,
  },
});