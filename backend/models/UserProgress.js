const mongoose = require('mongoose');

/**
 * UserProgress Schema
 * Tracks a user's progress within a specific learning module.
 * Stores the current difficulty level which is adjusted by adaptive logic.
 */
const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    moduleId: {
      type: String,
      required: [true, 'Module ID is required'],
      trim: true,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: [0, 'Completion percentage cannot be negative'],
      max: [100, 'Completion percentage cannot exceed 100'],
    },
    // Difficulty level: 1 = easiest, higher numbers = harder
    currentDifficulty: {
      type: Number,
      default: 1,
      min: [1, 'Difficulty cannot be below 1'],
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    lastAccessed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one progress record per user per module
userProgressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', userProgressSchema);
