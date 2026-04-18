// controllers/paymentController.js — Razorpay Integration
const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

// PLAN PRICES (in paise — ₹ × 100)
const PLANS = {
  premium_monthly: { amount: 19900, months: 1, label: 'Premium Monthly' },
  premium_yearly:  { amount: 179900, months: 12, label: 'Premium Yearly' },
  consultation:    { amount: 50000, months: 0, label: 'Doctor Consultation' },
  instant_video:   { amount: 29900, months: 0, label: 'Instant Video Call' },
};

// @POST /api/payments/create-order
exports.createOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ success: false, message: 'Payment service not configured' });
    }

    const { type, doctorId } = req.body;

    const plan = PLANS[type];
    if (!plan) {
      return res.status(400).json({ success: false, message: 'Invalid plan type' });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: plan.amount,
      currency: 'INR',
      receipt: `herhealth_${req.user._id}_${Date.now()}`,
      notes: {
        userId: req.user._id.toString(),
        type,
        userName: req.user.name,
        userEmail: req.user.email,
      },
    });

    // Save payment record (status: created)
    const payment = await Payment.create({
      user: req.user._id,
      type,
      razorpayOrderId: order.id,
      amount: plan.amount,
      doctorId: doctorId || undefined,
      subscriptionPlan: plan.label,
      subscriptionMonths: plan.months,
    });

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      paymentId: payment._id,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('Razorpay order creation error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/payments/verify
exports.verifyPayment = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ success: false, message: 'Payment service not configured' });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await Payment.findByIdAndUpdate(paymentId, { status: 'failed' });
      return res.status(400).json({ success: false, message: 'Payment verification failed' });
    }

    // Update payment record
    const payment = await Payment.findByIdAndUpdate(
      paymentId,
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'paid',
        paidAt: new Date(),
      },
      { new: true }
    );

    // Activate subscription if applicable
    if (payment.type === 'premium_monthly' || payment.type === 'premium_yearly') {
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + payment.subscriptionMonths);

      await User.findByIdAndUpdate(req.user._id, {
        'subscription.plan': 'premium',
        'subscription.startDate': new Date(),
        'subscription.endDate': endDate,
        'subscription.razorpayCustomerId': razorpay_payment_id,
      });
    }

    // Create appointment if doctor consultation
    if (payment.doctorId && req.body.scheduledAt) {
      await Appointment.create({
        user: req.user._id,
        doctor: payment.doctorId,
        type: payment.type === 'instant_video' ? 'video' : 'in-person',
        scheduledAt: req.body.scheduledAt,
        payment: payment._id,
        status: 'confirmed',
      });
    }

    res.json({ success: true, message: 'Payment successful!', payment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/payments/history
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .sort('-createdAt')
      .populate('doctorId', 'name specialty');
    res.json({ success: true, payments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};