// models/Doctor.js
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: {
    type: String,
    enum: ['gynecologist', 'obstetrician', 'endocrinologist', 'fertility', 'ayurveda', 'nutritionist'],
    required: true,
  },
  experience: Number,
  qualifications: [String],
  languages: [String],
  rating: { type: Number, default: 4.5, min: 1, max: 5 },
  reviewCount: { type: Number, default: 0 },
  consultationFee: { type: Number, required: true }, // in rupees
  videoFee: Number,
  chatFee: Number,
  expertise: [String],        // e.g. ['PCOS', 'IVF', 'Menopause']
  location: {
    city: String,
    state: String,
    clinic: String,
    address: String,
  },
  availability: [{
    day: { type: String, enum: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
    slots: [String],           // e.g. ['10:00 AM', '11:00 AM']
  }],
  nextAvailable: String,
  verified: { type: Boolean, default: true },
  avatar: String,
  bio: String,
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

doctorSchema.index({ 'location.city': 1, specialty: 1 });

module.exports = mongoose.model('Doctor', doctorSchema);
