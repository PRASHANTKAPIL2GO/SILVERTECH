const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { createPost, getPostsByModule, createReply, getRepliesByPost } = require('../controllers/mentorController');

// Validation for creating a post
const postValidation = [
  body('moduleContext').trim().notEmpty().withMessage('Module context is required'),
  body('message')
    .trim()
    .isLength({ min: 5 })
    .withMessage('Message must be at least 5 characters'),
];

// Validation for creating a reply
const replyValidation = [
  body('postId').isMongoId().withMessage('Invalid post ID'),
  body('reply')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Reply must be at least 2 characters'),
];

// All mentor routes require authentication
router.use(protect);

// @route  POST /api/mentor/posts
router.post('/posts', postValidation, createPost);

// @route  GET /api/mentor/posts/:moduleId
router.get('/posts/:moduleId', getPostsByModule);

// @route  POST /api/mentor/replies
router.post('/replies', replyValidation, createReply);

// @route  GET /api/mentor/replies/:postId
router.get('/replies/:postId', getRepliesByPost);

module.exports = router;
