const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  getMyProducts,
  toggleFavorite
} = require('../controllers/productControllers');

const { protect } = require('../middleware/authMiddleware');

// Validation rules
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Product name must be between 3 and 100 characters'),
  body('category')
    .isIn(['seeds', 'fertilizers', 'pesticides', 'tools', 'machinery', 'crops', 'livestock', 'organic', 'other'])
    .withMessage('Invalid product category'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('unit')
    .isIn(['kg', 'g', 'liters', 'pieces', 'acres', 'hectares', 'bags', 'tons'])
    .withMessage('Invalid unit'),
  body('quantity')
    .isFloat({ min: 0 })
    .withMessage('Quantity must be a positive number'),
  body('minOrderQuantity')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Minimum order quantity must be at least 1'),
  body('location.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('location.state')
    .trim()
    .notEmpty()
    .withMessage('State is required')
];

const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Comment cannot exceed 500 characters')
];

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes
router.use(protect);

router.post('/', productValidation, createProduct);
router.put('/:id', productValidation, updateProduct);
router.delete('/:id', deleteProduct);
router.post('/:id/reviews', reviewValidation, addProductReview);
router.get('/seller/me', getMyProducts);
router.post('/:id/favorite', toggleFavorite);

module.exports = router; 