const aiClient = require('../utils/aiClient');
const User = require('../models/user.model');
const WomanProfile = require('../models/womanProfile.model');

// Chat with AI assistant
const chat = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    // Get user context
    const userProfile = await WomanProfile.findOne({ userId });
    const context = {
      userRole: req.user.role,
      userName: req.user.name,
      userStage: userProfile?.stage,
      userServices: userProfile?.servicesNeeded,
      userRegion: userProfile?.regionPref,
    };

    const response = await aiClient.chat(userId, message, context);

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat request',
      error: error.message,
    });
  }
};

// Get personalized recommendations
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user profile
    const userProfile = await WomanProfile.findOne({ userId });
    
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found. Please complete your profile first.',
      });
    }

    const recommendations = await aiClient.getRecommendations(userId, userProfile);

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get recommendations',
      error: error.message,
    });
  }
};

// Generate health summary
const generateHealthSummary = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period = '7' } = req.query; // days

    // Get user profile and recent data
    const userProfile = await WomanProfile.findOne({ userId });
    
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    // Mock health data - in real implementation, this would come from health tracking
    const healthData = {
      period: parseInt(period),
      stage: userProfile.stage,
      servicesUsed: userProfile.servicesNeeded,
      region: userProfile.regionPref,
      // Add more health metrics as needed
    };

    const summary = await aiClient.generateHealthSummary(userId, healthData);

    res.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error('Generate health summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate health summary',
      error: error.message,
    });
  }
};

// Analyze caregiver compatibility
const analyzeCaregiverCompatibility = async (req, res) => {
  try {
    const { caregiverId } = req.params;
    const userId = req.user._id;

    // Get user profile
    const userProfile = await WomanProfile.findOne({ userId });
    
    if (!userProfile) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    // Get caregiver profile
    const Caregiver = require('../models/caregiver.model');
    const caregiver = await Caregiver.findById(caregiverId);
    
    if (!caregiver) {
      return res.status(404).json({
        success: false,
        message: 'Caregiver not found',
      });
    }

    const analysis = await aiClient.analyzeCaregiverCompatibility(userProfile, caregiver);

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Analyze caregiver compatibility error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze caregiver compatibility',
      error: error.message,
    });
  }
};

// Get AI insights for admin
const getAIInsights = async (req, res) => {
  try {
    // This would typically involve analyzing platform data
    // For now, return mock insights
    const insights = {
      trendingServices: [
        { service: 'baby_massage', growth: 25 },
        { service: 'nutrition_cooking', growth: 18 },
        { service: 'emotional_support', growth: 12 },
      ],
      userSatisfaction: {
        average: 4.2,
        trend: 'increasing',
      },
      recommendations: [
        'Consider expanding baby massage services in Mumbai',
        'High demand for nutrition cooking in Delhi',
        'Emotional support services showing growth potential',
      ],
    };

    res.json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error('Get AI insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI insights',
      error: error.message,
    });
  }
};

module.exports = {
  chat,
  getRecommendations,
  generateHealthSummary,
  analyzeCaregiverCompatibility,
  getAIInsights,
};
