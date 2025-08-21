const express = require('express');
const router = express.Router();

const { getCurrentWeather } = require('../controllers/weatherControllers');

// Public routes
router.get('/:location', getCurrentWeather);

module.exports = router; 