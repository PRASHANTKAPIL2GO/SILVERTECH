/**
 * Adaptive Logic Utility
 *
 * Evaluates a user's performance on a lesson and returns a difficulty action.
 *
 * Rules:
 *  - score >= 80          → increase difficulty (user is excelling)
 *  - attemptsCount >= 3   → decrease difficulty (user is struggling)
 *  - otherwise            → repeat current level
 *
 * @param {number} score          - The user's score (0–100)
 * @param {number} attemptsCount  - Number of attempts made on this lesson
 * @returns {{ action: string, message: string }}
 */
const evaluateUserPerformance = (score, attemptsCount) => {
  if (score >= 80) {
    return {
      action: 'increase',
      message: 'Great job! Moving you to a higher difficulty.',
    };
  }

  if (attemptsCount >= 3) {
    return {
      action: 'decrease',
      message: "Let's try something a bit easier to build your confidence.",
    };
  }

  return {
    action: 'repeat',
    message: 'Keep going! Practice makes perfect.',
  };
};

/**
 * Apply the difficulty action to a numeric difficulty level.
 * Difficulty is clamped to a minimum of 1.
 *
 * @param {number} currentDifficulty - The existing difficulty level
 * @param {string} action            - 'increase' | 'decrease' | 'repeat'
 * @returns {number} - The new difficulty level
 */
const applyDifficultyChange = (currentDifficulty, action) => {
  switch (action) {
    case 'increase':
      return currentDifficulty + 1;
    case 'decrease':
      return Math.max(1, currentDifficulty - 1);
    default:
      return currentDifficulty;
  }
};

module.exports = { evaluateUserPerformance, applyDifficultyChange };
