// routes/doctorRoutes.js
const express = require('express');
const router = express.Router();
const { getDoctors, getDoctorById, bookAppointment, getMyAppointments } = require('../controllers/doctorController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getDoctors);
router.get('/appointments', protect, getMyAppointments);
router.get('/:id', protect, getDoctorById);
router.post('/book', protect, bookAppointment);

module.exports = router;
