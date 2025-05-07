# Phase 7: Enhanced Layouts and Transitions Plan

This document outlines a detailed approach for implementing enhanced layouts and transitions between screens in the Darts Scorer App.

## Objectives

1. Create consistent header components across all screens
2. Implement shared element transitions for seamless navigation
3. Enhance modal presentations with custom animations
4. Add gesture-based navigation and dismissal
5. Improve overall visual coherence and flow

## Implementation Plan

### 1. Create a Shared Header Component

#### Header Requirements

- Consistent appearance across screens
- Customizable title, left/right actions
- Optional transparency/blur effect
- Animation support for title/elements

#### Implementation Steps

1. Create a reusable header component:

```typescript
// /components/layout/Header.tsx
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components/core/atoms/Text';
import { BlurView } from 'expo-blur';
import { useThemeColors } from '@/constants/theme/colors';
import { useTheme } from '@/hooks/useTheme';
import { spacing, layout } from '@/constants/theme';
import { goBack } from '@/utils/navigation';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ChevronLeft } from 'lucide-react-native';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
  transparent?: boolean;
  blurred?: boolean;
  animationDelay?: number;
  onBack?: () => void;
}

export function Header({
  title,
  showBackButton = false,
  rightAction,
  transparent = false,
  blurred = false,
  animationDelay = 0,
  onBack,
}: HeaderProps) {
  const colors = useThemeColors();
  const { isDark } = useTheme();
  
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      goBack();
    }
  };

  // Base container styles
  const containerStyle = [
    styles.container,
    transparent ? { backgroundColor: 'transparent' } : { backgroundColor: colors.background.primary },
  ];
  
  return (
    <Animated.View
      entering={FadeIn.delay(animationDelay)}
      style={containerStyle}
    >
      {blurred && (
        <BlurView
          intensity={80}
          style={StyleSheet.absoluteFill}
          tint={isDark ? 'dark' : 'light'}
        />
      )}
      
      <View style={styles.content}>
        {/* Left/Back Button */}
        <View style={styles.leftAction}>
          {showBackButton && (
            <TouchableOpacity
              onPress={handleBack}
              style={[styles.backButton, { backgroundColor: colors.background.secondary }]}
            >
              <ChevronLeft size={20} color={colors.text.primary} />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Title */}
        <Text weight="semibold" size="lg" style={styles.title}>
          {title}
        </Text>
        
        {/* Right Action */}
        <View style={styles.rightAction}>
          {rightAction}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: layout.heights.header,
    width: '100%',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.container,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  leftAction: {
    width: 40,
    justifyContent: 'center',
  },
  rightAction: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

2. Apply the header component to all screen layouts:

```typescript
// Example: /app/(screens)/(players)/_layout.tsx
import { Stack } from 'expo-router';
import { useThemeColors } from '@/constants/theme/colors';

export default function PlayersLayout() {
  const colors = useThemeColors();
  
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background.primary },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="list" />
      <Stack.Screen name="create" />
      <Stack.Screen name="edit/[id]" />
      <Stack.Screen name="stats/[id]" />
    </Stack>
  );
}
```

3. Use the header component in each screen:

```typescript
// Example: /app/(screens)/(players)/list.tsx
import { View, StyleSheet } from 'react-native';
import { Header } from '@/components/layout/Header';
import { Plus } from 'lucide-react-native';
import { IconButton } from '@/components/core/atoms/IconButton';
import { useThemeColors } from '@/constants/theme/colors';
import { navigateToCreatePlayer } from '@/utils/navigation';

export default function PlayerList() {
  const colors = useThemeColors();
  
  const rightAction = (
    <IconButton
      icon={Plus}
      size="sm"
      onPress={navigateToCreatePlayer}
      variant="primary"
    />
  );
  
  return (
    <View style={styles.container}>
      <Header title="Players" rightAction={rightAction} />
      {/* Rest of the screen content */}
    </View>
  );
}
```

### 2. Implement Shared Element Transitions

#### Target Transitions

1. Player cards to player details
2. Game type selection to game setup
3. Setup screen to gameplay screen

#### Implementation Steps

1. Install required packages:

```bash
npm install react-native-shared-element expo-router-shared-element
```

2. Configure layout files to support shared element transitions:

```typescript
// /app/(screens)/(players)/_layout.tsx
import { SharedElementStackNavigator } from 'expo-router-shared-element';

