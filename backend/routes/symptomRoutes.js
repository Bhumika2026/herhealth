// routes/symptomRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const CycleLog = require('../models/CycleLog');

router.post('/log', protect, async (req, res) => {
  try {
    const { symptoms, date } = req.body;
    // Attach symptoms to the most recent cycle log
    const cycle = await CycleLog.findOne({ user: req.user._id }).sort({ startDate: -1 });
    if (cycle) {
      cycle.symptoms = [...new Set([...(cycle.symptoms || []), ...symptoms])];
      await cycle.save();
    }
    res.json({ success: true, message: 'Symptoms logged' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
