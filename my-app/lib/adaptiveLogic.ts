/**
 * Adaptive learning logic — mirrors the backend rules.
 * Determines what content difficulty level to show next.
 */

export type AdaptiveAction = 'increase' | 'decrease' | 'repeat';

export interface AdaptiveResult {
  action: AdaptiveAction;
  message: string;
}

/**
 * Evaluates the user's lesson performance and returns a difficulty action.
 *
 * @param score         - Score achieved (0–100)
 * @param attemptsCount - Number of attempts on this lesson
 */
export function evaluatePerformance(
  score: number,
  attemptsCount: number
): AdaptiveResult {
  if (score >= 80) {
    return {
      action: 'increase',
      message: "Excellent work! You're ready for a greater challenge.",
    };
  }

  if (attemptsCount >= 3) {
    return {
      action: 'decrease',
      message: "Let's try a simpler approach to build your confidence.",
    };
  }

  return {
    action: 'repeat',
    message: 'Keep practising — you are making great progress!',
  };
}

/**
 * Returns a human-friendly label for a numeric difficulty level.
 */
export function getDifficultyLabel(level: number): string {
  if (level <= 1) return 'Beginner';
  if (level === 2) return 'Intermediate';
  return 'Advanced';
}
