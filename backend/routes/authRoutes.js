const express = require('express');
const { body } = require('express-validator');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserProfile,
  googleLogin
} = require('../controllers/authControllers');

const { protect } = require('../middleware/authMiddleware');

// ================================
// Validation
// ================================
const registerValidation = [
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('phone').matches(/^[\+]?[1-9][\d]{0,15}$/).withMessage('Please provide a valid phone number'),
  body('userType').optional().isIn(['farmer', 'buyer', 'admin']).withMessage('User type must be farmer, buyer, or admin')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

// ================================
// Routes
// ================================
router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.get('/profile', protect, getUserProfile);

// Google Login (manual post from frontend, optional)
router.post('/google', googleLogin);

// ================================
// Google OAuth Routes
// ================================
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.redirect(`${process.env.FRONTEND_URL}/login-success?token=${token}`);
  }
);

module.exports = router;
