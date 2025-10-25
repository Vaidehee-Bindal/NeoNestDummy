const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimit.middleware');
const validateRequest = require('../middlewares/validation.middleware');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('role').isIn(['woman', 'organization', 'admin']).withMessage('Invalid role'),
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('phone').matches(/^(\+91|91)?[6-9]\d{9}$/).withMessage('Invalid Indian phone number'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required'),
];

const phoneOTPValidation = [
  body('phone').matches(/^(\+91|91)?[6-9]\d{9}$/).withMessage('Invalid Indian phone number'),
];

const verifyOTPValidation = [
  body('phone').matches(/^(\+91|91)?[6-9]\d{9}$/).withMessage('Invalid Indian phone number'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
];

const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
];

const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// Public routes
router.post('/register', authLimiter, registerValidation, validateRequest, authController.register);
router.post('/login', authLimiter, loginValidation, validateRequest, authController.login);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/send-phone-otp', phoneOTPValidation, validateRequest, authController.sendPhoneOTP);
router.post('/verify-phone-otp', verifyOTPValidation, validateRequest, authController.verifyPhoneOTP);
router.post('/forgot-password', forgotPasswordValidation, validateRequest, authController.forgotPassword);
router.post('/reset-password', resetPasswordValidation, validateRequest, authController.resetPassword);

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
