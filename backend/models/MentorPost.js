const mongoose = require('mongoose');

/**
 * MentorPost Schema
 * Represents a question or discussion post by a user, tied to a learning module.
 * Posts can be moderated before being displayed publicly.
 */
const mentorPostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    moduleContext: {
      type: String,
      required: [true, 'Module context is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      minlength: [5, 'Message must be at least 5 characters'],
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    // Flag for content moderation before public listing
    isModerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MentorPost', mentorPostSchema);
