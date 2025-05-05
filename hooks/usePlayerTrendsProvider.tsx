import React, { createContext, useContext, ReactNode } from 'react';
import { SavedPlayer } from '@/types/game';
import { Period, StatType, TrendData, usePlayerTrends } from './usePlayerTrends';

interface PlayerTrendsContextType {
  loading: boolean;
  error: string | null;
  period: Period;
  refreshData: (newPeriod?: Period) => void;
  gameAverageTrend: TrendData;
  checkoutTrend: TrendData;
  winRateTrend: TrendData;
  getTrendForType: (type: StatType) => TrendData;
}

const PlayerTrendsContext = createContext<PlayerTrendsContextType | null>(null);

export function PlayerTrendsProvider({ 
  children, 
  player 
}: { 
  children: ReactNode;
  player: SavedPlayer;
}) {
  const trendsData = usePlayerTrends(player);
  
  return (
    <PlayerTrendsContext.Provider value={trendsData}>
      {children}
    </PlayerTrendsContext.Provider>
  );
}

export const usePlayerTrendsContext = () => {
  const context = useContext(PlayerTrendsContext);
  if (!context) {
    throw new Error('usePlayerTrendsContext must be used within a PlayerTrendsProvider');
  }
  return context;
};