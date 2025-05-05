import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { spacing } from '@/constants/theme';
import { useThemeColors } from '@/constants/theme/colors';
import { Text } from '@/components/ui/atoms/Text';
import { Card } from '@/components/ui/atoms/Card';
import { SegmentedControl } from '@/components/ui/molecules/SegmentedControl';
import { useState } from 'react';
import { SavedPlayer } from '@/types/game';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react-native';
import { StatType, Period, usePlayerTrends } from '@/hooks/usePlayerTrends';
import Svg, { Path, Line, Circle, Text as SvgText } from 'react-native-svg';

interface TrendChartProps {
  player: SavedPlayer;
}

export function TrendChart({ player }: TrendChartProps) {
  const colors = useThemeColors();
  const [period, setPeriod] = useState<Period>('7d');
  const [statType, setStatType] = useState<StatType>('gameAverage');
  const { loading, getTrendForType, refreshData } = usePlayerTrends(player);
  
  const trendData = getTrendForType(statType);
  const dataPoints = trendData.dataPoints;

  const getStatLabel = () => {
    switch (statType) {
      case 'gameAverage': return 'Game Average';
      case 'checkoutPercent': return 'Checkout %';
      case 'winRate': return 'Win Rate';
      default: return '';
    }
  };

  const getStatSuffix = () => {
    switch (statType) {
      case 'gameAverage': return 'pts';
      case 'checkoutPercent': return '%';
      case 'winRate': return '%';
      default: return '';
    }
  };

  const handlePeriodChange = (value: string) => {
    const newPeriod = value as Period;
    setPeriod(newPeriod);
    refreshData(newPeriod);
  };

  const handleStatTypeChange = (value: string) => {
    setStatType(value as StatType);
  };

  const getTrendIcon = () => {
    switch (trendData.trend) {
      case 'up': return ArrowUp;
      case 'down': return ArrowDown;
      default: return Minus;
    }
  };

  const getTrendColor = () => {
    switch (trendData.trend) {
      case 'up': return colors.brand.success;
      case 'down': return colors.brand.error;
      default: return colors.text.secondary;
    }
  };

  const TrendIcon = getTrendIcon();

  // Chart dimensions and padding
  const chartWidth = Dimensions.get('window').width - 80; // Accounting for padding
  const chartHeight = 180;
  const paddingTop = 20;
  const paddingBottom = 30;
  const paddingLeft = 30;
  const paddingRight = 10;

  const renderChart = () => {
    if (loading) {
      return (
        <View style={[styles.chartPlaceholder, { backgroundColor: colors.background.tertiary }]}>
          <ActivityIndicator size="small" color={colors.brand.primary} />
        </View>
      );
    }

    if (dataPoints.length < 2) {
      return (
        <View style={[styles.chartPlaceholder, { backgroundColor: colors.background.tertiary }]}>
          <Text variant="secondary" size="xs">Play more games to see your performance trend</Text>
        </View>
      );
    }

    // Calculate min and max values with padding
    const values = dataPoints.map(point => point.value);
    let minValue = Math.min(...values);
    let maxValue = Math.max(...values);

    const range = maxValue - minValue;
    minValue = Math.max(0, minValue - range * 0.1);
    maxValue = maxValue + range * 0.1;

    // Scale factors
    const xScale = (chartWidth - paddingLeft - paddingRight) / (dataPoints.length - 1);
    const yScale = (chartHeight - paddingTop - paddingBottom) / (maxValue - minValue || 1);

    // Generate horizontal grid lines
    const numHorizontalLines = 4;
    const horizontalLines = [];
    for (let i = 0; i <= numHorizontalLines; i++) {
      const y = paddingTop + ((chartHeight - paddingTop - paddingBottom) * i) / numHorizontalLines;
      const value = maxValue - ((maxValue - minValue) * i) / numHorizontalLines;
      
      horizontalLines.push(
        <Line
          key={`h-${i}`}
          x1={paddingLeft}
          y1={y}
          x2={chartWidth - paddingRight}
          y2={y}
          stroke={colors.border.primary}
          strokeDasharray="4,4"
          opacity={0.5}
        />
      );
      
      // Add labels on the y-axis
      horizontalLines.push(
        <SvgText
          key={`label-${i}`}
          x={paddingLeft - 5}
          y={y + 4}
          fill={colors.text.secondary}
          fontSize="10"
          textAnchor="end"
        >
          {Math.round(value)}
        </SvgText>
      );
    }

    // Generate the path for the line
    let linePath = "";
    dataPoints.forEach((point, i) => {
      const x = paddingLeft + i * xScale;
      const y = chartHeight - paddingBottom - (point.value - minValue) * yScale;
      
      if (i === 0) {
        linePath += `M ${x} ${y}`;
      } else {
        linePath += ` L ${x} ${y}`;
      }
    });

    // Generate data points
    const circles = dataPoints.map((point, i) => {
      const x = paddingLeft + i * xScale;
      const y = chartHeight - paddingBottom - (point.value - minValue) * yScale;
      
      return (
        <Circle
          key={`circle-${i}`}
          cx={x}
          cy={y}
          r={3}
          fill={colors.brand.primary}
          opacity={i === dataPoints.length - 1 ? 1 : 0.7}
        />
      );
    });

    // Generate date labels for x-axis (just show first, middle, last)
    const dateLabels = [];
    const showDates = [0, Math.floor(dataPoints.length / 2), dataPoints.length - 1];
    
    showDates.forEach(index => {
      if (index < dataPoints.length) {
        const x = paddingLeft + index * xScale;
        const dateObj = new Date(dataPoints[index].date);
        const dateLabel = `${dateObj.getDate()}/${dateObj.getMonth() + 1}`;
        
        dateLabels.push(
          <SvgText
            key={`date-${index}`}
            x={x}
            y={chartHeight - 10}
            fill={colors.text.secondary}
            fontSize="8"
            textAnchor="middle"
          >
            {dateLabel}
          </SvgText>
        );
      }
    });

    return (
      <Svg width={chartWidth} height={chartHeight}>
        {horizontalLines}
        <Path
          d={linePath}
          stroke={getTrendColor()}
          strokeWidth="2"
          fill="none"
        />
        {circles}
        {dateLabels}
      </Svg>
    );
  };

  return (
    <View>
      <Text size="lg" weight="semibold" style={styles.title}>Performance Trend</Text>
      
      <View style={styles.controls}>
        <SegmentedControl
          options={[
            { label: '7 Days', value: '7d' },
            { label: '30 Days', value: '30d' },
            { label: 'All Time', value: 'all' },
          ]}
          value={period}
          onChange={handlePeriodChange}
        />

        <SegmentedControl
          options={[
            { label: 'Game Average', value: 'gameAverage' },
            { label: 'Checkout %', value: 'checkoutPercent' },
            { label: 'Win Rate', value: 'winRate' },
          ]}
          value={statType}
          onChange={handleStatTypeChange}
        />
      </View>

      <Card variant="secondary">
        <View style={styles.chartHeader}>
          <View>
            <Text variant="secondary" size="xs">{getStatLabel()}</Text>
            <View style={styles.currentValue}>
              <Text size="xl" weight="semibold">
                {trendData.currentValue.toFixed(1)}
              </Text>
              <Text variant="secondary" size="xs" style={styles.suffix}>
                {getStatSuffix()}
              </Text>
            </View>
          </View>
          
          {trendData.previousValue !== null && trendData.percentChange > 0 && (
            <View style={[styles.trendIndicator, { backgroundColor: `${getTrendColor()}15` }]}>
              <TrendIcon size={14} color={getTrendColor()} />
              <Text size="xs" style={{ color: getTrendColor() }}>
                {trendData.percentChange.toFixed(1)}%
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.chartContainer}>
          {renderChart()}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: spacing.md,
  },
  controls: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  currentValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  suffix: {
    marginLeft: spacing.xs,
  },
  trendIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.full,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartPlaceholder: {
    width: '100%',
    height: 180,
    borderRadius: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});