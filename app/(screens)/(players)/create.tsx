import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/core/atoms/Text';
import { Button } from '@/components/core/atoms/Button';
import { Input } from '@/components/core/atoms/Input';
import { ColorPicker } from '@/components/core/molecules/ColorPicker';
import { Avatar } from '@/components/core/atoms/Avatar';
import { usePlayers } from '@/hooks/usePlayers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';

export default function CreatePlayer() {
  const router = useRouter();
  const colors = useThemeColors();
  const { addPlayer } = usePlayers();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4F46E5');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    const newPlayer = {
      id: uuidv4(),
      name: name.trim(),
      color,
      gameAvg: 0,
      checkoutPercentage: 0,
      highestCheckout: 0,
      oneEighties: 0,
      games: [],
    };

    addPlayer(newPlayer);
    router.back();
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