const express = require('express');
const { body, query } = require('express-validator');
const orgController = require('../controllers/org.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { orgOnly } = require('../middlewares/role.middleware');
const validateRequest = require('../middlewares/validation.middleware');
const { upload } = require('../utils/fileUpload');

const router = express.Router();

// All routes require authentication and organization role
router.use(authMiddleware);
router.use(orgOnly);

// Profile routes
router.get('/profile', orgController.getProfile);

router.put('/profile', upload.fields([
  { name: 'businessLicense', maxCount: 1 },
  { name: 'gstCertificate', maxCount: 1 },
  { name: 'bankDetails', maxCount: 1 },
]), [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('city').optional().trim().isLength({ min: 2 }).withMessage('City must be at least 2 characters'),
  body('state').optional().trim().isLength({ min: 2 }).withMessage('State must be at least 2 characters'),
  body('gstin').optional().matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/).withMessage('Invalid GSTIN format'),
  body('contactPerson.name').optional().trim().isLength({ min: 2 }).withMessage('Contact person name must be at least 2 characters'),
  body('contactPerson.phone').optional().matches(/^(\+91|91)?[6-9]\d{9}$/).withMessage('Invalid contact phone number'),
  body('contactPerson.email').optional().isEmail().withMessage('Invalid contact email'),
], validateRequest, orgController.updateProfile);

// Caregiver management routes
router.post('/caregivers', upload.fields([
  { name: 'idProof', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  { name: 'medicalCertificate', maxCount: 1 },
  { name: 'backgroundCheck', maxCount: 1 },
  { name: 'trainingCertificate', maxCount: 1 },
]), [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('phone').matches(/^(\+91|91)?[6-9]\d{9}$/).withMessage('Invalid Indian phone number'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
  body('age').isInt({ min: 18, max: 65 }).withMessage('Age must be between 18 and 65'),
  body('experience').isInt({ min: 0 }).withMessage('Experience must be a non-negative number'),
  body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('rates.hourly').isNumeric({ min: 0 }).withMessage('Hourly rate must be a positive number'),
  body('rates.daily').isNumeric({ min: 0 }).withMessage('Daily rate must be a positive number'),
  body('region.city').trim().isLength({ min: 2 }).withMessage('City must be at least 2 characters'),
  body('region.state').trim().isLength({ min: 2 }).withMessage('State must be at least 2 characters'),
  body('foodType').optional().isIn(['veg', 'non_veg', 'both']).withMessage('Invalid food type'),
], validateRequest, orgController.createCaregiver);

router.get('/caregivers', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status'),
], validateRequest, orgController.getCaregivers);

router.put('/caregivers/:caregiverId', upload.fields([
  { name: 'idProof', maxCount: 1 },
  { name: 'addressProof', maxCount: 1 },
  { name: 'medicalCertificate', maxCount: 1 },
  { name: 'backgroundCheck', maxCount: 1 },
  { name: 'trainingCertificate', maxCount: 1 },
]), [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('phone').optional().matches(/^(\+91|91)?[6-9]\d{9}$/).withMessage('Invalid Indian phone number'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Invalid email'),
  body('age').optional().isInt({ min: 18, max: 65 }).withMessage('Age must be between 18 and 65'),
  body('experience').optional().isInt({ min: 0 }).withMessage('Experience must be a non-negative number'),
  body('rates.hourly').optional().isNumeric({ min: 0 }).withMessage('Hourly rate must be a positive number'),
  body('rates.daily').optional().isNumeric({ min: 0 }).withMessage('Daily rate must be a positive number'),
], validateRequest, orgController.updateCaregiver);

// Booking management routes
router.get('/bookings', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('status').optional().isIn(['AWAITING_PAYMENT', 'PAID_PENDING_ADMIN', 'FORWARDED_TO_ORG', 'ORG_ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'DISPUTED', 'REFUNDED']).withMessage('Invalid status'),
], validateRequest, orgController.getBookings);

router.put('/bookings/:bookingId/accept', [
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
], validateRequest, orgController.acceptBooking);

router.put('/bookings/:bookingId/reject', [
  body('reason').trim().isLength({ min: 5, max: 500 }).withMessage('Reason must be 5-500 characters'),
], validateRequest, orgController.rejectBooking);

router.put('/bookings/:bookingId/status', [
  body('status').isIn(['IN_PROGRESS', 'COMPLETED']).withMessage('Invalid status'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes must be less than 500 characters'),
], validateRequest, orgController.updateBookingStatus);

module.exports = router;
