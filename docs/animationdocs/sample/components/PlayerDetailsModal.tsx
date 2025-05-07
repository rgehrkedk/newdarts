import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  runOnJS,
  Easing,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../../../constants/theme';
import { Player, GameMode } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PlayerDetailsModalProps {
  player: Player | null;
  activeGameMode: string;
  gameModes: GameMode[];
  isVisible: boolean;
  onClose: () => void;
  playerCardPosition: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

/**
 * PlayerDetailsModal - A component that implements a shared element transition
 * between a player card in the list and a detailed modal view.
 * 
 * The animation creates a smooth expansion effect where the player card
 * visually transforms into the full modal, maintaining visual continuity.
 */
export default function PlayerDetailsModal({
  player,
  activeGameMode,
  gameModes,
  isVisible,
  onClose,
  playerCardPosition
}: PlayerDetailsModalProps) {
  // Animation control values
  
  /**
   * progress - Controls the main animation sequence from 0 (card) to 1 (modal)
   * This drives the position, size, and shape interpolations
   */
  const progress = useSharedValue(0);
  
  /**
   * opacity - Controls the background overlay opacity
   * Separate from progress to allow for different timing
   */
  const opacity = useSharedValue(0);
  
  /**
   * contentOpacity - Controls the fade-in of modal content
   * Separate timing allows content to appear after the card expands
   */
  const contentOpacity = useSharedValue(0);
  
  /**
   * scale - Provides subtle scaling effects during the animation
   * Creates a more dynamic feel with slight "pop" effect
   */
  const scale = useSharedValue(1);
  
  /**
   * Animation lifecycle effect
   * Manages the animation sequence based on the isVisible prop
   */
  useEffect(() => {
    if (isVisible) {
      // Opening animation sequence
      
      // 1. Fade in the background overlay
      opacity.value = withTiming(1, { duration: 300 });
      
      // 2. Animate the card expansion with custom easing
      progress.value = withTiming(1, { 
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1) // Custom cubic bezier for natural motion
      });
      
      // 3. Fade in content with slight delay for sequential feel
      contentOpacity.value = withTiming(1, { 
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      });
      
      // 4. Subtle scale animation for "pop" effect
      scale.value = withTiming(1, { duration: 500 });
    } else {
      // Closing animation sequence - reverse order with adjusted timing
      
      // 1. Fade out the background
      opacity.value = withTiming(0, { duration: 300 });
      
      // 2. Animate card shrinking
      progress.value = withTiming(0, { 
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      });
      
      // 3. Quickly fade out content (faster than fade in)
      contentOpacity.value = withTiming(0, { 
        duration: 200,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      });
      
      // 4. Subtle scale down for visual feedback
      scale.value = withTiming(0.95, { duration: 400 });
    }
  }, [isVisible]);
  
  const getActiveGameModeColor = () => {
    const mode = gameModes.find(m => m.id === activeGameMode);
    return mode ? mode.color : COLORS.primary;
  };
  
  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <MaterialIcons name="arrow-upward" size={16} color={COLORS.success} />;
    if (trend === 'down') return <MaterialIcons name="arrow-downward" size={16} color={COLORS.error} />;
    return null;
  };
  
  const getStatValue = (statName: string): string => {
    if (!player) return '-';
    
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
      default:
        return '-';
    }
  };
  
  /**
   * Background overlay animated style
   * Creates a semi-transparent black background that fades in/out
   * with the modal visibility
   */
  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      // Dynamic background color with interpolated opacity for smoother feel
      backgroundColor: `rgba(0, 0, 0, ${interpolate(
        progress.value,
        [0, 1],
        [0, 0.8],
        Extrapolate.CLAMP
      )})`,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      // Dynamic z-index prevents interaction when hidden
      zIndex: isVisible ? 99 : -1,
    };
  });
  
  /**
   * Modal container animated style
   * This is the core of the shared element animation
   * Transforms from the original card position/size to the full modal
   */
  const modalStyle = useAnimatedStyle(() => {
    if (!playerCardPosition || !player) return {};
    
    // Starting position and dimensions (from the player card)
    const initialX = playerCardPosition.x;
    const initialY = playerCardPosition.y;
    const initialWidth = playerCardPosition.width;
    const initialHeight = playerCardPosition.height;
    
    // Target position and dimensions (full modal)
    const targetX = SCREEN_WIDTH * 0.05;
    const targetY = SCREEN_HEIGHT * 0.1;
    const targetWidth = SCREEN_WIDTH * 0.9;
    const targetHeight = SCREEN_HEIGHT * 0.8;
    
    return {
      position: 'absolute',
      // Interpolate left position from card to modal
      left: interpolate(
        progress.value,
        [0, 1],
        [initialX, targetX],
        Extrapolate.CLAMP
      ),
      // Interpolate top position from card to modal
      top: interpolate(
        progress.value,
        [0, 1],
        [initialY, targetY],
        Extrapolate.CLAMP
      ),
      // Interpolate width from card to modal
      width: interpolate(
        progress.value,
        [0, 1],
        [initialWidth, targetWidth],
        Extrapolate.CLAMP
      ),
      // Interpolate height from card to modal
      height: interpolate(
        progress.value,
        [0, 1],
        [initialHeight, targetHeight],
        Extrapolate.CLAMP
      ),
      // Interpolate border radius for smoother corner transition
      borderRadius: interpolate(
        progress.value,
        [0, 1],
        [SIZES.radius, SIZES.radiusLarge],
        Extrapolate.CLAMP
      ),
      opacity: isVisible ? 1 : 0,
      zIndex: isVisible ? 100 : -1,
      overflow: 'hidden',
      // Scale effect for subtle "pop" during transition
      transform: [
        { 
          scale: interpolate(
            progress.value,
            [0, 0.5, 1],
            [1, 1.05, 1],
            Extrapolate.CLAMP
          ) 
        }
      ],
    };
  });
  
  /**
   * Content animated style
   * Controls the opacity and subtle entrance animation of the modal content
   */
  const contentStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
      // Subtle entrance animation with upward movement
      transform: [
        { 
          translateY: interpolate(
            contentOpacity.value,
            [0, 1],
            [20, 0],
            Extrapolate.CLAMP
          ) 
        }
      ],
    };
  });
  
  /**
   * Player badge animated style
   * Animates the player's initial/avatar from small to large
   */
  const playerBadgeStyle = useAnimatedStyle(() => {
    if (!player) return {};
    
    return {
      // Interpolate width from small to large
      width: interpolate(
        progress.value,
        [0, 1],
        [40, 60],
        Extrapolate.CLAMP
      ),
      // Interpolate height from small to large
      height: interpolate(
        progress.value,
        [0, 1],
        [40, 60],
        Extrapolate.CLAMP
      ),
      borderRadius: SIZES.radiusLarge,
      backgroundColor: player.color,
      alignItems: 'center' as 'center',
      justifyContent: 'center' as 'center',
      marginRight: SIZES.base * 2,
    };
  });
  
  /**
   * Player initial text animated style
   * Animates the text size within the badge
   */
  const playerInitialStyle = useAnimatedStyle(() => {
    return {
      // Interpolate font size from medium to large
      fontSize: interpolate(
        progress.value,
        [0, 1],
        [SIZES.medium, SIZES.extraLarge],
        Extrapolate.CLAMP
      ),
      color: COLORS.textPrimary,
      fontWeight: 'bold' as 'bold',
    };
  });
  
  /**
   * Handle modal close with animation
   * Ensures animations complete before actually removing the modal
   */
  const handleClose = () => {
    // Start closing animation
    progress.value = withTiming(0, { 
      duration: 400,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    }, () => {
      // After animation completes, call the onClose prop
      runOnJS(onClose)();
    });
    contentOpacity.value = withTiming(0, { duration: 200 });
    opacity.value = withTiming(0, { duration: 300 });
    scale.value = withTiming(0.95, { duration: 300 });
  };
  
  if (!player) return null;
  
  const activeMode = gameModes.find(m => m.id === activeGameMode);
  
  return (
    <>
      {/* Background overlay with touch handler for dismissal */}
      <Animated.View 
        style={overlayStyle} 
        pointerEvents={isVisible ? 'auto' : 'none'}
      >
        <TouchableOpacity 
          style={{ flex: 1 }} 
          activeOpacity={1} 
          onPress={handleClose}
        />
      </Animated.View>
      
      {/* Modal container - the main shared element */}
      <Animated.View style={modalStyle} pointerEvents={isVisible ? 'auto' : 'none'}>
        <View style={styles.modalBackground}>
          {/* Header section - persists during animation */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              {/* Player badge - animated from card to modal size */}
              <Animated.View style={playerBadgeStyle}>
                <Animated.Text style={playerInitialStyle}>{player.initial}</Animated.Text>
              </Animated.View>
              <View style={styles.playerInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.playerName}>{player.name}</Text>
                  {getTrendIcon(player.trend)}
                </View>
                <Text style={styles.gamesPlayed}>{player.gamesPlayed} games played</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <MaterialIcons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          
          {/* Content section - fades in after animation */}
          <Animated.View style={[styles.content, contentStyle]}>
            <View style={styles.statsHeader}>
              <View style={[styles.gameModeBadge, { backgroundColor: getActiveGameModeColor() }]}>
                {activeMode?.icon}
                <Text style={styles.gameModeText}>{activeMode?.name}</Text>
              </View>
            </View>
            
            <ScrollView style={styles.statsContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.statsGrid}>
                {activeMode?.statParams.map((stat, index) => (
                  <View key={index} style={styles.statCard}>
                    <Text style={styles.statLabel}>{stat}</Text>
                    <Text style={[styles.statValue, { color: getActiveGameModeColor() }]}>
                      {getStatValue(stat)}
                    </Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.recentGames}>
                <Text style={styles.sectionTitle}>Recent Games</Text>
                {[...Array(3)].map((_, index) => (
                  <View key={index} style={styles.gameItem}>
                    <View style={styles.gameDate}>
                      <MaterialIcons name="event" size={14} color={COLORS.textSecondary} />
                      <Text style={styles.dateText}>
                        {new Date(Date.now() - (index * 86400000)).toLocaleDateString()}
                      </Text>
                    </View>
                    <View style={styles.gameResult}>
                      <Text style={styles.resultText}>
                        {activeGameMode === '501' ? `${Math.floor(60 + Math.random() * 20)} avg` : 
                         activeGameMode === 'cricket' ? `${Math.floor(2 + Math.random() * 1.5)} MPR` :
                         activeGameMode === 'rtw' ? `${Math.floor(1 + Math.random())}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}` :
                         `${Math.floor(100 + Math.random() * 100)} pts`}
                      </Text>
                      <View style={[
                        styles.resultBadge, 
                        { backgroundColor: index === 0 ? COLORS.success : index === 1 ? COLORS.warning : COLORS.error }
                      ]}>
                        <Text style={styles.resultBadgeText}>
                          {index === 0 ? 'Win' : index === 1 ? 'Draw' : 'Loss'}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
              
              <View style={styles.actions}>
                <TouchableOpacity 
                  style={[styles.actionButton, { backgroundColor: getActiveGameModeColor() }]}
                >
                  <MaterialIcons name="sports" size={18} color={COLORS.textPrimary} />
                  <Text style={styles.actionButtonText}>Challenge</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: COLORS.cardLight }]}>
                  <MaterialIcons name="share" size={18} color={COLORS.textPrimary} />
                  <Text style={styles.actionButtonText}>Share Stats</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radiusLarge,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    // Add shadow styles directly instead of using SHADOWS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerInfo: {
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerName: {
    ...FONTS.bold,
    fontSize: SIZES.large,
    marginRight: SIZES.base,
    color: COLORS.textPrimary,
  },
  gamesPlayed: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginTop: SIZES.base / 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radiusRound,
    backgroundColor: COLORS.cardLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  statsHeader: {
    paddingHorizontal: SIZES.padding,
    paddingVertical: SIZES.base * 2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  gameModeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.base * 1.5,
    paddingVertical: SIZES.base,
    borderRadius: SIZES.radiusRound,
    alignSelf: 'flex-start',
  },
  gameModeText: {
    ...FONTS.medium,
    marginLeft: SIZES.base,
    color: COLORS.textPrimary,
  },
  statsContainer: {
    flex: 1,
    padding: SIZES.padding,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SIZES.padding,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.cardLight,
    borderRadius: SIZES.radius,
    padding: SIZES.base * 1.5,
    marginBottom: SIZES.base * 1.5,
    alignItems: 'center',
    // Add shadow styles directly instead of using SHADOWS
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.base * 1.5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  statLabel: {
    ...FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: SIZES.base,
  },
  statValue: {
    ...FONTS.bold,
    fontSize: SIZES.large,
  },
  recentGames: {
    marginTop: SIZES.padding,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: SIZES.medium,
    marginBottom: SIZES.base * 2,
    color: COLORS.textPrimary,
  },
  gameItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.base * 1.5,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  gameDate: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    ...FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginLeft: SIZES.base,
  },
  gameResult: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultText: {
    ...FONTS.medium,
    marginRight: SIZES.base,
    color: COLORS.textPrimary,
  },
  resultBadge: {
    paddingHorizontal: SIZES.base,
    paddingVertical: SIZES.base / 2,
    borderRadius: SIZES.base,
  },
  resultBadgeText: {
    ...FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textPrimary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SIZES.padding * 1.5,
    marginBottom: SIZES.padding,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.base * 1.5,
    borderRadius: SIZES.radius,
    marginHorizontal: SIZES.base,
  },
  actionButtonText: {
    ...FONTS.medium,
    color: COLORS.textPrimary,
    marginLeft: SIZES.base,
  },
});
