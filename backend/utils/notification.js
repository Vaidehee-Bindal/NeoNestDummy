const twilio = require('twilio');
const { sendEmail } = require('../config/email');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send SMS
const sendSMS = async (to, message) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });
    
    console.log('SMS sent:', result.sid);
    return result;
  } catch (error) {
    console.error('SMS sending error:', error);
    throw error;
  }
};

// Send WhatsApp message
const sendWhatsApp = async (to, message) => {
  try {
    const result = await client.messages.create({
      body: message,
      from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
      to: `whatsapp:${to}`,
    });
    
    console.log('WhatsApp sent:', result.sid);
    return result;
  } catch (error) {
    console.error('WhatsApp sending error:', error);
    throw error;
  }
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to NeoNest!</h2>
      <p>Thank you for registering with us. Please verify your email address by clicking the link below:</p>
      <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If the button doesn't work, copy and paste this link: ${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
    </div>
  `;
  
  return sendEmail(email, 'Verify Your Email - NeoNest', html);
};

// Send booking confirmation
const sendBookingConfirmation = async (email, bookingDetails) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Booking Confirmed!</h2>
      <p>Your booking has been confirmed. Here are the details:</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
        <p><strong>Service:</strong> ${bookingDetails.service}</p>
        <p><strong>Date:</strong> ${bookingDetails.date}</p>
        <p><strong>Time:</strong> ${bookingDetails.time}</p>
        <p><strong>Amount:</strong> ₹${bookingDetails.amount}</p>
        <p><strong>Caregiver:</strong> ${bookingDetails.caregiverName}</p>
      </div>
      <p>We'll send you updates about your booking status.</p>
    </div>
  `;
  
  return sendEmail(email, 'Booking Confirmed - NeoNest', html);
};

// Send payment confirmation
const sendPaymentConfirmation = async (email, paymentDetails) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Payment Successful!</h2>
      <p>Your payment has been processed successfully.</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
        <p><strong>Transaction ID:</strong> ${paymentDetails.transactionId}</p>
        <p><strong>Amount:</strong> ₹${paymentDetails.amount}</p>
        <p><strong>Date:</strong> ${paymentDetails.date}</p>
      </div>
      <p>Thank you for choosing NeoNest!</p>
    </div>
  `;
  
  return sendEmail(email, 'Payment Confirmed - NeoNest', html);
};

module.exports = {
  sendSMS,
  sendWhatsApp,
  generateOTP,
  sendVerificationEmail,
  sendBookingConfirmation,
  sendPaymentConfirmation,
};
