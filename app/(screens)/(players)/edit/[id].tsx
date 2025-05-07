import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { spacing, layout } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/core/atoms/Text';
import { Button } from '@/components/core/atoms/Button';
import { Input } from '@/components/core/atoms/Input';
import { ColorPicker } from '@/components/core/molecules/ColorPicker';
import { Avatar } from '@/components/core/atoms/Avatar';
import { usePlayers } from '@/hooks/usePlayers';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trash2 } from 'lucide-react-native';

export default function EditPlayer() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const colors = useThemeColors();
  const { players, updatePlayer, deletePlayer } = usePlayers();
  
  const [name, setName] = useState('');
  const [color, setColor] = useState('#4F46E5');
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (id) {
      const player = players.find(p => p.id === id);
      if (player) {
        setName(player.name);
        setColor(player.color || '#4F46E5');
      } else {
        router.replace('/(screens)/(players)/list');
      }
    }
  }, [id, players]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (id) {
      updatePlayer(id as string, {
        name: name.trim(),
        color,
      });
      router.back();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Player',
      'Are you sure you want to delete this player? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (id) {
              deletePlayer(id as string);
              router.replace('/(screens)/(players)/list');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background.primary }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text size="xl" weight="semibold" style={styles.title}>Edit Player</Text>
        
        <View style={styles.avatarContainer}>
          <Avatar name={name} color={color} size={80} />
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
            variant="tertiary" 
            onPress={() => router.back()}
            style={styles.button}
          />
          <Button 
            label="Save" 
            variant="primary" 
            onPress={handleSubmit}
            style={styles.button}
          />
        </View>
        
        <Button 
          label="Delete Player" 
          variant="destructive" 
          onPress={handleDelete}
          icon={Trash2}
          style={styles.deleteButton}
        />
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
  deleteButton: {
    marginTop: spacing.xl,
  },
});