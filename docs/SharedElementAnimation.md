# Shared Element Animation Implementation in Darts Scorer App

This document explains the implementation of shared element animations in the Darts Scorer App, specifically for the transition between the Leaderboard items and the Player Stats overlay.

## Overview

Shared element animations provide visual continuity when navigating between different views. In our implementation, we create a smooth transition from a player item in the leaderboard to a detailed player stats view. The animation creates the illusion that the leaderboard item expands into the full player stats screen.

## Implementation Details

### Components Involved

1. **LeaderboardItem**: The source component that initiates the animation when tapped.
2. **PlayerStatsOverlay**: The destination component that animates from the leaderboard item position to a full-screen overlay.
3. **Avatar**: A shared element that animates between both views.

### Animation Flow

1. User taps on a player in the leaderboard.
2. The app measures the exact position and dimensions of the tapped item.
3. The PlayerStatsOverlay appears at the exact same position as the tapped item.
4. The overlay smoothly animates from the item's position to fill most of the screen.
5. Once expanded, the content inside the overlay fades in.
6. When closing, the animation reverses.

### Key Animation Techniques

#### 1. Measuring Source Elements

We measure the exact position and dimensions of the leaderboard item using React's `measure()` method:

```javascript
cardRef.current.measure((x, y, width, height, pageX, pageY) => {
  onPress(enhancedPlayer, {
    x: pageX,
    y: pageY,
    width,
    height
  });
});
```

#### 2. Animated Values

We use several animated values to control different aspects of the transition:

- **progress**: Controls the main animation sequence (0 to 1)
- **opacity**: Controls background overlay opacity
- **contentOpacity**: Controls the fade-in of destination content

#### 3. Interpolation

We use interpolation to map the progress value (0-1) to specific visual properties:

```javascript
left: interpolate(
  progress.value,
  [0, 1],
  [initialX, targetX],
  Extrapolate.CLAMP
)
```

#### 4. Shared Transition Tags

For elements that should maintain visual continuity (like the Avatar), we use sharedTransitionTag:

```javascript
<Avatar
  name={player.name}
  color={player.color}
  size={40}
  sharedTransitionTag={player.id}
/>
```

## Code Architecture

### Animation Lifecycle

The animation is controlled in the PlayerStatsOverlay component:

```javascript
useEffect(() => {
  if (isVisible) {
    // Opening animation sequence
    opacity.value = withTiming(1, { duration: 300 });
    progress.value = withTiming(1, {
      duration: 500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    contentOpacity.value = withTiming(1, {
      duration: 400,
      delay: 200, // Delay content appearance
    });
  } else {
    // Closing animation sequence
    contentOpacity.value = withTiming(0, { duration: 200 });
    opacity.value = withTiming(0, { duration: 300 });
    progress.value = withTiming(0, {
      duration: 400, 
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }
}, [isVisible, progress, opacity, contentOpacity]);
```

### Animated Styles

The animation relies on three key animated styles:

1. **modalStyle**: Controls the position, size, and shape of the main overlay.
2. **overlayStyle**: Controls the background dimming effect.
3. **contentStyle**: Controls the fade-in/out of content inside the overlay.

## Best Practices

1. **Performance Optimization**:
   - Use `useAnimatedStyle` for UI thread animations
   - Keep JS thread work minimal during animations

2. **Animation Timing**:
   - Stagger animations for a more natural feel
   - Use bezier curve easing for fluid motion
   - Opening animations are slightly longer than closing

3. **Visual Continuity**:
   - Shared elements (avatar, name, rank) maintain visual connection
   - Animate multiple properties together (position, size, opacity)
   - Use subtle fade effects for a polished look

## Usage in the App

The animation is implemented in the following files:

1. `/app/(tabs)/leaderboard.tsx`: Main screen that manages player selection and coordinates the animation.
2. `/components/ui/molecules/LeaderboardItem.tsx`: Source component that provides initial measurements.
3. `/components/stats/components/PlayerStatsOverlay.tsx`: Destination component that handles all animation logic.

## Future Enhancements

Potential improvements to the shared element animation:

1. Add subtle scale effect during transitions
2. Implement hero image transitions for player photos
3. Animate individual stat items with staggered reveals
4. Add gesture-based dismissal of the overlay

---

This implementation enhances the user experience by providing visual continuity between the leaderboard list and detailed player statistics, making the app feel more fluid and responsive.