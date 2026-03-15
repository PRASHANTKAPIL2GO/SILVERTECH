const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { getProgress, updateProgress } = require('../controllers/progressController');

// Validation for progress update
const updateProgressValidation = [
  body('moduleId').trim().notEmpty().withMessage('Module ID is required'),
  body('completionPercentage')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Completion percentage must be between 0 and 100'),
  body('currentDifficulty')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Difficulty must be a positive integer'),
  body('isCompleted').optional().isBoolean().withMessage('isCompleted must be boolean'),
];

// All progress routes require authentication
router.use(protect);

// @route  GET /api/progress/:moduleId
router.get('/:moduleId', getProgress);

// @route  POST /api/progress/update
router.post('/update', updateProgressValidation, updateProgress);

module.exports = router;
