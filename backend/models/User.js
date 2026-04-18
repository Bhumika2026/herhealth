// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  avatar: String,

  // Health Profile
  healthProfile: {
    dateOfBirth: Date,
    cycleLength: { type: Number, default: 28 },
    periodLength: { type: Number, default: 5 },
    lastPeriodDate: Date,
    healthGoals: [String],
    healthConditions: [String],
    medications: [String],
    dietPreference: {
      type: String,
      enum: ['vegetarian', 'non-vegetarian', 'eggetarian', 'jain', 'vegan'],
      default: 'vegetarian',
    },
    regionalCuisine: { type: String, default: 'All cuisines' },
    dosha: {
      vata: { type: Number, default: 33 },
      pitta: { type: Number, default: 33 },
      kapha: { type: Number, default: 34 },
    },
    ayurvedicSuggestions: { type: Boolean, default: true },
  },

  // Subscription
  subscription: {
    plan: { type: String, enum: ['free', 'premium', 'enterprise'], default: 'free' },
    startDate: Date,
    endDate: Date,
    razorpaySubscriptionId: String,
    razorpayCustomerId: String,
  },

  // Settings
  settings: {
    notifications: { type: Boolean, default: true },
    anonymousMode: { type: Boolean, default: false },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
    language: { type: String, default: 'en' },
  },

  // Onboarding
  onboardingComplete: { type: Boolean, default: false },
  onboardingStep: { type: Number, default: 0 },

  // Stats
  stats: {
    cyclesTracked: { type: Number, default: 0 },
    daysActive: { type: Number, default: 0 },
    logStreak: { type: Number, default: 0 },
    lastActiveDate: Date,
  },

  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
