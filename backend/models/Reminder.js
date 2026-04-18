// models/Reminder.js
const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['medicine', 'appointment', 'cycle', 'water', 'sleep', 'custom'],
    required: true,
  },
  title: { type: String, required: true },
  description: String,
  time: { type: String, required: true },   // e.g. "09:00"
  days: [String],                            // ['Mon','Tue'] or ['daily']
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Reminder', reminderSchema);
