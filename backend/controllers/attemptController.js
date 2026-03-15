const { validationResult } = require('express-validator');
const Attempt = require('../models/Attempt');
const UserProgress = require('../models/UserProgress');
const { evaluateUserPerformance, applyDifficultyChange } = require('../utils/adaptiveLogic');

/**
 * @route   POST /api/attempts
 * @desc    Record a lesson attempt and apply adaptive difficulty to the user's progress.
 * @access  Private
 *
 * Flow:
 *  1. Save the attempt record.
 *  2. Evaluate the score + attempt count to determine a difficulty action.
 *  3. Upsert UserProgress with the new difficulty.
 */
const recordAttempt = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { lessonId, moduleId, score, attemptsCount, passed } = req.body;

    // 1. Save attempt
    const attempt = await Attempt.create({
      userId: req.user._id,
      lessonId,
      score,
      attemptsCount,
      passed,
    });

    // 2. Evaluate performance and get difficulty action
    const { action, message } = evaluateUserPerformance(score, attemptsCount);

    // 3. Fetch existing progress (or default difficulty of 1)
    const existingProgress = await UserProgress.findOne({
      userId: req.user._id,
      moduleId,
    });
    const currentDifficulty = existingProgress ? existingProgress.currentDifficulty : 1;
    const newDifficulty = applyDifficultyChange(currentDifficulty, action);

    // 4. Upsert progress with updated difficulty
    await UserProgress.findOneAndUpdate(
      { userId: req.user._id, moduleId },
      {
        $set: {
          currentDifficulty: newDifficulty,
          lastAccessed: new Date(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json({
      success: true,
      message: 'Attempt recorded.',
      attempt,
      adaptive: {
        action,
        message,
        previousDifficulty: currentDifficulty,
        newDifficulty,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { recordAttempt };
