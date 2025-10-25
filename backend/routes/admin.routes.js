const express = require('express');
const { body, query } = require('express-validator');
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/role.middleware');
const validateRequest = require('../middlewares/validation.middleware');

const router = express.Router();

// All routes require authentication and admin role
router.use(authMiddleware);
router.use(adminOnly);

// Dashboard and analytics
router.get('/dashboard', adminController.getDashboard);
router.get('/analytics', [
  query('period').optional().isInt({ min: 1, max: 365 }).withMessage('Period must be between 1 and 365 days'),
], validateRequest, adminController.getAnalytics);

// User verification routes
router.get('/verifications', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status'),
  query('role').optional().isIn(['woman', 'organization', 'admin']).withMessage('Invalid role'),
], validateRequest, adminController.getVerifications);

router.post('/verify/:userId', [
  body('status').isIn(['approved', 'rejected']).withMessage('Invalid verification status'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
], validateRequest, adminController.verifyUser);

// Caregiver verification routes
router.get('/caregivers', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status'),
], validateRequest, adminController.getCaregivers);

router.post('/caregivers/:caregiverId/verify', [
  body('status').isIn(['approved', 'rejected']).withMessage('Invalid verification status'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
], validateRequest, adminController.verifyCaregiver);

// Booking management routes
router.get('/bookings', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['AWAITING_PAYMENT', 'PAID_PENDING_ADMIN', 'FORWARDED_TO_ORG', 'ORG_ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED', 'REFUNDED']).withMessage('Invalid status'),
], validateRequest, adminController.getBookings);

router.post('/bookings/:bookingId/forward', [
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
], validateRequest, adminController.forwardBooking);

// Incident management routes
router.get('/incidents', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['reported', 'under_investigation', 'resolved', 'dismissed']).withMessage('Invalid status'),
  query('type').optional().isIn(['misconduct', 'safety_concern', 'payment_dispute', 'service_quality', 'harassment', 'fraud', 'other']).withMessage('Invalid incident type'),
], validateRequest, adminController.getIncidents);

router.put('/incidents/:incidentId/handle', [
  body('action').isIn(['warning', 'suspension', 'termination', 'refund', 'no_action']).withMessage('Invalid action'),
  body('resolution').trim().isLength({ min: 10, max: 1000 }).withMessage('Resolution must be 10-1000 characters'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
], validateRequest, adminController.handleIncident);

module.exports = router;
