const axios = require('axios');

class AIClient {
  constructor() {
    this.baseURL = process.env.AI_SERVICE_URL || 'http://localhost:5001/api/ai';
    this.openaiKey = process.env.OPENAI_API_KEY;
  }

  // Chat with AI assistant
  async chat(userId, message, context = {}) {
    try {
      const response = await axios.post(`${this.baseURL}/chat`, {
        userId,
        message,
        context,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiKey}`,
        },
        timeout: 30000, // 30 seconds timeout
      });

      return response.data;
    } catch (error) {
      console.error('AI chat error:', error);
      
      // Fallback response
      return {
        success: false,
        message: 'AI service is temporarily unavailable. Please try again later.',
        response: 'I apologize, but I\'m having trouble connecting right now. Please try again in a few moments.',
      };
    }
  }

  // Get personalized recommendations
  async getRecommendations(userId, userProfile) {
    try {
      const response = await axios.post(`${this.baseURL}/recommendations`, {
        userId,
        profile: userProfile,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiKey}`,
        },
        timeout: 30000,
      });

      return response.data;
    } catch (error) {
      console.error('AI recommendations error:', error);
      
      // Fallback recommendations
      return {
        success: false,
        recommendations: [
          'Stay hydrated and maintain a balanced diet',
          'Get adequate rest and sleep',
          'Practice gentle exercises as recommended by your doctor',
          'Connect with support groups for emotional well-being',
        ],
      };
    }
  }

  // Generate health summary
  async generateHealthSummary(userId, healthData) {
    try {
      const response = await axios.post(`${this.baseURL}/health-summary`, {
        userId,
        healthData,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiKey}`,
        },
        timeout: 30000,
      });

      return response.data;
    } catch (error) {
      console.error('AI health summary error:', error);
      
      return {
        success: false,
        summary: 'Unable to generate health summary at this time.',
      };
    }
  }

  // Analyze caregiver compatibility
  async analyzeCaregiverCompatibility(userProfile, caregiverProfile) {
    try {
      const response = await axios.post(`${this.baseURL}/caregiver-analysis`, {
        userProfile,
        caregiverProfile,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiKey}`,
        },
        timeout: 30000,
      });

      return response.data;
    } catch (error) {
      console.error('AI caregiver analysis error:', error);
      
      return {
        success: false,
        compatibility: 0.5,
        insights: ['Analysis unavailable at this time'],
      };
    }
  }
}

module.exports = new AIClient();
