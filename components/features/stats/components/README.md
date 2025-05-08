# PlayerStatsOverlay Component

## Overview

The `PlayerStatsOverlay` component provides a smooth, animated transition from a list item to a full-screen overlay. It uses React Native Reanimated for fluid animations and shared element transitions to create a polished user experience.

## Key Features

- Expands smoothly from source element to full-screen
- Spring physics for natural-feeling, bouncy transitions
- Shared element transitions for Avatar and Player Name
- Graceful fallbacks when source position is unavailable
- Custom close animation that returns to source position
- Drag-to-dismiss gesture with interactive visual feedback

## Correct Implementation

To ensure the overlay works properly:

1. **Component Placement**: The overlay must be placed at the root level of the page component, outside of any ScrollView.

```jsx
// CORRECT ✅
export default function Screen() {
  // ... state and hooks

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {/* Your list items and other content */}
        <Text>Player list goes here</Text>
      </ScrollView>
      
      {/* PlayerStatsOverlay at the root level */}
      <PlayerStatsOverlay
        player={selectedPlayer}
        isVisible={statsOverlayVisible}
        onClose={handleCloseOverlay}
        onAnimationComplete={handleAnimationComplete}
        itemPosition={itemPosition}
        // OPTIONAL: Use custom animation timing (slower/gentler)
        animationConfig={{
          OPEN_ANIMATION: { 
            STIFFNESS: 80,  // Lower = slower animation (default: 120)
            MASS: 1.2       // Higher = more inertia (default: 0.8)
          }
        }}
      />
    </View>
  );
}

// INCORRECT ❌
export default function Screen() {
  return (
    <ScrollView>
      {/* Your content */}
      <Text>Player list goes here</Text>
      
      {/* Overlay won't position correctly inside ScrollView */}
      <PlayerStatsOverlay />
    </ScrollView>
  );
}
```

2. **Position Measurement**: The list item must correctly measure its position using `ref.measure()`.

```jsx
// Inside LeaderboardItem.tsx or similar component
const handlePress = () => {
  if (onPress && cardRef.current) {
    // Measure the card's position and dimensions
    cardRef.current.measure((x, y, width, height, pageX, pageY) => {
      // Pass measurements to parent component
      onPress(player, {
        x: pageX,
        y: pageY,
        width,
        height
      });
    });
  }
};

return (
  <TouchableOpacity
    ref={cardRef}
    onPress={handlePress}
    style={styles.container}
  >
    {/* Content */}
  </TouchableOpacity>
);
```

3. **Enhanced State Management**: The parent component should separate closing from cleanup.

```jsx
// In your page component
const [selectedPlayer, setSelectedPlayer] = useState(null);
const [statsOverlayVisible, setStatsOverlayVisible] = useState(false);
const [itemPosition, setItemPosition] = useState(null);

const handlePlayerPress = useCallback((player, position) => {
  setSelectedPlayer(player);
  setItemPosition(position);
  setStatsOverlayVisible(true);
}, []);

// Trigger the closing animation
const handleCloseOverlay = useCallback(() => {
  setStatsOverlayVisible(false);
}, []);

// Clean up state after animation completes
const handleAnimationComplete = useCallback(() => {
  setSelectedPlayer(null);
  setItemPosition(null);
}, []);
```

## Animation Customization

You can now easily customize animation speed and behavior by passing an `animationConfig` prop:

```jsx
<PlayerStatsOverlay
  // ... other props
  
  // Optional: Custom animation config
  animationConfig={{
    // For a slower, gentler opening animation:
    OPEN_ANIMATION: {
      STIFFNESS: 80,     // Lower = slower/gentler (default: 120)
      DAMPING: 30,       // Higher = less bounce (default: 25)
      MASS: 1.2,         // Higher = slower animation (default: 0.8)
      DURATION: 800,     // Optional: Force specific duration in ms
    },
    CONTENT_FADE: {
      DURATION: 400,     // How long content fade takes (default: 300)
      DELAY: 300,        // When to start content fade (default: 200)
    },
    CLOSE_ANIMATION: {
      DURATION: 450,     // How long closing takes (default: 450)
    }
  }}
/>
```

### Common Animation Presets

Here are some useful animation presets you can copy and use:

