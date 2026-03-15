const { validationResult } = require('express-validator');
const UserProgress = require('../models/UserProgress');

/**
 * @route   GET /api/progress/:moduleId
 * @desc    Get the authenticated user's progress for a specific module
 * @access  Private
 */
const getProgress = async (req, res, next) => {
  try {
    const { moduleId } = req.params;

    const progress = await UserProgress.findOne({
      userId: req.user._id,
      moduleId,
    });

    if (!progress) {
      // Return a default "not started" progress object rather than a 404
      return res.status(200).json({
        success: true,
        progress: {
          userId: req.user._id,
          moduleId,
          completionPercentage: 0,
          currentDifficulty: 1,
          isCompleted: false,
          lastAccessed: null,
        },
      });
    }

    return res.status(200).json({ success: true, progress });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/progress/update
 * @desc    Create or update progress for the authenticated user on a module.
 *          Uses upsert so a single endpoint handles both first-time and subsequent visits.
 * @access  Private
 */
const updateProgress = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { moduleId, completionPercentage, currentDifficulty, isCompleted } = req.body;

    const updatedProgress = await UserProgress.findOneAndUpdate(
      { userId: req.user._id, moduleId },
      {
        $set: {
          completionPercentage,
          currentDifficulty,
          isCompleted: isCompleted ?? false,
          lastAccessed: new Date(),
        },
      },
      {
        new: true,      // Return the updated document
        upsert: true,   // Create if not found
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.status(200).json({
      success: true,
      message: 'Progress updated successfully.',
      progress: updatedProgress,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProgress, updateProgress };
