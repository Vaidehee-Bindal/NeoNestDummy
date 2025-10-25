const WomanProfile = require('../models/womanProfile.model');
const Caregiver = require('../models/caregiver.model');
const Booking = require('../models/booking.model');
const Review = require('../models/review.model');
const { getPaginationInfo, calculateDistance } = require('../utils/helpers');

// Get woman profile
const getProfile = async (req, res) => {
  try {
    const profile = await WomanProfile.findOne({ userId: req.user._id });
    
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please complete your profile.',
      });
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Get woman profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message,
    });
  }
};

// Create or update woman profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profileData = req.body;

    const profile = await WomanProfile.findOneAndUpdate(
      { userId },
      profileData,
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile,
    });
  } catch (error) {
    console.error('Update woman profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

// Search caregivers
const searchCaregivers = async (req, res) => {
  try {
    const {
      city,
      skills,
      budgetMin,
      budgetMax,
      page = 1,
      limit = 10,
      sortBy = 'rating',
      sortOrder = 'desc',
    } = req.query;

    // Build search query
    const query = {
      verificationStatus: 'approved',
      isActive: true,
    };

    if (city) {
      query['region.city'] = new RegExp(city, 'i');
    }

    if (skills) {
      const skillArray = Array.isArray(skills) ? skills : skills.split(',');
      query.skills = { $in: skillArray };
    }

    if (budgetMin || budgetMax) {
      query.$or = [];
      if (budgetMin) {
        query.$or.push({ 'rates.hourly': { $gte: parseInt(budgetMin) } });
        query.$or.push({ 'rates.daily': { $gte: parseInt(budgetMin) } });
      }
      if (budgetMax) {
        query.$or.push({ 'rates.hourly': { $lte: parseInt(budgetMax) } });
        query.$or.push({ 'rates.daily': { $lte: parseInt(budgetMax) } });
      }
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const caregivers = await Caregiver.find(query)
      .populate('orgId', 'name city rating')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Caregiver.countDocuments(query);

    res.json({
      success: true,
      data: {
        caregivers,
        pagination: getPaginationInfo(parseInt(page), parseInt(limit), total),
      },
    });
  } catch (error) {
    console.error('Search caregivers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search caregivers',
      error: error.message,
    });
  }
};

// Get caregiver details
const getCaregiverDetails = async (req, res) => {
  try {
    const { caregiverId } = req.params;

    const caregiver = await Caregiver.findById(caregiverId)
      .populate('orgId', 'name city rating contactPerson');

    if (!caregiver) {
      return res.status(404).json({
        success: false,
        message: 'Caregiver not found',
      });
    }

    // Get recent reviews
    const reviews = await Review.find({ caregiverId })
      .populate('womanId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        caregiver,
        reviews,
      },
    });
  } catch (error) {
    console.error('Get caregiver details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get caregiver details',
      error: error.message,
    });
  }
};

// Create booking
const createBooking = async (req, res) => {
  try {
    const {
      caregiverId,
      service,
      startDate,
      endDate,
      startTime,
      endTime,
      specialInstructions,
      address,
    } = req.body;

    // Get caregiver details
    const caregiver = await Caregiver.findById(caregiverId)
      .populate('orgId');

    if (!caregiver) {
      return res.status(404).json({
        success: false,
        message: 'Caregiver not found',
      });
    }

    if (caregiver.verificationStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Caregiver is not verified',
      });
    }

    // Calculate duration and pricing
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const duration = (end - start) / (1000 * 60 * 60); // hours

    const hourlyRate = caregiver.rates.hourly;
    const totalAmount = duration * hourlyRate;

    // Create booking
    const booking = new Booking({
      womanId: req.user._id,
      caregiverId,
      orgId: caregiver.orgId._id,
      service,
      date: {
        startDate: start,
        endDate: end,
        duration,
      },
      timing: {
        startTime,
        endTime,
      },
      pricing: {
        hourlyRate,
        totalAmount,
      },
      specialInstructions,
      address,
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message,
    });
  }
};

// Get woman's bookings
const getBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { womanId: req.user._id };
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(query)
      .populate('caregiverId', 'name skills rating')
      .populate('orgId', 'name city')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings,
        pagination: getPaginationInfo(parseInt(page), parseInt(limit), total),
      },
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get bookings',
      error: error.message,
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      womanId: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (!['AWAITING_PAYMENT', 'PAID_PENDING_ADMIN', 'FORWARDED_TO_ORG'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled at this stage',
      });
    }

    booking.status = 'CANCELLED';
    booking.cancellationReason = reason;
    booking.cancelledAt = new Date();
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message,
    });
  }
};

// Submit review
const submitReview = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { rating, feedback, categories } = req.body;

    // Check if booking exists and is completed
    const booking = await Booking.findOne({
      _id: bookingId,
      womanId: req.user._id,
      status: 'COMPLETED',
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Completed booking not found',
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ bookingId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Review already submitted for this booking',
      });
    }

    // Create review
    const review = new Review({
      caregiverId: booking.caregiverId,
      womanId: req.user._id,
      bookingId,
      rating,
      feedback,
      categories,
    });

    await review.save();

    // Update caregiver rating
    await updateCaregiverRating(booking.caregiverId);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review,
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message,
    });
  }
};

// Helper function to update caregiver rating
const updateCaregiverRating = async (caregiverId) => {
  const reviews = await Review.find({ caregiverId });
  
  if (reviews.length > 0) {
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    
    await Caregiver.findByIdAndUpdate(caregiverId, {
      'rating.average': averageRating,
      'rating.totalReviews': reviews.length,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  searchCaregivers,
  getCaregiverDetails,
  createBooking,
  getBookings,
  cancelBooking,
  submitReview,
};
