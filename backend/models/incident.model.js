const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reportedAgainst: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [
      'misconduct',
      'safety_concern',
      'payment_dispute',
      'service_quality',
      'harassment',
      'fraud',
      'other'
    ],
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  evidence: [{
    type: String, // URLs to uploaded files/images
    description: String,
  }],
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium',
  },
  status: {
    type: String,
    enum: ['reported', 'under_investigation', 'resolved', 'dismissed'],
    default: 'reported',
  },
  action: {
    type: String,
    enum: ['warning', 'suspension', 'termination', 'refund', 'no_action'],
  },
  adminNotes: String,
  resolution: String,
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  resolvedAt: Date,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Incident', incidentSchema);
