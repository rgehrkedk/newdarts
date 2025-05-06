# Shared Element Animation with React Native Reanimated

This documentation provides a comprehensive guide to implementing shared element transitions in React Native using the Reanimated library. Shared element animations create a visual connection between different screens or components by animating common elements between them.

## Table of Contents

1. [Overview](#overview)
2. [Core Concepts](#core-concepts)
3. [Implementation Steps](#implementation-steps)
4. [Animation Architecture](#animation-architecture)
5. [Code Examples](#code-examples)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Overview

Shared element transitions enhance the user experience by providing visual continuity when navigating between different views. Instead of abrupt changes, elements common to both views (like images, cards, or text) smoothly animate from their position in the source view to their position in the destination view.

In our implementation, we use React Native Reanimated to create a smooth transition between a player card in a list and a detailed modal view of that player.

## Core Concepts

### 1. Measuring Source Elements

To create a shared element animation, we need to know the exact position and dimensions of the source element. This is achieved using React's `measure()` method on refs.

### 2. Animated Values

Several animated values control different aspects of the transition:

- **progress**: Controls the main animation sequence (0 to 1)
- **opacity**: Controls background overlay opacity
- **contentOpacity**: Controls the fade-in of destination content
- **scale**: Provides subtle scaling effects

### 3. Interpolation

Interpolation maps the progress value (0-1) to specific visual properties like position, size, and opacity.

### 4. Coordinated Timing

Multiple animations with different timing configurations create a cohesive, sequential effect.

## Implementation Steps

### 1. Source Component Setup

```typescript
// In your source component (e.g., PlayerCard)
const cardRef = useRef<View>(null);

const handlePress = () => {
  if (cardRef.current) {
    // Measure the card's position and dimensions
    cardRef.current.measure((x, y, width, height, pageX, pageY) => {
      // Pass the measurements to the parent component
      onViewDetails(item.id, {
        x: pageX,
        y: pageY,
        width,
        height
      });
    });
  }
};

return (
  <View ref={cardRef} style={styles.container}>
    {/* Component content */}
  </View>
);
```

### 2. Parent Component Coordination

```typescript
// In your parent component (e.g., LeaderboardScreen)
const [selectedItem, setSelectedItem] = useState(null);
const [itemPosition, setItemPosition] = useState(null);
const [isModalVisible, setIsModalVisible] = useState(false);

const handleViewDetails = (itemId, position) => {
  const item = items.find(i => i.id === itemId);
  if (item) {
    setSelectedItem(item);
    setItemPosition(position);
    setIsModalVisible(true);
  }
};

const handleCloseModal = () => {
  setIsModalVisible(false);
  
  // Clear data after animation completes
  setTimeout(() => {
    setSelectedItem(null);
    setItemPosition(null);
  }, 300);
};
```

### 3. Destination Component Animation

```typescript
// In your destination component (e.g., DetailsModal)
const progress = useSharedValue(0);
const opacity = useSharedValue(0);
const contentOpacity = useSharedValue(0);

useEffect(() => {
  if (isVisible) {
    // Opening animation sequence
    opacity.value = withTiming(1, { duration: 300 });
    progress.value = withTiming(1, { 
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });
    contentOpacity.value = withTiming(1, { duration: 400 });
  } else {
    // Closing animation sequence
    opacity.value = withTiming(0, { duration: 300 });
    progress.value = withTiming(0, { duration: 400 });
    contentOpacity.value = withTiming(0, { duration: 200 });
  }
}, [isVisible]);
```

## Animation Architecture

### Animated Styles

The core of the shared element animation is in the animated styles:

#### 1. Modal Container Style

```typescript
const modalStyle = useAnimatedStyle(() => {
  if (!itemPosition) return {};
  
  // Starting position (from the source element)
  const initialX = itemPosition.x;
  const initialY = itemPosition.y;
  const initialWidth = itemPosition.width;
  const initialHeight = itemPosition.height;
  
  // Target position (full modal)
  const targetX = SCREEN_WIDTH * 0.05;
  const targetY = SCREEN_HEIGHT * 0.1;
  const targetWidth = SCREEN_WIDTH * 0.9;
  const targetHeight = SCREEN_HEIGHT * 0.8;
  
  return {
    position: 'absolute',
    left: interpolate(
      progress.value,
      [0, 1],
      [initialX, targetX],
      Extrapolate.CLAMP
    ),
    top: interpolate(
      progress.value,
      [0, 1],
      [initialY, targetY],
      Extrapolate.CLAMP
    ),
    width: interpolate(
      progress.value,
      [0, 1],
      [initialWidth, targetWidth],
      Extrapolate.CLAMP
    ),
    height: interpolate(
      progress.value,
      [0, 1],
      [initialHeight, targetHeight],
      Extrapolate.CLAMP
    ),
    borderRadius: interpolate(
      progress.value,
      [0, 1],
      [SIZES.radius, SIZES.radiusLarge],
      Extrapolate.CLAMP
    ),
    opacity: isVisible ? 1 : 0,
    zIndex: isVisible ? 100 : -1,
    overflow: 'hidden',
  };
});
```

#### 2. Content Style

```typescript
const contentStyle = useAnimatedStyle(() => {
  return {
    opacity: contentOpacity.value,
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
```

#### 3. Background Overlay Style

```typescript
const overlayStyle = useAnimatedStyle(() => {
  return {
    opacity: opacity.value,
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
    zIndex: isVisible ? 99 : -1,
  };
});
```

## Code Examples

### Complete Modal Component

```typescript
export default function DetailsModal({
  item,
  isVisible,
  onClose,
  itemPosition
}) {
  // Animation control values
  const progress = useSharedValue(0);
  const opacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);
  
  // Animation lifecycle
  useEffect(() => {
    if (isVisible) {
      // Opening animation
      opacity.value = withTiming(1, { duration: 300 });
      progress.value = withTiming(1, { 
        duration: 500,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      });
      contentOpacity.value = withTiming(1, { duration: 400 });
    } else {
      // Closing animation
      opacity.value = withTiming(0, { duration: 300 });
      progress.value = withTiming(0, { 
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1)
      }, () => {
        runOnJS(onClose)();
      });
      contentOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isVisible]);
  
  // Animated styles (as shown above)
  const overlayStyle = useAnimatedStyle(() => { /* ... */ });
  const modalStyle = useAnimatedStyle(() => { /* ... */ });
  const contentStyle = useAnimatedStyle(() => { /* ... */ });
  
  if (!item) return null;
  
  return (
    <>
      <Animated.View 
        style={overlayStyle} 
        pointerEvents={isVisible ? 'auto' : 'none'}
      >
        <TouchableOpacity 
          style={{ flex: 1 }} 
          activeOpacity={1} 
          onPress={onClose}
        />
      </Animated.View>
      
      <Animated.View style={modalStyle} pointerEvents={isVisible ? 'auto' : 'none'}>
        <View style={styles.modalBackground}>
          {/* Header - visible during animation */}
          <View style={styles.header}>
            {/* Header content */}
          </View>
          
          {/* Content - fades in after animation */}
          <Animated.View style={[styles.content, contentStyle]}>
            {/* Modal content */}
          </Animated.View>
        </View>
      </Animated.View>
    </>
  );
}
```

## Best Practices

### 1. Performance Optimization

- **Use `useAnimatedStyle`**: This ensures animations run on the UI thread
- **Minimize JS bridge communication**: Avoid calling back to JS during animations
- **Use `runOnJS`** when you need to call JS functions from worklets

### 2. Animation Timing

- **Stagger animations**: Start and end animations at slightly different times for a more natural feel
- **Use custom easing**: Cubic bezier curves create more natural motion
- **Adjust durations**: Opening animations are typically longer than closing animations

### 3. Visual Continuity

- **Maintain visual elements**: Keep key elements consistent between source and destination
- **Animate multiple properties**: Animate position, size, opacity, and other properties together
- **Add subtle effects**: Small scale changes or slight overshooting can add polish

### 4. State Management

- **Delay state clearing**: Don't clear state until animations complete
- **Use `useMemo`** for stable lists to prevent reordering during animations
- **Manage z-index carefully**: Ensure proper layering during transitions

## Troubleshooting

### Common Issues and Solutions

1. **Flickering or Jumping**
   - Ensure measurements are accurate
   - Verify z-index values
   - Check for layout changes during animation

2. **Animation Not Starting**
   - Verify isVisible prop changes
   - Check if position data is available
   - Ensure component is mounted

3. **Performance Issues**
   - Reduce JS thread work during animations
   - Simplify interpolations
   - Use `useAnimatedReaction` for complex dependencies

4. **Animation Looks Unnatural**
   - Adjust easing functions
   - Stagger animation timing
   - Add subtle secondary animations

5. **Elements Disappear During Animation**
   - Check overflow settings
   - Verify opacity values
   - Ensure proper z-index management

---

By following this guide, you can implement smooth, visually appealing shared element transitions in your React Native application using Reanimated. These animations enhance the user experience by providing visual continuity between different views and states.