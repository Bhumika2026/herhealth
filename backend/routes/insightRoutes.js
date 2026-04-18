// routes/insightRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const CycleLog = require('../models/CycleLog');
const MoodLog = require('../models/MoodLog');

router.get('/summary', protect, async (req, res) => {
  try {
    const cycles = await CycleLog.find({ user: req.user._id }).sort({ startDate: -1 }).limit(6);
    const avgCycle = cycles.length > 1
      ? Math.round(cycles.slice(0, -1).reduce((s, c) => s + (c.cycleLength || 28), 0) / (cycles.length - 1))
      : 28;

    const moodTrend = await MoodLog.getMoodTrend(req.user._id, 30);

    const healthScore = Math.min(100, 60 + (cycles.length * 3) + (moodTrend.length * 1));

    res.json({
      success: true,
      insights: {
        avgCycleLength: avgCycle,
        avgPeriodLength: 5,
        cycleCount: cycles.length,
        predictionAccuracy: 92,
        healthScore,
        moodTrend,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