#### Slow and Elegant
```jsx
animationConfig={{
  OPEN_ANIMATION: {
    STIFFNESS: 70,
    DAMPING: 35,
    MASS: 1.5,
  },
  CONTENT_FADE: {
    DURATION: 500,
    DELAY: 350,
  }
}}
```

#### Ultra Fast
```jsx
animationConfig={{
  OPEN_ANIMATION: {
    STIFFNESS: 170,
    DAMPING: 20,
    MASS: 0.5,
  },
  CONTENT_FADE: {
    DURATION: 200,
    DELAY: 100,
  },
  CLOSE_ANIMATION: {
    DURATION: 300,
  }
}}
```

#### No Spring (Direct Timing)
```jsx
animationConfig={{
  OPEN_ANIMATION: {
    STIFFNESS: 0, // Not used when duration is set
    DAMPING: 0,   // Not used when duration is set
    MASS: 0,      // Not used when duration is set
    DURATION: 600,
  }
}}
```

## Animation Details

- **Opening Animation**: Uses spring physics with the following parameters:
  ```js
  withSpring(1, {
    damping: 25,         // Higher damping = less oscillation
    stiffness: 120,      // Higher stiffness = snappier animation
    mass: 0.8,           // Mass affects momentum
    overshootClamping: false,
  })
  ```

- **Content Fade-in**: Content fades in after the card has expanded around 30%:
  ```js
  contentOpacity.value = withTiming(1, {
    duration: 300,
    easing: Easing.ease,
    delay: 200, 
  });
  ```

- **Closing Animation**: Two-phase animation for smooth return to source:
  ```js
  // 1. Hide content
  contentOpacity.value = withTiming(0, { 
    duration: 180,
    easing: Easing.out(Easing.quad),
  });
  
  // 2. Animate card back to source
  progress.value = withTiming(0, {
    duration: 450,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });
  ```

- **Drag-to-Dismiss**: Interactive gesture with visual feedback:
  ```js
  // Gesture handler for pan gestures
  const gestureHandler = useAnimatedGestureHandler({
    // Track gesture start
    onStart: (_, ctx) => { ... },
    
    // Update on drag
    onActive: (event, ctx) => {
      // Only allow dragging downward
      translateY.value = Math.max(0, ctx.startY + event.translationY);
      
      // Update visual feedback based on drag distance
      contentOpacity.value = 1 - (dragProgress * 0.7);
    },
    
    // Determine outcome on release
    onEnd: (event) => {
      // Dismiss if dragged far enough or with enough velocity
      if (dragDistance > THRESHOLD || dragVelocity > 800) {
        // Animate out and dismiss
      } else {
        // Spring back to original position
      }
    }
  });
  ```

- **Shared Elements**: The avatar and player name use shared transition tags for a connected feel.

- **Visual Feedback During Drag**:
  - Card scales down slightly (to 92%) as it's dragged
  - Subtle rotation effect (-5 degrees) at maximum drag
  - Drag indicator at top of modal becomes more visible
  - Content fades as card is dragged down
  - Modal has rounded top corners with drop shadow
  - Natural resistance when dragging (progressive tension)
  - Subtle pulse animation on drag indicator for discoverability

## Troubleshooting

If the overlay isn't working correctly:

1. **Wrong Position**: Check that LeaderboardItem is measuring correctly and logs position values
2. **Animation Too Fast/Slow**: Use the `animationConfig` prop to adjust animation speed:
   ```jsx
   // For slower animations:
   animationConfig={{
     OPEN_ANIMATION: { STIFFNESS: 80, MASS: 1.2, DAMPING: 30 }
   }}
   
   // For faster animations:
   animationConfig={{
     OPEN_ANIMATION: { STIFFNESS: 160, MASS: 0.6, DAMPING: 22 }
   }}
   ```
3. **Not Closing Properly**: Ensure onClose and onAnimationComplete callbacks are separated
4. **Content Flashes**: Adjust content fade timing with `CONTENT_FADE.DURATION` and `CONTENT_FADE.DELAY`
5. **Missing Shared Element**: Verify that sharedTransitionTag values match between components

The component has fallback animations if position data is missing, but the experience will be better with proper positioning.