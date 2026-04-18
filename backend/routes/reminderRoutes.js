// routes/reminderRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Reminder = require('../models/Reminder');

router.get('/', protect, async (req, res) => {
  const reminders = await Reminder.find({ user: req.user._id, isActive: true });
  res.json({ success: true, reminders });
});

router.post('/', protect, async (req, res) => {
  const reminder = await Reminder.create({ user: req.user._id, ...req.body });
  res.status(201).json({ success: true, reminder });
});

router.delete('/:id', protect, async (req, res) => {
  await Reminder.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { isActive: false });
  res.json({ success: true });
});

module.exports = router;
