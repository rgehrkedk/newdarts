import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SavedPlayer } from '@/types/game';

export type Period = '7d' | '30d' | 'all';
export type StatType = 'gameAverage' | 'checkoutPercent' | 'winRate';

export interface DataPoint {
  date: string;
  value: number;
}

export interface TrendData {
  dataPoints: DataPoint[];
  currentValue: number;
  previousValue: number | null;
  trend: 'up' | 'down' | 'stable';
  percentChange: number;
}

export function usePlayerTrends(player: SavedPlayer | null, initialPeriod: Period = '7d') {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>(initialPeriod);
  const [gameAverageTrend, setGameAverageTrend] = useState<TrendData>({
    dataPoints: [],
    currentValue: player?.gameAvg || 0,
    previousValue: null,
    trend: 'stable',
    percentChange: 0
  });
  const [checkoutTrend, setCheckoutTrend] = useState<TrendData>({
    dataPoints: [],
    currentValue: player?.checkoutPercentage || 0,
    previousValue: null,
    trend: 'stable',
    percentChange: 0
  });
  const [winRateTrend, setWinRateTrend] = useState<TrendData>({
    dataPoints: [],
    currentValue: player?.winRate || 0,
    previousValue: null,
    trend: 'stable',
    percentChange: 0
  });

  // Mock data generator for development
  const generateMockData = (baseValue: number, period: Period): DataPoint[] => {
    const now = new Date();
    const points: DataPoint[] = [];
    const numPoints = period === '7d' ? 7 : period === '30d' ? 30 : 60;
    
    for (let i = 0; i < numPoints; i++) {
      const date = new Date();
      date.setDate(now.getDate() - (numPoints - i));
      
      // Add some random variation
      const randomOffset = (Math.random() - 0.3) * 10;
      // Add a slight upward trend
      const trendOffset = (i / numPoints) * 5;
      
      points.push({
        date: date.toISOString(),
        value: Math.max(0, baseValue + randomOffset + trendOffset)
      });
    }
    
    return points;
  };

  const calculateTrend = (points: DataPoint[]): TrendData => {
    if (points.length === 0) {
      return {
        dataPoints: [],
        currentValue: 0,
        previousValue: null,
        trend: 'stable',
        percentChange: 0
      };
    }

    const currentValue = points[points.length - 1].value;
    
    if (points.length > 1) {
      const previousValue = points[0].value;
      const diff = currentValue - previousValue;
      const percentChange = previousValue > 0 
        ? (diff / previousValue) * 100 
        : 0;
      
      const trend = percentChange > 1 ? 'up' : percentChange < -1 ? 'down' : 'stable';
      
      return {
        dataPoints: points,
        currentValue,
        previousValue,
        trend,
        percentChange: Math.abs(percentChange)
      };
    }
    
    return {
      dataPoints: points,
      currentValue,
      previousValue: null,
      trend: 'stable',
      percentChange: 0
    };
  };

  useEffect(() => {
    if (!player) return;
    
    const fetchTrendData = async () => {
      setLoading(true);
      setError(null);

      try {
        // For now, use mock data instead of fetching from Supabase
        const gameAvgPoints = generateMockData(player.gameAvg, period);
        const checkoutPoints = generateMockData(player.checkoutPercentage, period);
        const winRatePoints = generateMockData(player.winRate || 50, period);
        
        setGameAverageTrend(calculateTrend(gameAvgPoints));
        setCheckoutTrend(calculateTrend(checkoutPoints));
        setWinRateTrend(calculateTrend(winRatePoints));
      } catch (err) {
        console.error('Error fetching trend data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load trend data');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendData();
  }, [player, period]);

  const refreshData = (newPeriod?: Period) => {
    if (newPeriod) {
      setPeriod(newPeriod);
    }
  };

  return {
    loading,
    error,
    period,
    refreshData,
    gameAverageTrend,
    checkoutTrend,
    winRateTrend,
    getTrendForType: (type: StatType) => {
      switch (type) {
        case 'gameAverage': return gameAverageTrend;
        case 'checkoutPercent': return checkoutTrend;
        case 'winRate': return winRateTrend;
        default: return gameAverageTrend;
      }
    }
  };
}