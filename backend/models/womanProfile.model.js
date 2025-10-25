const mongoose = require('mongoose');

const womanProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  address: {
    street: String,
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    pincode: {
      type: String,
      required: true,
    },
    landmark: String,
  },
  stage: {
    type: String,
    enum: ['pregnant', 'postpartum_early', 'postpartum_late', 'newborn_care'],
    required: true,
  },
  servicesNeeded: [{
    type: String,
    enum: ['baby_massage', 'mother_massage', 'nutrition_cooking', 'household_help', 'emotional_support', 'breastfeeding_support'],
  }],
  regionPref: {
    type: String,
    required: true,
  },
  budget: {
    min: {
      type: Number,
      required: true,
    },
    max: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
  },
  preferredTimings: {
    startTime: String,
    endTime: String,
    days: [String], // ['monday', 'tuesday', etc.]
  },
  specialRequirements: String,
  emergencyContact: {
    name: String,
    phone: String,
    relation: String,
  },
  medicalHistory: String,
  allergies: [String],
}, {
  timestamps: true,
});

module.exports = mongoose.model('WomanProfile', womanProfileSchema);
