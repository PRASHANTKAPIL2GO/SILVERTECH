const { validationResult } = require('express-validator');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');
const Attempt = require('../models/Attempt');
const MentorPost = require('../models/MentorPost');
const MentorReply = require('../models/MentorReply');

/**
 * @route   GET /api/users/me
 * @desc    Get the currently authenticated user's profile
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware (without password)
    const user = req.user;

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        comfortLevel: user.comfortLevel,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/users/me
 * @desc    Update the authenticated user's profile (firstName, comfortLevel)
 * @access  Private
 */
const updateMe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    // Only allow safe fields to be updated via this endpoint
    const { firstName, comfortLevel } = req.body;
    const updateData = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (comfortLevel !== undefined) updateData.comfortLevel = comfortLevel;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        email: updatedUser.email,
        comfortLevel: updatedUser.comfortLevel,
        isVerified: updatedUser.isVerified,
        updatedAt: updatedUser.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/users/me
 * @desc    Permanently delete the authenticated user's account and all related data
 * @access  Private
 */
const deleteMe = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Cascade delete all user-related records
    await Promise.all([
      UserProgress.deleteMany({ userId }),
      Attempt.deleteMany({ userId }),
      MentorPost.deleteMany({ userId }),
      MentorReply.deleteMany({ userId }),
    ]);

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: 'Your account and all associated data have been deleted.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMe, updateMe, deleteMe };
