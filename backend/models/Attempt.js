const mongoose = require('mongoose');

/**
 * Attempt Schema
 * Records each time a user attempts a lesson/quiz.
 * Used by adaptive logic to determine next difficulty adjustment.
 */
const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    lessonId: {
      type: String,
      required: [true, 'Lesson ID is required'],
      trim: true,
    },
    score: {
      type: Number,
      required: [true, 'Score is required'],
      min: [0, 'Score cannot be negative'],
      max: [100, 'Score cannot exceed 100'],
    },
    attemptsCount: {
      type: Number,
      required: [true, 'Attempts count is required'],
      min: [1, 'Attempts count must be at least 1'],
    },
    passed: {
      type: Boolean,
      required: [true, 'Passed status is required'],
    },
    attemptedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Attempt', attemptSchema);
