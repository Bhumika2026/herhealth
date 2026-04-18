// controllers/cycleController.js
const CycleLog = require('../models/CycleLog');
const User = require('../models/User');

// Calculate cycle predictions
const calculatePredictions = (startDate, cycleLength = 28) => {
  const start = new Date(startDate);
  const ovulationDay = 14; // default, can be refined
  const ovulationDate = new Date(start);
  ovulationDate.setDate(start.getDate() + cycleLength - ovulationDay);

  const fertileStart = new Date(ovulationDate);
  fertileStart.setDate(ovulationDate.getDate() - 5);

  const fertileEnd = new Date(ovulationDate);
  fertileEnd.setDate(ovulationDate.getDate() + 1);

  const nextPeriod = new Date(start);
  nextPeriod.setDate(start.getDate() + cycleLength);

  return { ovulationDate, fertileStart, fertileEnd, nextPeriod };
};

const getPhase = (dayOfCycle, cycleLength = 28) => {
  if (dayOfCycle <= 5) return 'menstrual';
  if (dayOfCycle <= 13) return 'follicular';
  if (dayOfCycle <= 16) return 'ovulation';
  return 'luteal';
};

// @POST /api/cycle/log
exports.logPeriod = async (req, res) => {
  try {
    const { startDate, flow, symptoms, notes } = req.body;
    const user = req.user;

    const cycleLength = user.healthProfile?.cycleLength || 28;
    const predictions = calculatePredictions(startDate, cycleLength);

    // Update previous cycle's length
    const previousCycle = await CycleLog.findOne({ user: user._id }).sort({ startDate: -1 });
    if (previousCycle && !previousCycle.cycleLength) {
      const diffMs = new Date(startDate) - previousCycle.startDate;
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      previousCycle.cycleLength = diffDays;
      previousCycle.endDate = new Date(startDate);
      await previousCycle.save();
    }

    const cycleLog = await CycleLog.create({
      user: user._id,
      startDate,
      flow,
      symptoms,
      notes,
      ovulationDate: predictions.ovulationDate,
      fertileWindowStart: predictions.fertileStart,
      fertileWindowEnd: predictions.fertileEnd,
      phase: 'menstrual',
    });

    // Update user's last period date & stats
    await User.findByIdAndUpdate(user._id, {
      'healthProfile.lastPeriodDate': startDate,
      $inc: { 'stats.cyclesTracked': 1 },
    });

    res.status(201).json({ success: true, cycleLog, predictions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/cycle/current
exports.getCurrentCycleInfo = async (req, res) => {
  try {
    const user = req.user;
    const lastPeriod = user.healthProfile?.lastPeriodDate;

    if (!lastPeriod) {
      return res.json({ success: true, data: null, message: 'No cycle data yet' });
    }

    const cycleLength = user.healthProfile?.cycleLength || 28;
    const today = new Date();
    const diffMs = today - new Date(lastPeriod);
    const dayOfCycle = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    const phase = getPhase(dayOfCycle, cycleLength);
    const predictions = calculatePredictions(lastPeriod, cycleLength);

    const daysUntilPeriod = Math.max(0, cycleLength - dayOfCycle);

    res.json({
      success: true,
      data: {
        dayOfCycle,
        phase,
        cycleLength,
        daysUntilPeriod,
        predictions,
        lastPeriodDate: lastPeriod,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/cycle/history
exports.getCycleHistory = async (req, res) => {
  try {
    const cycles = await CycleLog.find({ user: req.user._id }).sort({ startDate: -1 }).limit(12);
    res.json({ success: true, cycles });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
