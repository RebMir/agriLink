const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loanType: {
    type: String,
    required: [true, 'Loan type is required'],
    enum: [
      'crop_loan',
      'equipment_loan',
      'infrastructure_loan',
      'livestock_loan',
      'organic_farming_loan',
      'emergency_loan'
    ]
  },
  amount: {
    type: Number,
    required: [true, 'Loan amount is required'],
    min: [1000, 'Minimum loan amount is 1000'],
    max: [1000000, 'Maximum loan amount is 10,00,000']
  },
  currency: {
    type: String,
    default: 'INR',
    enum: ['INR', 'USD', 'EUR']
  },
  purpose: {
    type: String,
    required: [true, 'Loan purpose is required'],
    maxlength: [500, 'Purpose description cannot exceed 500 characters']
  },
  term: {
    type: Number,
    required: [true, 'Loan term is required'],
    min: [3, 'Minimum loan term is 3 months'],
    max: [60, 'Maximum loan term is 60 months']
  },
  interestRate: {
    type: Number,
    required: [true, 'Interest rate is required'],
    min: [1, 'Interest rate must be at least 1%'],
    max: [24, 'Interest rate cannot exceed 24%']
  },
  monthlyPayment: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'active', 'completed', 'defaulted'],
    default: 'pending'
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  approvalDate: Date,
  disbursementDate: Date,
  dueDate: Date,
  documents: [{
    name: String,
    type: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  farmDetails: {
    farmSize: Number, // in acres
    currentCrops: [String],
    expectedYield: Number,
    marketValue: Number
  },
  collateral: {
    type: String,
    enum: ['none', 'land', 'equipment', 'livestock', 'crops', 'other'],
    default: 'none'
  },
  collateralValue: Number,
  guarantor: {
    name: String,
    relationship: String,
    phone: String,
    address: String
  },
  creditScore: {
    type: Number,
    min: 300,
    max: 900
  },
  riskAssessment: {
    score: {
      type: Number,
      min: 1,
      max: 10
    },
    factors: [String],
    notes: String
  },
  payments: [{
    amount: Number,
    dueDate: Date,
    paidDate: Date,
    status: {
      type: String,
      enum: ['pending', 'paid', 'overdue', 'defaulted'],
      default: 'pending'
    },
    lateFees: {
      type: Number,
      default: 0
    }
  }],
  notes: [{
    content: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
loanSchema.index({ applicant: 1 });
loanSchema.index({ status: 1 });
loanSchema.index({ loanType: 1 });
loanSchema.index({ applicationDate: 1 });
loanSchema.index({ dueDate: 1 });

// Pre-save middleware to calculate loan details
loanSchema.pre('save', function(next) {
  if (this.isModified('amount') || this.isModified('interestRate') || this.isModified('term')) {
    // Calculate monthly interest rate
    const monthlyRate = this.interestRate / 100 / 12;
    
    // Calculate monthly payment using loan amortization formula
    if (monthlyRate > 0) {
      this.monthlyPayment = (this.amount * monthlyRate * Math.pow(1 + monthlyRate, this.term)) / 
                           (Math.pow(1 + monthlyRate, this.term) - 1);
    } else {
      this.monthlyPayment = this.amount / this.term;
    }
    
    // Calculate total amount to be repaid
    this.totalAmount = this.monthlyPayment * this.term;
    
    // Set due date
    this.dueDate = new Date();
    this.dueDate.setMonth(this.dueDate.getMonth() + this.term);
  }
  next();
});

// Method to calculate remaining balance
loanSchema.methods.calculateRemainingBalance = function() {
  if (this.status !== 'active') return 0;
  
  const paymentsMade = this.payments.filter(p => p.status === 'paid').length;
  const monthsRemaining = this.term - paymentsMade;
  
  return monthsRemaining * this.monthlyPayment;
};

// Method to check if loan is overdue
loanSchema.methods.isOverdue = function() {
  if (this.status !== 'active') return false;
  
  const today = new Date();
  const lastPayment = this.payments
    .filter(p => p.status === 'paid')
    .sort((a, b) => new Date(b.paidDate) - new Date(a.paidDate))[0];
  
  if (!lastPayment) return today > this.dueDate;
  
  const nextDueDate = new Date(lastPayment.paidDate);
  nextDueDate.setMonth(nextDueDate.getMonth() + 1);
  
  return today > nextDueDate;
};

// Virtual for loan progress
loanSchema.virtual('progress').get(function() {
  if (this.status !== 'active') return 0;
  
  const paymentsMade = this.payments.filter(p => p.status === 'paid').length;
  return (paymentsMade / this.term) * 100;
});

// Ensure virtual fields are serialized
loanSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Loan', loanSchema); 