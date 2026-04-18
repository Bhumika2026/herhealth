// models/MoodLog.js
const mongoose = require('mongoose');

const MOODS = [
  'happy', 'calm', 'content', 'excited', 'grateful',
  'sad', 'anxious', 'irritable', 'angry', 'lonely',
  'tired', 'energetic', 'sensitive', 'hopeful', 'overwhelmed',
  'romantic', 'focused', 'playful', 'moody', 'neutral',
];

const moodLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  mood: {
    type: String,
    enum: MOODS,
    required: true,
  },
  intensity: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  energy: {
    type: Number,
    min: 1,
    max: 5,
  },
  emotions: [String],         // secondary emotions / tags
  note: String,               // optional journal note
  cycleDay: Number,           // cycle day when mood was logged
  phase: String,              // menstrual phase
}, {
  timestamps: true,
});

moodLogSchema.index({ user: 1, date: -1 });

// Statics for insights
moodLogSchema.statics.getMoodTrend = async function (userId, days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);
  return this.aggregate([
    { $match: { user: userId, date: { $gte: since } } },
    { $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
      avgIntensity: { $avg: '$intensity' },
      avgEnergy: { $avg: '$energy' },
      moods: { $push: '$mood' },
    }},
    { $sort: { '_id': 1 } },
  ]);
};

module.exports = mongoose.model('MoodLog', moodLogSchema);
