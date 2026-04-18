// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Update last active
    user.stats.lastActiveDate = new Date();
    user.stats.daysActive += 1;
    await user.save();

    const token = generateToken(user._id);
    res.json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @PUT /api/auth/onboarding
exports.completeOnboarding = async (req, res) => {
  try {
    const {
      lastPeriodDate, cycleLength, periodLength,
      healthGoals, healthConditions, dietPreference,
      regionalCuisine, ayurvedicSuggestions,
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        'healthProfile.lastPeriodDate': lastPeriodDate,
        'healthProfile.cycleLength': cycleLength || 28,
        'healthProfile.periodLength': periodLength || 5,
        'healthProfile.healthGoals': healthGoals || [],
        'healthProfile.healthConditions': healthConditions || [],
        'healthProfile.dietPreference': dietPreference || 'vegetarian',
        'healthProfile.regionalCuisine': regionalCuisine || 'All cuisines',
        'healthProfile.ayurvedicSuggestions': ayurvedicSuggestions !== false,
        onboardingComplete: true,
        onboardingStep: 3,
      },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
