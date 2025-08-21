const Product = require('../models/Product');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Get all products with filtering and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      subcategory,
      minPrice,
      maxPrice,
      location,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      organic,
      featured
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };
    
    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;
    if (organic !== undefined) filter['specifications.organic'] = organic === 'true';
    if (featured !== undefined) filter.featured = featured === 'true';
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (location) {
      filter['location.city'] = new RegExp(location, 'i');
    }

    // Build search query
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const products = await Product.find(filter)
      .populate('seller', 'firstName lastName rating verificationStatus')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalProducts: total,
        hasNextPage: skip + products.length < total,
        hasPrevPage: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      error: 'Error fetching products',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'firstName lastName rating verificationStatus address farmDetails')
      .populate('rating.reviews.user', 'firstName lastName');

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({
      error: 'Error fetching product',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      category,
      subcategory,
      description,
      price,
      unit,
      quantity,
      minOrderQuantity,
      specifications,
      location,
      shipping,
      tags
    } = req.body;

    // Create new product
    const product = new Product({
      seller: req.user.id,
      name,
      category,
      subcategory,
      description,
      price,
      unit,
      quantity,
      minOrderQuantity,
      specifications,
      location,
      shipping,
      tags
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      error: 'Error creating product',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user owns this product
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Update fields
    const updateFields = [
      'name', 'category', 'subcategory', 'description', 'price',
      'unit', 'quantity', 'minOrderQuantity', 'specifications',
      'location', 'shipping', 'tags', 'status'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      error: 'Error updating product',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user owns this product
    if (product.seller.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Soft delete - mark as deleted instead of removing
    product.status = 'deleted';
    product.isActive = false;
    await product.save();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      error: 'Error deleting product',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
const addProductReview = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if user has already reviewed this product
    const existingReview = product.rating.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    // Add new review
    product.rating.reviews.push({
      user: req.user.id,
      rating,
      comment
    });

    await product.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      data: {
        averageRating: product.rating.average,
        totalReviews: product.rating.count
      }
    });

  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      error: 'Error adding review',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get user's products
// @route   GET /api/products/seller/me
// @access  Private
const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ 
      seller: req.user.id,
      status: { $ne: 'deleted' }
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      data: products
    });

  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({
      error: 'Error fetching your products',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Toggle product favorite
// @route   POST /api/products/:id/favorite
// @access  Private
const toggleFavorite = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const userId = req.user.id;
    const isFavorited = product.favorites.includes(userId);

    if (isFavorited) {
      // Remove from favorites
      product.favorites = product.favorites.filter(id => id.toString() !== userId);
    } else {
      // Add to favorites
      product.favorites.push(userId);
    }

    await product.save();

    res.json({
      success: true,
      message: isFavorited ? 'Product removed from favorites' : 'Product added to favorites',
      isFavorited: !isFavorited
    });

  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({
      error: 'Error updating favorites',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  getMyProducts,
  toggleFavorite
}; 