const Stack = SharedElementStackNavigator();

export default function PlayersLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="list" />
      <Stack.Screen 
        name="stats/[id]"
        options={{
          gestureEnabled: true,
          presentation: 'transparentModal',
          cardOverlayEnabled: true,
          // Define which elements to animate between screens
          sharedElements: (route) => {
            const { id } = route.params;
            return [`player-avatar-${id}`, `player-name-${id}`];
          },
        }}
      />
      {/* Other screens */}
    </Stack>
  );
}
```

3. Add shared element IDs to components:

```typescript
// In player list screen
import { SharedElement } from 'react-native-shared-element';

// Inside the rendering of a player item
<TouchableOpacity onPress={() => navigateToPlayerDetails(player.id)}>
  <SharedElement id={`player-avatar-${player.id}`}>
    <Avatar name={player.name} color={player.color} size={40} />
  </SharedElement>
  <SharedElement id={`player-name-${player.id}`}>
    <Text weight="semibold">{player.name}</Text>
  </SharedElement>
</TouchableOpacity>

// In player details screen
<SharedElement id={`player-avatar-${id}`}>
  <Avatar name={player.name} color={player.color} size={80} />
</SharedElement>
<SharedElement id={`player-name-${id}`}>
  <Text size="xl" weight="semibold">{player.name}</Text>
</SharedElement>
```

### 3. Enhanced Modal Animations

#### Target Modals

1. Game completion modal
2. Player details modal
3. Checkout modal

#### Implementation Steps

1. Customize modal animations in layout:

```typescript
// /app/(screens)/(modals)/_layout.tsx
import { Stack } from 'expo-router';
import { TransitionPresets } from '@react-navigation/stack';

export default function ModalsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: 'transparentModal',
        cardOverlayEnabled: true,
        gestureEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
        transitionSpec: {
          open: {
            animation: 'spring',
            config: {
              stiffness: 1000,
              damping: 500,
              mass: 3,
              overshootClamping: true,
              restDisplacementThreshold: 0.01,
              restSpeedThreshold: 0.01,
            },
          },
          close: {
            animation: 'spring',
            config: {
              stiffness: 1000,
              damping: 500,
              mass: 3,
            },
          },
        },
      }}
    >
      <Stack.Screen name="game-complete" />
      <Stack.Screen name="leg-complete" />
      <Stack.Screen name="set-complete" />
      <Stack.Screen name="checkout" />
      <Stack.Screen 
        name="player-details/[id]" 
        options={({ route }) => ({
          gestureDirection: 'vertical',
        })}
      />
    </Stack>
  );
}
```

2. Add enhanced animations within modal screens:

```typescript
// Example: /app/(screens)/(modals)/game-complete.tsx
import Animated, { 
  FadeIn, SlideInDown, SlideInUp, 
  interpolate, useAnimatedStyle, useSharedValue, withTiming 
} from 'react-native-reanimated';
import { useEffect } from 'react';

export default function GameCompleteModal() {
  const animationProgress = useSharedValue(0);
  
  useEffect(() => {
    animationProgress.value = withTiming(1, { duration: 600 });
  }, []);
  
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animationProgress.value, [0, 1], [0, 0.6]),
  }));
  
  return (
    <View style={styles.container}>
      <Animated.View style={[styles.overlay, overlayStyle]} />
      
      <Animated.View
        entering={SlideInUp.springify().damping(15)}
        style={styles.modalContainer}
      >
        <View style={styles.handle} />
        
        <Animated.Text
          entering={FadeIn.delay(200)}
          style={styles.title}
        >
          Game Complete!
        </Animated.Text>
        
        {/* Modal content with staggered animations */}
        {players.map((player, index) => (
          <Animated.View
            key={player.id}
            entering={SlideInDown.delay(300 + index * 100)}
          >
            {/* Player item */}
          </Animated.View>
        ))}
      </Animated.View>
    </View>
  );
}
```

### 4. Gesture-Based Navigation

#### Target Interactions

1. Swipe back for navigation
2. Swipe to dismiss modals
3. Drag to expand/collapse player details

#### Implementation Steps

1. Configure gesture handlers in layout files:

```typescript
// /app/(screens)/(game)/_layout.tsx
import { Stack } from 'expo-router';

