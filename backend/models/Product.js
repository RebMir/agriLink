const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: [
      'seeds',
      'fertilizers',
      'pesticides',
      'tools',
      'machinery',
      'crops',
      'livestock',
      'organic',
      'other'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['kg', 'g', 'liters', 'pieces', 'acres', 'hectares', 'bags', 'tons']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  minOrderQuantity: {
    type: Number,
    default: 1,
    min: [1, 'Minimum order quantity must be at least 1']
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  specifications: {
    brand: String,
    model: String,
    weight: Number,
    dimensions: String,
    expiryDate: Date,
    organic: {
      type: Boolean,
      default: false
    },
    certifications: [String]
  },
  location: {
    city: String,
    state: String,
    country: {
      type: String,
      default: 'India'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  shipping: {
    available: {
      type: Boolean,
      default: true
    },
    cost: {
      type: Number,
      default: 0
    },
    estimatedDays: {
      type: Number,
      default: 3
    }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    reviews: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
      },
      comment: String,
      createdAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'out_of_stock', 'deleted'],
    default: 'active'
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, subcategory: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'location.city': 1, 'location.state': 1 });
productSchema.index({ seller: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });

// Method to calculate average rating
productSchema.methods.calculateAverageRating = function() {
  if (this.rating.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
    return;
  }
  
  const totalRating = this.rating.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating.average = totalRating / this.rating.reviews.length;
  this.rating.count = this.rating.reviews.length;
};

// Pre-save middleware to calculate average rating
productSchema.pre('save', function(next) {
  this.calculateAverageRating();
  next();
});

// Virtual for availability
productSchema.virtual('isAvailable').get(function() {
  return this.status === 'active' && this.quantity > 0;
});

// Virtual for price per unit
productSchema.virtual('pricePerUnit').get(function() {
  return this.price / this.quantity;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema); 