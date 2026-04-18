// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ['consultation', 'premium_monthly', 'premium_yearly', 'instant_video'],
    required: true,
  },

  // Razorpay fields
  razorpayOrderId: { type: String, required: true, unique: true },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },

  amount: { type: Number, required: true },   // in paise (₹299 = 29900)
  currency: { type: String, default: 'INR' },

  status: {
    type: String,
    enum: ['created', 'paid', 'failed', 'refunded'],
    default: 'created',
  },

  // For doctor consultations
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
  },

  // For subscriptions
  subscriptionPlan: String,
  subscriptionMonths: Number,

  paidAt: Date,
  refundedAt: Date,
  notes: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Payment', paymentSchema);
