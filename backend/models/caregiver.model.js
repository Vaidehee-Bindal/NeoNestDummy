const mongoose = require('mongoose');

const caregiverSchema = new mongoose.Schema({
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 65,
  },
  experience: {
    type: Number,
    required: true,
    min: 0,
  },
  skills: [{
    type: String,
    enum: ['baby_massage', 'mother_massage', 'nutrition_cooking', 'household_help', 'emotional_support', 'breastfeeding_support', 'newborn_care'],
  }],
  rates: {
    hourly: {
      type: Number,
      required: true,
    },
    daily: {
      type: Number,
      required: true,
    },
    package: {
      weekly: Number,
      monthly: Number,
    },
    currency: {
      type: String,
      default: 'INR',
    },
  },
  region: {
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincodes: [String],
  },
  foodType: {
    type: String,
    enum: ['veg', 'non_veg', 'both'],
    default: 'both',
  },
  availability: {
    days: [{
      day: {
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      },
      startTime: String,
      endTime: String,
      isAvailable: {
        type: Boolean,
        default: true,
      },
    }],
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  verificationDocuments: {
    idProof: String,
    addressProof: String,
    medicalCertificate: String,
    backgroundCheck: String,
    trainingCertificate: String,
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  bio: String,
  languages: [String],
  specializations: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for search optimization
caregiverSchema.index({ 'region.city': 1, 'skills': 1, 'verificationStatus': 1 });
caregiverSchema.index({ 'rates.hourly': 1, 'rates.daily': 1 });

module.exports = mongoose.model('Caregiver', caregiverSchema);
