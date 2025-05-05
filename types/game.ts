export interface Player {
  id: string;
  name: string;
  score: number;
  legAvg: number;
  gameAvg: number;
  checkoutPercentage: number;
  darts: number;
  isActive: boolean;
  turns: number[];
  legTurns: number[];
  legs: number;
  sets: number;
  color?: string;
  // Track checkout statistics separately
  totalCheckoutAttempts: number;
  successfulCheckouts: number;
  // Track leg-specific statistics
  dartsThrownThisLeg: number;
  totalScoreThrownThisLeg: number;
  totalScoreThrownThisMatch: number;
  // Track 180s
  oneEighties: number;
}

export interface SavedPlayer {
  id: string;
  name: string;
  color: string;
  gameAvg: number;
  checkoutPercentage: number;
  gamesPlayed?: number;
  gamesWon?: number;
  isGuest?: boolean;
  user_id?: string | null;
  highestCheckout?: number;
  bestLegAvg?: number;
  winRate?: number;
  totalOneEighties?: number;
  totalTonPlus?: number;
  totalSixtyPlus?: number;
  totalEightyPlus?: number;
  firstNine?: number;
  avgFirstNine?: number;
}

export type CheckoutType = "1dart" | "2dart" | "3dart" | "impossible" | "none";

export interface PendingScore {
  scored: number;
  isCheckout: boolean;
  previousScore?: number;
}

export interface CheckoutPrompt {
  type: "success" | "failed";
  options: number[];
  pendingScore: PendingScore;
}

export interface GameState {
  currentScore: string;
  error: string;
  isProcessing: boolean;
  history: { players: Player[]; score: number }[];
  winner: Player | null;
  legWinner: Player | null;
  setWinner: Player | null;
  gameCompletionVisible: boolean;
  legCompletionVisible: boolean;
  setCompletionVisible: boolean;
  checkoutModalVisible: boolean;
  pendingScore: PendingScore | null;
  checkoutOptions: number[];
  showBust: boolean;
  message: string;
  currentLeg: number;
  currentSet: number;
}