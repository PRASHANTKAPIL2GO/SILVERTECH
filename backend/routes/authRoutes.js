const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login } = require('../controllers/authController');

// Validation rules for registration
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('comfortLevel')
    .optional()
    .isIn(['beginner', 'medium', 'advanced'])
    .withMessage('Comfort level must be beginner, medium, or advanced'),
];

// Validation rules for login
const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// @route  POST /api/auth/register
router.post('/register', registerValidation, register);

// @route  POST /api/auth/login
router.post('/login', loginValidation, login);

module.exports = router;
