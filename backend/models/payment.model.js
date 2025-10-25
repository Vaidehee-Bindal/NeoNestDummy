const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true,
  },
  razorpayOrderId: {
    type: String,
    required: true,
  },
  razorpayPaymentId: String,
  razorpaySignature: String,
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  status: {
    type: String,
    enum: ['created', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'created',
  },
  paymentMethod: String,
  paymentDetails: {
    card: {
      last4: String,
      network: String,
    },
    wallet: String,
    upi: String,
  },
  refundDetails: {
    refundId: String,
    refundAmount: Number,
    refundReason: String,
    refundStatus: String,
  },
  webhookData: mongoose.Schema.Types.Mixed,
  failureReason: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);
