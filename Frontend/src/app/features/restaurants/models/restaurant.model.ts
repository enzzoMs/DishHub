export interface Restaurant {
  id: number;
  name: string;
  description: string;
  location: string;
  score: number;
}

const RESTAURANT_MIN_SCORE = 1;
const RESTAURANT_MAX_SCORE = 5;

/**
 * Parses a string into a score number, ensuring that is within a valid range.
 * @returns The parsed score or null if the value is invalid.
 */
export function parseRestaurantScore(scoreStr: string | null): number | null {
  if (scoreStr === null) return null;

  const scoreValue = Number(scoreStr);

  if (
    isNaN(scoreValue) ||
    scoreValue < RESTAURANT_MIN_SCORE ||
    scoreValue > RESTAURANT_MAX_SCORE
  ) {
    return null;
  }

  return scoreValue;
}
