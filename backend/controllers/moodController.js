// controllers/moodController.js
const MoodLog = require('../models/MoodLog');

// @POST /api/mood/log
exports.logMood = async (req, res) => {
  try {
    const { mood, intensity, energy, emotions, note, cycleDay, phase } = req.body;

    const moodLog = await MoodLog.create({
      user: req.user._id,
      mood, intensity, energy, emotions, note, cycleDay, phase,
      date: new Date(),
    });

    res.status(201).json({ success: true, moodLog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/mood/today
exports.getTodayMood = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const moodLog = await MoodLog.findOne({
      user: req.user._id,
      date: { $gte: today, $lt: tomorrow },
    }).sort('-createdAt');

    res.json({ success: true, moodLog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/mood/history
exports.getMoodHistory = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));

    const logs = await MoodLog.find({
      user: req.user._id,
      date: { $gte: since },
    }).sort('-date');

    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/mood/trend
exports.getMoodTrend = async (req, res) => {
  try {
    const trend = await MoodLog.getMoodTrend(req.user._id, 30);
    res.json({ success: true, trend });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
