const express = require('express');
const { body } = require('express-validator');
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { womanOrOrg } = require('../middlewares/role.middleware');
const validateRequest = require('../middlewares/validation.middleware');
const { paymentLimiter } = require('../middlewares/rateLimit.middleware');

const router = express.Router();

// Public webhook route (no auth required)
router.post('/webhook', paymentController.handleWebhook);

// Protected routes
router.use(authMiddleware);
router.use(womanOrOrg);

// Payment routes
router.post('/create-order', paymentLimiter, [
  body('bookingId').isMongoId().withMessage('Invalid booking ID'),
], validateRequest, paymentController.createOrder);

router.post('/verify', paymentLimiter, [
  body('razorpay_order_id').notEmpty().withMessage('Razorpay order ID is required'),
  body('razorpay_payment_id').notEmpty().withMessage('Razorpay payment ID is required'),
  body('razorpay_signature').notEmpty().withMessage('Razorpay signature is required'),
  body('paymentId').isMongoId().withMessage('Invalid payment ID'),
], validateRequest, paymentController.verifyPayment);

router.get('/:paymentId', paymentController.getPaymentDetails);

// Refund route (admin only)
router.post('/:paymentId/refund', [
  body('amount').optional().isNumeric({ min: 0 }).withMessage('Refund amount must be a positive number'),
  body('reason').optional().trim().isLength({ min: 5, max: 200 }).withMessage('Reason must be 5-200 characters'),
], validateRequest, paymentController.processRefund);

module.exports = router;
