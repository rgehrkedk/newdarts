export function calculateAverage(totalScore: number, totalDarts: number): number {
  if (totalDarts === 0) return 0;
  return Number(((totalScore / totalDarts) * 3).toFixed(2));
}

export function calculateCheckoutPercentage(successes: number, attempts: number): number {
  if (attempts === 0) return 0;
  return Number(((successes / attempts) * 100).toFixed(2));
}

export function calculateGameAverage(turns: number[], totalDarts: number): number {
  const gameTotalScore = turns.reduce((acc, s) => acc + s, 0);
  return totalDarts > 0 ? Number(((gameTotalScore / totalDarts) * 3).toFixed(2)) : 0;
}