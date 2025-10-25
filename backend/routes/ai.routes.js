const express = require('express');
const { body, query } = require('express-validator');
const aiController = require('../controllers/ai.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { womanOnly, adminOnly } = require('../middlewares/role.middleware');
const validateRequest = require('../middlewares/validation.middleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Chat route (women only)
router.post('/chat', womanOnly, [
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be 1-1000 characters'),
], validateRequest, aiController.chat);

// Recommendations route (women only)
router.get('/recommendations', womanOnly, aiController.getRecommendations);

// Health summary route (women only)
router.get('/health-summary', womanOnly, [
  query('period').optional().isInt({ min: 1, max: 365 }).withMessage('Period must be between 1 and 365 days'),
], validateRequest, aiController.generateHealthSummary);

// Caregiver compatibility analysis (women only)
router.get('/caregiver-compatibility/:caregiverId', womanOnly, aiController.analyzeCaregiverCompatibility);

// Admin insights route (admin only)
router.get('/insights', adminOnly, aiController.getAIInsights);

module.exports = router;
