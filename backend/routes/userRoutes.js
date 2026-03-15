const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { getMe, updateMe, deleteMe } = require('../controllers/userController');

// Validation for profile update
const updateValidation = [
  body('firstName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('First name cannot be blank'),
  body('comfortLevel')
    .optional()
    .isIn(['beginner', 'medium', 'advanced'])
    .withMessage('Comfort level must be beginner, medium, or advanced'),
];

// All user routes require authentication
router.use(protect);

// @route  GET /api/users/me
router.get('/me', getMe);

// @route  PUT /api/users/me
router.put('/me', updateValidation, updateMe);

// @route  DELETE /api/users/me
router.delete('/me', deleteMe);

module.exports = router;
