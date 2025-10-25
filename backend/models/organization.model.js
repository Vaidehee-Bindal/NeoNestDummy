const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  gstin: {
    type: String,
    unique: true,
    sparse: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  contactPerson: {
    name: String,
    phone: String,
    email: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  verificationDocuments: {
    businessLicense: String,
    gstCertificate: String,
    bankDetails: String,
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
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Organization', organizationSchema);
