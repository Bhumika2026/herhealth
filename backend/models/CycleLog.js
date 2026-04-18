// models/CycleLog.js
const mongoose = require('mongoose');

const cycleLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: Date,
  cycleLength: Number,        // calculated when next period starts
  periodLength: Number,       // actual days of bleeding
  flow: {
    type: String,
    enum: ['spotting', 'light', 'medium', 'heavy'],
  },
  symptoms: [String],         // e.g. ['cramps', 'bloating', 'headache']
  notes: String,
  ovulationDate: Date,        // predicted
  fertileWindowStart: Date,   // predicted
  fertileWindowEnd: Date,     // predicted
  phase: {
    type: String,
    enum: ['menstrual', 'follicular', 'ovulation', 'luteal'],
  },
}, {
  timestamps: true,
});

// Index for efficient queries per user
cycleLogSchema.index({ user: 1, startDate: -1 });

module.exports = mongoose.model('CycleLog', cycleLogSchema);
