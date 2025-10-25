const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  womanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  caregiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Caregiver',
    required: true,
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  service: {
    type: String,
    enum: ['baby_massage', 'mother_massage', 'nutrition_cooking', 'household_help', 'emotional_support', 'breastfeeding_support'],
    required: true,
  },
  date: {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in hours
      required: true,
    },
  },
  timing: {
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
  },
  pricing: {
    hourlyRate: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'INR',
    },
  },
  status: {
    type: String,
    enum: [
      'AWAITING_PAYMENT',
      'PAID_PENDING_ADMIN',
      'FORWARDED_TO_ORG',
      'ORG_ACCEPTED',
      'IN_PROGRESS',
      'COMPLETED',
      'CANCELLED',
      'DISPUTED',
      'REFUNDED'
    ],
    default: 'AWAITING_PAYMENT',
  },
  specialInstructions: String,
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String,
  },
  paymentDetails: {
    razorpayOrderId: String,
    paymentId: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
  },
  adminNotes: String,
  orgNotes: String,
  cancellationReason: String,
  refundAmount: Number,
  completedAt: Date,
  cancelledAt: Date,
}, {
  timestamps: true,
});

// Index for efficient queries
bookingSchema.index({ womanId: 1, status: 1 });
bookingSchema.index({ orgId: 1, status: 1 });
bookingSchema.index({ caregiverId: 1, status: 1 });
bookingSchema.index({ 'date.startDate': 1, 'date.endDate': 1 });

module.exports = mongoose.model('Booking', bookingSchema);
