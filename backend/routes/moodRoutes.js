// routes/moodRoutes.js
const express = require('express');
const router = express.Router();
const { logMood, getTodayMood, getMoodHistory, getMoodTrend } = require('../controllers/moodController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/log', logMood);
router.get('/today', getTodayMood);
router.get('/history', getMoodHistory);
router.get('/trend', getMoodTrend);

module.exports = router;
