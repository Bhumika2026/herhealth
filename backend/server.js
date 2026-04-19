require('dotenv').config();
console.log('MONGO URI:', process.env.MONGODB_URI);
// server.js — HerHealth Backend Entry Point
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load env vars
dotenv.config();

// Connect to MongoDB Atlas Cluster
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  credentials: false,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/users',     require('./routes/userRoutes'));
app.use('/api/cycle',     require('./routes/cycleRoutes'));
app.use('/api/mood',      require('./routes/moodRoutes'));
app.use('/api/symptoms',  require('./routes/symptomRoutes'));
app.use('/api/doctors',   require('./routes/doctorRoutes'));
app.use('/api/payments',  require('./routes/paymentRoutes'));
app.use('/api/community', require('./routes/communityRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/insights',  require('./routes/insightRoutes'));
app.use('/api/sakhi', require('./routes/sakhiRoutes'));
// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '🌸 HerHealth API is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌸 HerHealth server running on port ${PORT}`);
});
