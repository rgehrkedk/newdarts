/**
 * Determines the type of checkout possible based on the current score.
 * Returns:
 * - '3dart' if the score requires 3 darts to checkout
 * - '2dart' if the score can be checked out with 2 darts
 * - '1dart' if the score can be checked out with 1 dart
 * - 'impossible' if the score cannot be checked out
 * - 'none' if not in checkout range
 */
export type CheckoutType = '3dart' | '2dart' | '1dart' | 'impossible' | 'none';

const IMPOSSIBLE_CHECKOUTS = [169, 168, 166, 165, 163, 162, 159];
const TWO_DART_HIGH_CHECKOUTS = [110, 107, 104, 101];
const IMPOSSIBLE_LOW_CHECKOUTS = [99];

export function getCheckoutType(score: number): CheckoutType {
  // If score is greater than 170, no checkout is possible
  if (score > 170) return 'none';
  
  // Check impossible checkouts
  if (IMPOSSIBLE_CHECKOUTS.includes(score)) {
    return 'impossible';
  }

  // Single dart checkouts (doubles 1-20 and bull)
  if ((score <= 40 && score % 2 === 0) || score === 50) {
    return '1dart';
  }

  // Known high two-dart checkouts
  if (TWO_DART_HIGH_CHECKOUTS.includes(score)) {
    return '2dart';
  }

  // Other two-dart checkouts
  if (score <= 110 && !IMPOSSIBLE_LOW_CHECKOUTS.includes(score)) {
    return '2dart';
  }

  // Three dart checkouts
  if (score <= 170) {
    return '3dart';
  }

  return 'none';
}

/**
 * Validates if a score is possible with the given number of darts.
 */
export function isScorePossible(score: number, darts: number = 3): boolean {
  if (score < 0 || score > 180) return false;
  if (darts === 1 && score > 60) return false;
  if (darts === 2 && score > 120) return false;
  return true;
}

/**
 * Determines if a score requires a double to finish.
 */
export function requiresDouble(score: number): boolean {
  return score > 0 && score <= 170;
}

/**
 * Gets possible checkout combinations for a score.
 */
export function getCheckoutCombinations(score: number): string[] {
  const combinations: string[] = [];
  const checkoutType = getCheckoutType(score);

  switch (checkoutType) {
    case '1dart':
      if (score === 50) {
        combinations.push('Bull');
      } else {
        combinations.push(`D${score / 2}`);
      }
      break;
    case '2dart':
      // Add common two-dart checkouts
      if (score > 50) {
        const remainder = score - 50;
        if (remainder <= 20 || remainder === 25) {
          combinations.push(`${remainder} Bull`);
        }
      }
      break;
    case '3dart':
      // Add common three-dart checkouts
      if (score === 170) combinations.push('T20 T20 Bull');
      if (score === 167) combinations.push('T20 T19 Bull');
      if (score === 164) combinations.push('T20 T18 Bull');
      break;
  }

  return combinations;
}