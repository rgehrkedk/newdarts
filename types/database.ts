export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          username: string;
          display_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          username?: string;
          display_name?: string | null;
          avatar_url?: string | null;
        };
      };
      players: {
        Row: {
          id: string;
          name: string;
          is_guest: boolean;
          user_id: string | null;
          created_by: string;
          claimed_at: string | null;
          claim_code: string | null;
          claim_expiry: string | null;
          created_at: string;
          game_avg: number;
          checkout_percentage: number;
          color: string;
        };
        Insert: {
          name: string;
          color?: string;
          game_avg?: number;
          checkout_percentage?: number;
          user_id?: string | null;
          claimed_at?: string | null;
          claim_code?: string | null;
          claim_expiry?: string | null;
        };
        Update: {
          name?: string;
          color?: string;
          game_avg?: number;
          checkout_percentage?: number;
          user_id?: string | null;
          claimed_at?: string | null;
          claim_code?: string | null;
          claim_expiry?: string | null;
        };
      };
    };
    Views: {
      player_stats: {
        Row: {
          player_id: string;
          name: string;
          is_guest: boolean;
          games_played: number;
          games_won: number;
          win_rate: number;
          game_avg: number;
          best_score: number;
          last_played: string | null;
        };
      };
    };
  };
}