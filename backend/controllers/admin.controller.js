const User = require('../models/user.model');
const WomanProfile = require('../models/womanProfile.model');
const Organization = require('../models/organization.model');
const Caregiver = require('../models/caregiver.model');
const Booking = require('../models/booking.model');
const Payment = require('../models/payment.model');
const Incident = require('../models/incident.model');
const { getPaginationInfo } = require('../utils/helpers');

// Get admin dashboard data
const getDashboard = async (req, res) => {
  try {
    const [
      totalUsers,
      totalWomen,
      totalOrganizations,
      totalCaregivers,
      totalBookings,
      pendingVerifications,
      activeBookings,
      totalRevenue,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'woman' }),
      User.countDocuments({ role: 'organization' }),
      Caregiver.countDocuments(),
      Booking.countDocuments(),
      User.countDocuments({ kycStatus: 'pending' }),
      Booking.countDocuments({ status: 'IN_PROGRESS' }),
      Payment.aggregate([
        { $match: { status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
    ]);

    // Recent activities
    const recentBookings = await Booking.find()
      .populate('womanId', 'name')
      .populate('caregiverId', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    const recentIncidents = await Incident.find()
      .populate('reportedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalWomen,
          totalOrganizations,
          totalCaregivers,
          totalBookings,
          pendingVerifications,
          activeBookings,
          totalRevenue: totalRevenue[0]?.total || 0,
        },
        recentActivities: {
          bookings: recentBookings,
          incidents: recentIncidents,
        },
      },
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data',
      error: error.message,
    });
  }
};

// Get all users for verification
const getVerifications = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, role } = req.query;

    const query = {};
    if (status) {
      query.kycStatus = status;
    }
    if (role) {
      query.role = role;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: getPaginationInfo(parseInt(page), parseInt(limit), total),
      },
    });
  } catch (error) {
    console.error('Get verifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get verifications',
      error: error.message,
    });
  }
};

// Verify user
const verifyUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, notes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification status',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.kycStatus = status;
    await user.save();

    // If organization, also update organization status
    if (user.role === 'organization') {
      await Organization.findOneAndUpdate(
        { userId },
        { status }
      );
    }

    res.json({
      success: true,
      message: `User ${status} successfully`,
      data: user,
    });
  } catch (error) {
    console.error('Verify user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify user',
      error: error.message,
    });
  }
};

// Get all caregivers for verification
const getCaregivers = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};
    if (status) {
      query.verificationStatus = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const caregivers = await Caregiver.find(query)
      .populate('orgId', 'name city')
      .sort({ createdAt: -1 })
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
    console.error('Get caregivers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get caregivers',
      error: error.message,
    });
  }
};

// Verify caregiver
const verifyCaregiver = async (req, res) => {
  try {
    const { caregiverId } = req.params;
    const { status, notes } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification status',
      });
    }

    const caregiver = await Caregiver.findById(caregiverId);
    if (!caregiver) {
      return res.status(404).json({
        success: false,
        message: 'Caregiver not found',
      });
    }

    caregiver.verificationStatus = status;
    await caregiver.save();

    res.json({
      success: true,
      message: `Caregiver ${status} successfully`,
      data: caregiver,
    });
  } catch (error) {
    console.error('Verify caregiver error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify caregiver',
      error: error.message,
    });
  }
};

// Get all bookings
const getBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(query)
      .populate('womanId', 'name email phone')
      .populate('caregiverId', 'name skills')
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

// Forward booking to organization
const forwardBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { notes } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      status: 'PAID_PENDING_ADMIN',
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or not available for forwarding',
      });
    }

    booking.status = 'FORWARDED_TO_ORG';
    booking.adminNotes = notes;
    await booking.save();

    res.json({
      success: true,
      message: 'Booking forwarded to organization successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Forward booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to forward booking',
      error: error.message,
    });
  }
};

// Get all incidents
const getIncidents = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;

    const query = {};
    if (status) {
      query.status = status;
    }
    if (type) {
      query.type = type;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const incidents = await Incident.find(query)
      .populate('reportedBy', 'name email')
      .populate('reportedAgainst', 'name email')
      .populate('bookingId', 'service date')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Incident.countDocuments(query);

    res.json({
      success: true,
      data: {
        incidents,
        pagination: getPaginationInfo(parseInt(page), parseInt(limit), total),
      },
    });
  } catch (error) {
    console.error('Get incidents error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get incidents',
      error: error.message,
    });
  }
};

// Handle incident
const handleIncident = async (req, res) => {
  try {
    const { incidentId } = req.params;
    const { action, resolution, notes } = req.body;

    const incident = await Incident.findById(incidentId);
    if (!incident) {
      return res.status(404).json({
        success: false,
        message: 'Incident not found',
      });
    }

    incident.action = action;
    incident.resolution = resolution;
    incident.adminNotes = notes;
    incident.status = 'resolved';
    incident.resolvedBy = req.user._id;
    incident.resolvedAt = new Date();
    await incident.save();

    res.json({
      success: true,
      message: 'Incident handled successfully',
      data: incident,
    });
  } catch (error) {
    console.error('Handle incident error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to handle incident',
      error: error.message,
    });
  }
};

// Get analytics
const getAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000);

    const [
      bookingsByStatus,
      revenueByMonth,
      userRegistrations,
      topCities,
    ] = await Promise.all([
      Booking.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Payment.aggregate([
        { $match: { status: 'paid', createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            revenue: { $sum: '$amount' },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            registrations: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
      ]),
      WomanProfile.aggregate([
        { $group: { _id: '$address.city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        bookingsByStatus,
        revenueByMonth,
        userRegistrations,
        topCities,
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get analytics',
      error: error.message,
    });
  }
};

module.exports = {
  getDashboard,
  getVerifications,
  verifyUser,
  getCaregivers,
  verifyCaregiver,
  getBookings,
  forwardBooking,
  getIncidents,
  handleIncident,
  getAnalytics,
};
