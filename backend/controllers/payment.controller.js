const razorpay = require('../config/razorpay');
const crypto = require('crypto');
const Booking = require('../models/booking.model');
const Payment = require('../models/payment.model');
const { sendPaymentConfirmation } = require('../utils/notification');

// Create payment order
const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    // Get booking details
    const booking = await Booking.findById(bookingId)
      .populate('womanId', 'name email')
      .populate('caregiverId', 'name');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.status !== 'AWAITING_PAYMENT') {
      return res.status(400).json({
        success: false,
        message: 'Booking is not in payment pending status',
      });
    }

    // Create Razorpay order
    const options = {
      amount: booking.pricing.totalAmount * 100, // Convert to paise
      currency: booking.pricing.currency,
      receipt: `booking_${bookingId}`,
      notes: {
        bookingId: bookingId.toString(),
        womanId: booking.womanId._id.toString(),
        caregiverId: booking.caregiverId._id.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    // Create payment record
    const payment = new Payment({
      bookingId,
      razorpayOrderId: order.id,
      amount: booking.pricing.totalAmount,
      currency: booking.pricing.currency,
    });

    await payment.save();

    res.json({
      success: true,
      data: {
        order,
        paymentId: payment._id,
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message,
    });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    // Update payment record
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found',
      });
    }

    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = 'paid';
    await payment.save();

    // Update booking status
    const booking = await Booking.findById(payment.bookingId)
      .populate('womanId', 'name email');
    
    booking.status = 'PAID_PENDING_ADMIN';
    booking.paymentDetails.paymentId = razorpay_payment_id;
    booking.paymentDetails.paymentStatus = 'completed';
    await booking.save();

    // Send payment confirmation email
    try {
      await sendPaymentConfirmation(booking.womanId.email, {
        transactionId: razorpay_payment_id,
        amount: payment.amount,
        date: new Date().toLocaleDateString(),
      });
    } catch (emailError) {
      console.error('Payment confirmation email error:', emailError);
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        payment,
        booking,
      },
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message,
    });
  }
};

// Get payment details
const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId)
      .populate('bookingId')
      .populate({
        path: 'bookingId',
        populate: {
          path: 'womanId',
          select: 'name email',
        },
      });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    res.json({
      success: true,
      data: payment,
    });
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment details',
      error: error.message,
    });
  }
};

// Process refund
const processRefund = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { amount, reason } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    if (payment.status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment is not eligible for refund',
      });
    }

    // Create refund with Razorpay
    const refundAmount = amount || payment.amount;
    const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
      amount: refundAmount * 100, // Convert to paise
      notes: {
        reason: reason || 'Customer request',
      },
    });

    // Update payment record
    payment.status = refundAmount === payment.amount ? 'refunded' : 'partially_refunded';
    payment.refundDetails = {
      refundId: refund.id,
      refundAmount: refundAmount,
      refundReason: reason,
      refundStatus: refund.status,
    };
    await payment.save();

    // Update booking status
    const booking = await Booking.findById(payment.bookingId);
    booking.status = 'REFUNDED';
    booking.refundAmount = refundAmount;
    await booking.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: {
        refund,
        payment,
      },
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process refund',
      error: error.message,
    });
  }
};

// Webhook handler for Razorpay events
const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature',
      });
    }

    const event = req.body;

    switch (event.event) {
      case 'payment.captured':
        await handlePaymentCaptured(event.payload.payment.entity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(event.payload.payment.entity);
        break;
      case 'refund.created':
        await handleRefundCreated(event.payload.refund.entity);
        break;
      default:
        console.log('Unhandled webhook event:', event.event);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message,
    });
  }
};

// Handle payment captured webhook
const handlePaymentCaptured = async (paymentEntity) => {
  try {
    const payment = await Payment.findOne({
      razorpayPaymentId: paymentEntity.id,
    });

    if (payment) {
      payment.status = 'paid';
      payment.paymentMethod = paymentEntity.method;
      payment.paymentDetails = {
        card: paymentEntity.card,
        wallet: paymentEntity.wallet,
        upi: paymentEntity.vpa,
      };
      await payment.save();

      // Update booking status
      const booking = await Booking.findById(payment.bookingId);
      booking.status = 'PAID_PENDING_ADMIN';
      booking.paymentDetails.paymentStatus = 'completed';
      await booking.save();
    }
  } catch (error) {
    console.error('Handle payment captured error:', error);
  }
};

// Handle payment failed webhook
const handlePaymentFailed = async (paymentEntity) => {
  try {
    const payment = await Payment.findOne({
      razorpayPaymentId: paymentEntity.id,
    });

    if (payment) {
      payment.status = 'failed';
      payment.failureReason = paymentEntity.error_description;
      await payment.save();

      // Update booking status
      const booking = await Booking.findById(payment.bookingId);
      booking.status = 'CANCELLED';
      booking.cancellationReason = 'Payment failed';
      await booking.save();
    }
  } catch (error) {
    console.error('Handle payment failed error:', error);
  }
};

// Handle refund created webhook
const handleRefundCreated = async (refundEntity) => {
  try {
    const payment = await Payment.findOne({
      razorpayPaymentId: refundEntity.payment_id,
    });

    if (payment) {
      payment.refundDetails.refundStatus = refundEntity.status;
      await payment.save();
    }
  } catch (error) {
    console.error('Handle refund created error:', error);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  getPaymentDetails,
  processRefund,
  handleWebhook,
};