export default function GameLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        animationEnabled: true,
      }}
    >
      {/* Screen definitions */}
    </Stack>
  );
}
```

2. Implement custom gesture handling for modals:

```typescript
// Example: Bottom sheet style modal with pan gesture
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

export default function BottomSheetModal() {
  const translateY = useSharedValue(0);
  const context = useSharedValue({ y: 0 });
  const router = useRouter();
  
  const dismissModal = () => {
    router.back();
  };
  
  const panGesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = Math.max(0, context.value.y + event.translationY);
    })
    .onEnd((event) => {
      if (event.translationY > 100 || event.velocityY > 800) {
        translateY.value = withTiming(500, undefined, () => {
          runOnJS(dismissModal)();
        });
      } else {
        translateY.value = withTiming(0);
      }
    });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  
  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.modal, animatedStyle]}>
          <View style={styles.dragHandle} />
          {/* Modal content */}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
```

### 5. Common Transitions and Animations

#### Transition Types

1. **Screen Transitions**:
   - Slide horizontal for standard navigation
   - Slide up for modal presentation
   - Fade for tab switching

2. **Element Transitions**:
   - Fade in for lazy-loaded content
   - Scale for interactive elements
   - Staggered animations for lists

#### Implementation Examples

```typescript
// Element fade-in animation
<Animated.View
  entering={FadeIn.duration(400)}
>
  {/* Content */}
</Animated.View>

// Staggered list animations
{items.map((item, index) => (
  <Animated.View
    key={item.id}
    entering={FadeIn
      .delay(index * 50)
      .springify()
      .damping(12)
    }
  >
    {/* Item content */}
  </Animated.View>
))}

// Button press animation
const animated = useSharedValue(1);

const handlePressIn = () => {
  animated.value = withTiming(0.95, { duration: 100 });
};

const handlePressOut = () => {
  animated.value = withTiming(1, { duration: 200 });
};

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: animated.value }],
}));

<TouchableWithoutFeedback
  onPressIn={handlePressIn}
  onPressOut={handlePressOut}
>
  <Animated.View style={[styles.button, animatedStyle]}>
    {/* Button content */}
  </Animated.View>
</TouchableWithoutFeedback>
```

## Testing and Refinement

### Testing Areas

1. **Performance Testing**:
   - Measure frame rates during transitions
   - Test on lower-end devices
   - Optimize animations causing jank

2. **User Experience Testing**:
   - Verify interactions feel natural
   - Ensure transitions enhance rather than distract
   - Test accessibility with screen readers

3. **Cross-Platform Testing**:
   - Verify animations work on both iOS and Android
   - Adjust timing for platform-specific feel

### Refinement Process

1. Implement base animations and transitions
2. Gather feedback on transitions and gestures
3. Measure performance and adjust as needed
4. Iteratively improve animations based on user feedback

## Implementation Timeline

| Task | Estimated Time |
|------|----------------|
| Create shared header component | 0.5 day |
| Implement shared element transitions | 0.5 day |
| Enhance modal animations | 0.5 day |
| Add gesture-based navigation | 0.5 day |
| Testing and refinement | 1 day |

Total estimated time: 3 days

## Dependencies

- `react-native-reanimated` (already installed)
- `react-native-gesture-handler` (already installed)
- `expo-blur` (for header blurring effects)
- `react-native-shared-element` (for shared element transitions)
- `expo-router-shared-element` (for shared element routing)