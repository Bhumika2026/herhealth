// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  type: {
    type: String,
    enum: ['in-person', 'video', 'chat'],
    default: 'video',
  },
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, default: 30 }, // minutes
  status: {
    type: String,
    enum: ['booked', 'confirmed', 'completed', 'cancelled'],
    default: 'booked',
  },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  notes: String,
  prescription: String,
  meetingLink: String,
  reminderSent: { type: Boolean, default: false },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Appointment', appointmentSchema);
