const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  applyForLoan,
  getUserLoans,
  getLoanDetails,
  updateLoanApplication,
  cancelLoanApplication,
  calculateLoan
} = require('../controllers/loanControllers');

const { protect } = require('../middleware/authMiddleware');

// Validation rules
const loanApplicationValidation = [
  body('loanType')
    .isIn(['crop_loan', 'equipment_loan', 'infrastructure_loan', 'livestock_loan', 'organic_farming_loan', 'emergency_loan'])
    .withMessage('Invalid loan type'),
  body('amount')
    .isFloat({ min: 1000, max: 1000000 })
    .withMessage('Loan amount must be between 1,000 and 10,00,000'),
  body('purpose')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Purpose must be between 10 and 500 characters'),
  body('term')
    .isInt({ min: 3, max: 60 })
    .withMessage('Loan term must be between 3 and 60 months'),
  body('farmDetails.farmSize')
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage('Farm size must be a positive number'),
  body('farmDetails.currentCrops')
    .optional()
    .isArray()
    .withMessage('Current crops must be an array'),
  body('collateral')
    .optional()
    .isIn(['none', 'land', 'equipment', 'livestock', 'crops', 'other'])
    .withMessage('Invalid collateral type'),
  body('guarantor.name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Guarantor name must be between 2 and 100 characters')
];

const loanCalculationValidation = [
  body('amount')
    .isFloat({ min: 1000, max: 1000000 })
    .withMessage('Amount must be between 1,000 and 10,00,000'),
  body('term')
    .isInt({ min: 3, max: 60 })
    .withMessage('Term must be between 3 and 60 months'),
  body('interestRate')
    .isFloat({ min: 1, max: 24 })
    .withMessage('Interest rate must be between 1% and 24%')
];

// Routes
router.post('/apply', protect, loanApplicationValidation, applyForLoan);
router.get('/user', protect, getUserLoans);
router.get('/:id', protect, getLoanDetails);
router.put('/:id', protect, loanApplicationValidation, updateLoanApplication);
router.delete('/:id', protect, cancelLoanApplication);
router.post('/calculate', loanCalculationValidation, calculateLoan);

module.exports = router; 