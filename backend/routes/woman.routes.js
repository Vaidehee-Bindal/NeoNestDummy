const express = require('express');
const { body, query } = require('express-validator');
const womanController = require('../controllers/woman.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { womanOnly } = require('../middlewares/role.middleware');
const validateRequest = require('../middlewares/validation.middleware');

const router = express.Router();

// All routes require authentication and woman role
router.use(authMiddleware);
router.use(womanOnly);

// Profile routes
router.get('/profile', womanController.getProfile);

router.put('/profile', [
  body('address.city').optional().trim().isLength({ min: 2 }).withMessage('City must be at least 2 characters'),
  body('address.state').optional().trim().isLength({ min: 2 }).withMessage('State must be at least 2 characters'),
  body('address.pincode').optional().matches(/^[1-9][0-9]{5}$/).withMessage('Invalid Indian pincode'),
  body('stage').optional().isIn(['pregnant', 'postpartum_early', 'postpartum_late', 'newborn_care']).withMessage('Invalid stage'),
  body('servicesNeeded').optional().isArray().withMessage('Services must be an array'),
  body('budget.min').optional().isNumeric().withMessage('Min budget must be a number'),
  body('budget.max').optional().isNumeric().withMessage('Max budget must be a number'),
], validateRequest, womanController.updateProfile);

// Caregiver search and details
router.get('/caregivers/search', [
  query('city').optional().trim().isLength({ min: 2 }).withMessage('City must be at least 2 characters'),
  query('skills').optional().isString().withMessage('Skills must be a string'),
  query('budgetMin').optional().isNumeric().withMessage('Min budget must be a number'),
  query('budgetMax').optional().isNumeric().withMessage('Max budget must be a number'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
], validateRequest, womanController.searchCaregivers);

router.get('/caregivers/:caregiverId', womanController.getCaregiverDetails);

// Booking routes
router.post('/bookings', [
  body('caregiverId').isMongoId().withMessage('Invalid caregiver ID'),
  body('service').isIn(['baby_massage', 'mother_massage', 'nutrition_cooking', 'household_help', 'emotional_support', 'breastfeeding_support']).withMessage('Invalid service'),
  body('startDate').isISO8601().withMessage('Invalid start date'),
  body('endDate').isISO8601().withMessage('Invalid end date'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid start time format'),
  body('endTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid end time format'),
  body('address.street').optional().trim().isLength({ min: 5 }).withMessage('Street address must be at least 5 characters'),
  body('address.city').trim().isLength({ min: 2 }).withMessage('City must be at least 2 characters'),
  body('address.state').trim().isLength({ min: 2 }).withMessage('State must be at least 2 characters'),
  body('address.pincode').matches(/^[1-9][0-9]{5}$/).withMessage('Invalid Indian pincode'),
], validateRequest, womanController.createBooking);

router.get('/bookings', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['AWAITING_PAYMENT', 'PAID_PENDING_ADMIN', 'FORWARDED_TO_ORG', 'ORG_ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED', 'REFUNDED']).withMessage('Invalid status'),
], validateRequest, womanController.getBookings);

router.put('/bookings/:bookingId/cancel', [
  body('reason').trim().isLength({ min: 5 }).withMessage('Cancellation reason must be at least 5 characters'),
], validateRequest, womanController.cancelBooking);

// Review routes
router.post('/bookings/:bookingId/review', [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('feedback').trim().isLength({ min: 10, max: 500 }).withMessage('Feedback must be 10-500 characters'),
  body('categories.punctuality').optional().isInt({ min: 1, max: 5 }).withMessage('Punctuality rating must be between 1 and 5'),
  body('categories.professionalism').optional().isInt({ min: 1, max: 5 }).withMessage('Professionalism rating must be between 1 and 5'),
  body('categories.skill').optional().isInt({ min: 1, max: 5 }).withMessage('Skill rating must be between 1 and 5'),
  body('categories.communication').optional().isInt({ min: 1, max: 5 }).withMessage('Communication rating must be between 1 and 5'),
], validateRequest, womanController.submitReview);

module.exports = router;
