export interface CricketPlayer {
  id: string;
  name: string;
  isActive: boolean;
  color: string;
  scores: {
    20: number;
    19: number;
    18: number;
    17: number;
    16: number;
    15: number;
    25: number;
  };
  totalPoints: number;
}

export interface CricketGameState {
  players: CricketPlayer[];
  scoringType: 'cricket' | 'route';
  marksRequired: number;
}

export interface PlayerStats {
  marksPerTurn: number;
  marksDifference: number;
}