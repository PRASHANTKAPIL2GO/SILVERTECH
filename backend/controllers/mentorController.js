const { validationResult } = require('express-validator');
const MentorPost = require('../models/MentorPost');
const MentorReply = require('../models/MentorReply');

/**
 * @route   POST /api/mentor/posts
 * @desc    Create a new mentor post (question/discussion) linked to a module
 * @access  Private
 */
const createPost = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { moduleContext, message } = req.body;

    const post = await MentorPost.create({
      userId: req.user._id,
      moduleContext,
      message,
      isModerated: true, // Auto-approve — no admin moderation panel in this app
    });

    return res.status(201).json({
      success: true,
      message: 'Post created successfully and is pending moderation.',
      post,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/mentor/posts/:moduleId
 * @desc    Get all moderated mentor posts for a specific module context
 * @access  Private
 */
const getPostsByModule = async (req, res, next) => {
  try {
    const { moduleId } = req.params;

    // Only return posts that have been moderated (approved)
    const posts = await MentorPost.find({
      moduleContext: moduleId,
      isModerated: true,
    })
      .populate('userId', 'firstName') // Only expose the first name, not email/password
      .sort({ createdAt: -1 });       // Newest first

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/mentor/replies
 * @desc    Post a reply to a mentor post
 * @access  Private
 */
const createReply = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { postId, reply } = req.body;

    // Ensure the parent post exists before allowing a reply
    const parentPost = await MentorPost.findById(postId);
    if (!parentPost) {
      return res.status(404).json({
        success: false,
        message: 'The post you are trying to reply to does not exist.',
      });
    }

    const newReply = await MentorReply.create({
      postId,
      userId: req.user._id,
      reply,
    });

    return res.status(201).json({
      success: true,
      message: 'Reply posted successfully.',
      reply: newReply,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/mentor/replies/:postId
 * @desc    Get all replies for a specific mentor post
 * @access  Private
 */
const getRepliesByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const replies = await MentorReply.find({ postId })
      .populate('userId', 'firstName')
      .sort({ createdAt: 1 }); // Oldest first so thread reads naturally

    return res.status(200).json({
      success: true,
      count: replies.length,
      replies,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPost, getPostsByModule, createReply, getRepliesByPost };
