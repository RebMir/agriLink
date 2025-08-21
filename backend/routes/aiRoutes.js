const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getCropRecommendation,
  getPlantingAdvice,
  getPestDiagnosis
} = require('../controllers/aiControllers');

const { protect } = require('../middleware/authMiddleware');

// Validation rules
const cropRecommendationValidation = [
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('soilType')
    .trim()
    .notEmpty()
    .withMessage('Soil type is required'),
  body('season')
    .trim()
    .notEmpty()
    .withMessage('Season is required'),
  body('farmSize')
    .isFloat({ min: 0.1 })
    .withMessage('Farm size must be a positive number'),
  body('waterAvailability')
    .trim()
    .notEmpty()
    .withMessage('Water availability is required'),
  body('budget')
    .isFloat({ min: 0 })
    .withMessage('Budget must be a positive number'),
  body('experience')
    .isInt({ min: 0 })
    .withMessage('Experience must be a non-negative integer')
];

const plantingAdviceValidation = [
  body('crop')
    .trim()
    .notEmpty()
    .withMessage('Crop is required'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required'),
  body('soilType')
    .trim()
    .notEmpty()
    .withMessage('Soil type is required'),
  body('season')
    .trim()
    .notEmpty()
    .withMessage('Season is required'),
  body('weatherConditions')
    .trim()
    .notEmpty()
    .withMessage('Weather conditions are required'),
  body('farmSize')
    .isFloat({ min: 0.1 })
    .withMessage('Farm size must be a positive number'),
  body('irrigationType')
    .trim()
    .notEmpty()
    .withMessage('Irrigation type is required')
];

const pestDiagnosisValidation = [
  body('crop')
    .trim()
    .notEmpty()
    .withMessage('Crop is required'),
  body('symptoms')
    .trim()
    .notEmpty()
    .withMessage('Symptoms are required'),
  body('affectedArea')
    .trim()
    .notEmpty()
    .withMessage('Affected area is required'),
  body('weatherConditions')
    .trim()
    .notEmpty()
    .withMessage('Weather conditions are required'),
  body('stage')
    .trim()
    .notEmpty()
    .withMessage('Growth stage is required')
];

// Routes
router.post('/crop-recommendation', protect, cropRecommendationValidation, getCropRecommendation);
router.post('/planting-advice', protect, plantingAdviceValidation, getPlantingAdvice);
router.post('/pest-diagnosis', protect, pestDiagnosisValidation, getPestDiagnosis);

module.exports = router; 