// controllers/doctorController.js
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// @GET /api/doctors
exports.getDoctors = async (req, res) => {
  try {
    const { specialty, city, search } = req.query;
    const filter = { isActive: true };
    if (specialty) filter.specialty = specialty;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (search) filter.name = new RegExp(search, 'i');

    const doctors = await Doctor.find(filter).sort('-rating');
    res.json({ success: true, doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/doctors/:id
exports.getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/doctors/book
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, type, scheduledAt } = req.body;
    const appointment = await Appointment.create({
      user: req.user._id,
      doctor: doctorId,
      type: type || 'video',
      scheduledAt,
      status: 'booked',
    });
    const populated = await appointment.populate('doctor', 'name specialty consultationFee');
    res.status(201).json({ success: true, appointment: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/doctors/appointments
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ user: req.user._id })
      .populate('doctor', 'name specialty avatar consultationFee')
      .sort('-scheduledAt');
    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
