const mongoose = require('mongoose');

/**
 * MentorReply Schema
 * A reply to a MentorPost. References both the original post and the replying user.
 */
const mentorReplySchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MentorPost',
      required: [true, 'Post ID is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    reply: {
      type: String,
      required: [true, 'Reply text is required'],
      trim: true,
      minlength: [2, 'Reply must be at least 2 characters'],
      maxlength: [2000, 'Reply cannot exceed 2000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MentorReply', mentorReplySchema);
