// routes/cycleRoutes.js
const express = require('express');
const router = express.Router();
const { logPeriod, getCurrentCycleInfo, getCycleHistory } = require('../controllers/cycleController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/log', logPeriod);
router.get('/current', getCurrentCycleInfo);
router.get('/history', getCycleHistory);

module.exports = router;
