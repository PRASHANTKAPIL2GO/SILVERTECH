const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { recordAttempt } = require('../controllers/attemptController');

// Validation for recording an attempt
const attemptValidation = [
  body('lessonId').trim().notEmpty().withMessage('Lesson ID is required'),
  body('moduleId').trim().notEmpty().withMessage('Module ID is required'),
  body('score')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100'),
  body('attemptsCount')
    .isInt({ min: 1 })
    .withMessage('Attempts count must be at least 1'),
  body('passed').isBoolean().withMessage('Passed must be a boolean value'),
];

// @route  POST /api/attempts
router.post('/', protect, attemptValidation, recordAttempt);

module.exports = router;
