# Darts Scorer App

A professional darts scoring application built with Expo Router, featuring real-time score tracking, statistics, and player management.

## Features

- 🎯 Real-time score tracking and statistics
- 👥 Player management with customizable profiles
- 🎮 Multiple game variants (101, 201, 301, 501, 701)
- 📊 Detailed game statistics and averages
- 🌓 Dark/Light theme support
- 🔐 User authentication
- 💾 Data persistence with Supabase
- 📱 Cross-platform (iOS, Android, Web)
- 🎨 Beautiful, modern UI design
- 📈 Real-time statistics updates
- 🔄 Undo/redo functionality
- 🏆 Game completion tracking
- 📊 Player performance history

## Tech Stack

- [Expo](https://expo.dev/) - React Native framework
- [Expo Router](https://docs.expo.dev/router/introduction/) - File-based routing
- [Supabase](https://supabase.com/) - Backend and authentication
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - Animations
- [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) - Gesture handling
- [Lucide Icons](https://lucide.dev/) - Icon system
- [Expo Google Fonts](https://docs.expo.dev/guides/using-custom-fonts/) - Typography
- [Zustand](https://zustand-demo.pmnd.rs/) - State management

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- Supabase account

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```bash
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_SITE_URL=your_site_url
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/darts-scorer.git
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Project Structure

```
├── app/                   # Application routes
│   ├── (tabs)/           # Tab-based navigation
│   │   ├── _layout.tsx   # Tab navigation configuration
│   │   ├── index.tsx     # Home screen
│   │   ├── setup/        # Game setup screens
│   │   └── profile/      # User profile screens
│   ├── auth.tsx          # Authentication screen
│   ├── game/             # Game-related screens
│   └── _layout.tsx       # Root layout
├── components/           # Reusable components
│   ├── game/            # Game-specific components
│   │   ├── PlayerCard.tsx
│   │   ├── PlayerStats.tsx
│   │   ├── ScoreInput.tsx
│   │   └── ...
│   ├── setup/           # Setup-related components
│   └── ui/              # UI components
│       ├── atoms/       # Basic building blocks
│       ├── molecules/   # Composite components
│       └── organisms/   # Complex components
├── constants/           # Constants and theme
│   ├── theme/          # Theme configuration
│   └── game.ts         # Game-related constants
├── hooks/              # Custom hooks
├── lib/               # Library configurations
├── providers/        # Context providers
├── stores/          # State management
├── supabase/       # Database migrations
└── types/         # TypeScript types
```

## Core Features Documentation

### Authentication System

The app implements a secure authentication system using Supabase:

```typescript
const { signIn, signUp, signOut } = useAuth();

// Sign in with email/password
await signIn(email, password);

// Create new account
await signUp(email, password);

// Sign out current user
await signOut();
```

### Game Engine

The game engine handles:

- Score calculation and validation
- Turn management
- Statistics tracking
- Game state persistence
- Undo/redo functionality

```typescript
const {
  players,
  currentScore,
  activePlayer,
  handleNumberPress,
  handleSubmit,
  handleUndo,
} = useGameLogic(initialPlayers, totalLegs, totalSets);
```

### Player Management

Complete player management system:

```typescript
const {
  players,
  createPlayer,
  updatePlayer,
  deletePlayer,
} = usePlayers();

// Create new player
const player = await createPlayer({
  name: 'John Doe',
  color: '#22C55E',
  gameAvg: 0,
  checkoutPercentage: 0,
});
```

### Theme System

Comprehensive theming support:

```typescript
const { isDark, toggleTheme } = useTheme();

// Colors
const colors = useThemeColors();

// Typography
const typography = {
  families: {
    regular: 'Inter-Regular',
    semiBold: 'Inter-SemiBold',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
  },
};
```

## Component Library

### Atoms

Basic building blocks:

```typescript
// Button component
<Button
  label="Start Game"
  variant="primary"
  icon={PlayCircle}
  onPress={handleStartGame}
/>

// Input component
<Input
  value={playerName}
  onChangeText={setPlayerName}
  placeholder="Player Name"
  icon={User}
/>
```

### Molecules

Composite components:

```typescript
// Counter component
<Counter
  label="Legs"
  value={legs}
  onIncrement={() => setLegs(legs + 1)}
  onDecrement={() => setLegs(legs - 1)}
/>

// ColorPicker component
<ColorPicker
  selectedColor={color}
  onSelectColor={setColor}
/>
```

### Organisms

Complex components:

```typescript
// PlayerStats component
<PlayerStats
  player={activePlayer}
  showHistory
  animated
/>

// ScoreInput component
<ScoreInput
  currentScore={score}
  onSubmit={handleSubmit}
  onUndo={handleUndo}
/>
```

## Database Schema

### Players Table
```sql
CREATE TABLE players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text NOT NULL,
  game_avg numeric DEFAULT 0,
  checkout_percentage numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id)
);
```

### Games Table
```sql
CREATE TABLE games (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  variant integer NOT NULL,
  total_legs integer NOT NULL,
  total_sets integer NOT NULL,
  status text NOT NULL DEFAULT 'in_progress',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);
```

### Game Players Table
```sql
CREATE TABLE game_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  final_position integer,
  game_avg numeric DEFAULT 0,
  checkout_percentage numeric DEFAULT 0,
  total_darts integer DEFAULT 0,
  legs_won integer DEFAULT 0,
  sets_won integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
```

### Turns Table
```sql
CREATE TABLE turns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id uuid REFERENCES games(id) ON DELETE CASCADE,
  player_id uuid REFERENCES players(id) ON DELETE CASCADE,
  score integer NOT NULL,
  darts integer NOT NULL,
  leg_number integer NOT NULL,
  set_number integer NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

## Performance Optimization

The app implements several performance optimizations:

- Memoization of expensive calculations
- Efficient re-rendering with React.memo
- Optimized animations using Reanimated
- Proper list virtualization
- Image optimization and caching
- Efficient state management with Zustand

## Error Handling

Comprehensive error handling strategy:

```typescript
try {
  await operation();
} catch (err) {
  if (err instanceof AuthError) {
    // Handle authentication errors
  } else if (err instanceof NetworkError) {
    // Handle network errors
  } else {
    // Handle other errors
  }
}
```

## Testing

The project includes:

- Unit tests for core logic
- Component tests using React Native Testing Library
- Integration tests for critical flows
- E2E tests for main user journeys

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

### Development Guidelines

- Follow the established code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure cross-platform compatibility

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please:

1. Check the documentation
2. Search existing issues
3. Create a new issue if needed

## Acknowledgments

- Expo team for the amazing framework
- Supabase team for the backend platform
- All contributors to the project