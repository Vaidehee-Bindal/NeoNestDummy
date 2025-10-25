const Organization = require('../models/organization.model');
const Caregiver = require('../models/caregiver.model');
const Booking = require('../models/booking.model');
const { uploadToS3 } = require('../utils/fileUpload');
const { getPaginationInfo } = require('../utils/helpers');

// Get organization profile
const getProfile = async (req, res) => {
  try {
    const profile = await Organization.findOne({ userId: req.user._id });
    
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
    console.error('Get organization profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message,
    });
  }
};

// Create or update organization profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const profileData = req.body;

    // Handle file uploads if present
    if (req.files) {
      const { businessLicense, gstCertificate, bankDetails } = req.files;
      
      if (businessLicense) {
        profileData.verificationDocuments.businessLicense = await uploadToS3(businessLicense[0], 'org-documents');
      }
      if (gstCertificate) {
        profileData.verificationDocuments.gstCertificate = await uploadToS3(gstCertificate[0], 'org-documents');
      }
      if (bankDetails) {
        profileData.verificationDocuments.bankDetails = await uploadToS3(bankDetails[0], 'org-documents');
      }
    }

    const profile = await Organization.findOneAndUpdate(
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
    console.error('Update organization profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message,
    });
  }
};

// Create caregiver
const createCaregiver = async (req, res) => {
  try {
    const caregiverData = req.body;
    caregiverData.orgId = req.user.organizationId;

    // Handle file uploads
    if (req.files) {
      const { idProof, addressProof, medicalCertificate, backgroundCheck, trainingCertificate } = req.files;
      
      if (idProof) {
        caregiverData.verificationDocuments.idProof = await uploadToS3(idProof[0], 'caregiver-documents');
      }
      if (addressProof) {
        caregiverData.verificationDocuments.addressProof = await uploadToS3(addressProof[0], 'caregiver-documents');
      }
      if (medicalCertificate) {
        caregiverData.verificationDocuments.medicalCertificate = await uploadToS3(medicalCertificate[0], 'caregiver-documents');
      }
      if (backgroundCheck) {
        caregiverData.verificationDocuments.backgroundCheck = await uploadToS3(backgroundCheck[0], 'caregiver-documents');
      }
      if (trainingCertificate) {
        caregiverData.verificationDocuments.trainingCertificate = await uploadToS3(trainingCertificate[0], 'caregiver-documents');
      }
    }

    const caregiver = new Caregiver(caregiverData);
    await caregiver.save();

    res.status(201).json({
      success: true,
      message: 'Caregiver created successfully',
      data: caregiver,
    });
  } catch (error) {
    console.error('Create caregiver error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create caregiver',
      error: error.message,
    });
  }
};

// Get organization's caregivers
const getCaregivers = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { orgId: req.user.organizationId };
    if (status) {
      query.verificationStatus = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const caregivers = await Caregiver.find(query)
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

// Update caregiver
const updateCaregiver = async (req, res) => {
  try {
    const { caregiverId } = req.params;
    const updateData = req.body;

    // Check if caregiver belongs to organization
    const caregiver = await Caregiver.findOne({
      _id: caregiverId,
      orgId: req.user.organizationId,
    });

    if (!caregiver) {
      return res.status(404).json({
        success: false,
        message: 'Caregiver not found',
      });
    }

    // Handle file uploads
    if (req.files) {
      const { idProof, addressProof, medicalCertificate, backgroundCheck, trainingCertificate } = req.files;
      
      if (idProof) {
        updateData.verificationDocuments.idProof = await uploadToS3(idProof[0], 'caregiver-documents');
      }
      if (addressProof) {
        updateData.verificationDocuments.addressProof = await uploadToS3(addressProof[0], 'caregiver-documents');
      }
      if (medicalCertificate) {
        updateData.verificationDocuments.medicalCertificate = await uploadToS3(medicalCertificate[0], 'caregiver-documents');
      }
      if (backgroundCheck) {
        updateData.verificationDocuments.backgroundCheck = await uploadToS3(backgroundCheck[0], 'caregiver-documents');
      }
      if (trainingCertificate) {
        updateData.verificationDocuments.trainingCertificate = await uploadToS3(trainingCertificate[0], 'caregiver-documents');
      }
    }

    const updatedCaregiver = await Caregiver.findByIdAndUpdate(
      caregiverId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Caregiver updated successfully',
      data: updatedCaregiver,
    });
  } catch (error) {
    console.error('Update caregiver error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update caregiver',
      error: error.message,
    });
  }
};

// Get organization's bookings
const getBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { orgId: req.user.organizationId };
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(query)
      .populate('womanId', 'name email phone')
      .populate('caregiverId', 'name skills')
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

// Accept booking
const acceptBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { notes } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      orgId: req.user.organizationId,
      status: 'FORWARDED_TO_ORG',
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or not available for acceptance',
      });
    }

    // Check caregiver availability
    const caregiver = await Caregiver.findById(booking.caregiverId);
    if (!caregiver.isActive || caregiver.verificationStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Caregiver is not available',
      });
    }

    booking.status = 'ORG_ACCEPTED';
    booking.orgNotes = notes;
    await booking.save();

    res.json({
      success: true,
      message: 'Booking accepted successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Accept booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept booking',
      error: error.message,
    });
  }
};

// Reject booking
const rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;

    const booking = await Booking.findOne({
      _id: bookingId,
      orgId: req.user.organizationId,
      status: 'FORWARDED_TO_ORG',
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found or not available for rejection',
      });
    }

    booking.status = 'CANCELLED';
    booking.cancellationReason = reason;
    booking.cancelledAt = new Date();
    await booking.save();

    res.json({
      success: true,
      message: 'Booking rejected successfully',
    });
  } catch (error) {
    console.error('Reject booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject booking',
      error: error.message,
    });
  }
};

// Update booking status (for in-progress bookings)
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, notes } = req.body;

    const allowedStatuses = ['IN_PROGRESS', 'COMPLETED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status update',
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      orgId: req.user.organizationId,
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    booking.status = status;
    if (notes) {
      booking.orgNotes = notes;
    }
    if (status === 'COMPLETED') {
      booking.completedAt = new Date();
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      data: booking,
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  createCaregiver,
  getCaregivers,
  updateCaregiver,
  getBookings,
  acceptBooking,
  rejectBooking,
  updateBookingStatus,
};
