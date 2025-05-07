import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS, SIZES, FONTS } from '../../../../constants/theme';
import { Player, GameMode } from '../types';

interface PlayerCardProps {
  player: Player;
  activeGameMode: string;
  gameModes: GameMode[];
  onViewDetails: (playerId: number, position: { x: number; y: number; width: number; height: number }) => void;
  sortBy?: string;
}

/**
 * PlayerCard - A component that displays a player's information in a card format.
 * The entire card is pressable and serves as the source element for the shared
 * element animation to the PlayerDetailsModal.
 */
export default function PlayerCard({
  player,
  activeGameMode,
  gameModes,
  onViewDetails,
  sortBy = 'Average',
}: PlayerCardProps) {
  // Reference to the card view for measuring position
  const cardRef = useRef<View>(null);
  
  // Get the active game mode color
  const getActiveGameModeColor = () => {
    const mode = gameModes.find(m => m.id === activeGameMode);
    return mode ? mode.color : COLORS.primary;
  };
  
  // Get the trend icon based on player's trend
  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <MaterialIcons name="arrow-upward" size={16} color={COLORS.success} />;
    if (trend === 'down') return <MaterialIcons name="arrow-downward" size={16} color={COLORS.error} />;
    return null;
  };
  
  // Handle press on the card
  const handlePress = () => {
    if (cardRef.current) {
      // Measure the card's position and dimensions
      cardRef.current.measure((x, y, width, height, pageX, pageY) => {
        // Pass the measurements to the parent component for animation
        onViewDetails(player.id, {
          x: pageX,
          y: pageY,
          width,
          height
        });
      });
    }
  };

  // Get the stat value based on the stat name
  const getStatValue = (statName: string) => {
    switch (statName) {
      case 'Average':
        return player.average || '-';
      case 'Checkout %':
        return player.checkoutPercentage || '-';
      case 'Darts/Leg':
        return player.dartsPerLeg || '-';
      case 'High Score':
        return player.highScore?.toString() || '-';
      case 'Marks/Round':
        return player.marksPerRound || '-';
      case 'Closing Speed':
        return player.closingSpeed || '-';
      case 'Points/Game':
        return player.pointsPerGame?.toString() || '-';
      case 'Accuracy':
        return player.accuracy || '-';
      case 'Completion Time':
        return player.completionTime || '-';
      case 'Hit %':
        return player.hitPercentage || '-';
      case 'Best Time':
        return player.bestTime || '-';
      case 'Total Score':
        return player.totalScore?.toString() || '-';
      case 'Doubles %':
        return player.doublesPercentage || '-';
      case 'Avg. Score':
        return player.avgScore || '-';
      case 'Best Score':
        return player.bestScore?.toString() || '-';
      case 'Games Played':
        return player.gamesPlayed.toString() || '-';
      case 'Name':
        return player.name;
      default:
        return '-';
    }
  };
  
  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={handlePress}
    >
      <View 
        ref={cardRef} 
        style={styles.container}
      >
        {/* Player badge and info */}
        <View style={styles.playerInfo}>
          <View style={[styles.playerBadge, { backgroundColor: player.color }]}>
            <Text style={styles.playerInitial}>{player.initial}</Text>
          </View>
          <View style={styles.nameContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.playerName}>{player.name}</Text>
              {getTrendIcon(player.trend)}
            </View>
            <Text style={styles.gamesPlayed}>{player.gamesPlayed} games played</Text>
          </View>
        </View>
        
        {/* Stats section - only show the selected stat */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>{sortBy}</Text>
            <Text 
              style={[
                styles.statValue, 
                { color: getActiveGameModeColor() }
              ]}
            >
              {getStatValue(sortBy)}
            </Text>
          </View>
        </View>
        
        {/* View details indicator */}
        <View style={styles.viewDetailsContainer}>
          <MaterialIcons name="chevron-right" size={24} color={COLORS.textSecondary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    marginBottom: SIZES.base * 2,
    flexDirection: 'row',
    alignItems: 'center',
    // Shadow styles
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
    height: 80, // More compact height
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
  },
  playerBadge: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusRound,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.base * 1.5,
  },
  playerInitial: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
  },
  nameContainer: {
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerName: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    marginRight: SIZES.base,
    color: COLORS.textPrimary,
  },
  gamesPlayed: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
  statsContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.base,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base / 2,
  },
  statValue: {
    ...FONTS.bold,
    fontSize: SIZES.extraLarge, // Increased size for better visibility
  },
  viewDetailsContainer: {
    justifyContent: 'center',
    paddingLeft: SIZES.base,
  },
});
