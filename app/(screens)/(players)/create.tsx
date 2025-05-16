import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/core/atoms/Text';
import { Button } from '@/components/core/atoms/Button';
import { Input } from '@/components/core/atoms/Input';
import { ColorPicker } from '@/components/core/molecules/ColorPicker';
import { Avatar } from '@/components/core/atoms/Avatar';
import { usePlayers } from '@/hooks/usePlayers';
import { useAuth } from '@/hooks/useAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';

export default function CreatePlayer() {
  const router = useRouter();
  const colors = useThemeColors();
  const { players, createPlayer } = usePlayers();
  const { session } = useAuth();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4F46E5');
  const [error, setError] = useState('');
  const [isGuest, setIsGuest] = useState(false);
  const [hasOwnerPlayer, setHasOwnerPlayer] = useState(false);

  useEffect(() => {
    // Check if the user already has an owner player
    if (session && players.length > 0) {
      const ownerExists = players.some(player => 
        player.user_id === session.user.id && !player.isGuest
      );
      setHasOwnerPlayer(ownerExists);
      
      // If an owner player exists, default to guest player
      if (ownerExists) {
        setIsGuest(true);
      }
    }
  }, [session, players]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    try {
      await createPlayer({
        name: name.trim(),
        color,
        gameAvg: 0,
        checkoutPercentage: 0,
        // If user has an owner player, force guest mode
        isGuest: hasOwnerPlayer || isGuest,
      });
      
      router.back();
    } catch (err) {
      // Error is handled by the store
    }
  };

  const togglePlayerType = () => {
    // Only toggle if the user doesn't have an owner player yet
    if (!hasOwnerPlayer) {
      setIsGuest(!isGuest);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text size="xl" weight="semibold" style={styles.title}>Create Player</Text>
        
        <View style={styles.avatarContainer}>
          <Avatar name={name || 'New Player'} color={color} size={80} />
        </View>
        
        <View style={styles.formContainer}>
          <Text weight="semibold" style={styles.label}>Player Name</Text>
          <Input
            placeholder="Enter name"
            value={name}
            onChangeText={text => {
              setName(text);
              setError('');
            }}
            error={error}
          />
          
          <Text weight="semibold" style={styles.label}>Color</Text>
          <ColorPicker
            selectedColor={color}
            onSelectColor={setColor}
            colors={[
              '#4F46E5', // Indigo
              '#2563EB', // Blue
              '#0891B2', // Cyan
              '#059669', // Emerald
              '#65A30D', // Lime
              '#CA8A04', // Yellow
              '#EA580C', // Orange
              '#DC2626', // Red
              '#DB2777', // Pink
              '#7C3AED', // Violet
            ]}
          />
          
          <View style={styles.playerTypeSection}>
            <Text weight="semibold" style={styles.label}>Player Type</Text>
            <Button
              label={isGuest ? "Guest Player (Temporary)" : "Owned Player (Permanent)"}
              variant="secondary"
              onPress={togglePlayerType}
              disabled={hasOwnerPlayer}
            />
            <Text variant="caption" style={styles.typeInfo}>
              {isGuest 
                ? "Guest players are temporary and can be deleted after the game."
                : "You can only have one owned player profile linked to your account."}
            </Text>
            {hasOwnerPlayer && (
              <Text variant="caption" style={[styles.typeInfo, { color: colors.text.secondary }]}>
                You already have an owned player. Only guest players can be created.
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            label="Cancel" 
            variant="secondary" 
            onPress={() => router.back()}
            style={styles.button}
          />
          <Button 
            label="Create" 
            variant="primary" 
            onPress={handleSubmit}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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
    padding: spacing.container,
  },
  title: {
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  formContainer: {
    gap: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
  },
  playerTypeSection: {
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  typeInfo: {
    marginTop: spacing.xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  button: {
    flex: 1,
  },
});