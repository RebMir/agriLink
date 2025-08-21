const Loan = require('../models/Loan');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Apply for a microloan
// @route   POST /api/loans/apply
// @access  Private
const applyForLoan = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      loanType,
      amount,
      purpose,
      term,
      farmDetails,
      collateral,
      collateralValue,
      guarantor
    } = req.body;

    // Check if user has existing active loans
    const existingLoan = await Loan.findOne({
      applicant: req.user.id,
      status: { $in: ['pending', 'approved', 'active'] }
    });

    if (existingLoan) {
      return res.status(400).json({
        error: 'You already have an active loan application or loan'
      });
    }

    // Calculate interest rate based on loan type and amount
    let interestRate = 12; // Default 12% APR
    if (loanType === 'organic_farming_loan') {
      interestRate = 10; // Lower rate for organic farming
    } else if (amount > 100000) {
      interestRate = 14; // Higher rate for larger amounts
    }

    // Create new loan application
    const loan = new Loan({
      applicant: req.user.id,
      loanType,
      amount,
      purpose,
      term,
      interestRate,
      farmDetails,
      collateral,
      collateralValue,
      guarantor
    });

    await loan.save();

    res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully',
      data: {
        loanId: loan._id,
        status: loan.status,
        monthlyPayment: loan.monthlyPayment,
        totalAmount: loan.totalAmount,
        dueDate: loan.dueDate
      }
    });

  } catch (error) {
    console.error('Loan application error:', error);
    res.status(500).json({
      error: 'Error submitting loan application',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get user's loan history
// @route   GET /api/loans/user
// @access  Private
const getUserLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ applicant: req.user.id })
      .sort({ createdAt: -1 })
      .populate('applicant', 'firstName lastName email');

    res.json({
      success: true,
      count: loans.length,
      data: loans
    });

  } catch (error) {
    console.error('Get user loans error:', error);
    res.status(500).json({
      error: 'Error fetching loan history',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get specific loan details
// @route   GET /api/loans/:id
// @access  Private
const getLoanDetails = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id)
      .populate('applicant', 'firstName lastName email phone address farmDetails');

    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Check if user owns this loan or is admin
    if (loan.applicant._id.toString() !== req.user.id && req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      data: loan
    });

  } catch (error) {
    console.error('Get loan details error:', error);
    res.status(500).json({
      error: 'Error fetching loan details',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Update loan application
// @route   PUT /api/loans/:id
// @access  Private
const updateLoanApplication = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Check if user owns this loan
    if (loan.applicant.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Only allow updates if loan is pending
    if (loan.status !== 'pending') {
      return res.status(400).json({
        error: 'Cannot update loan application after approval'
      });
    }

    const {
      purpose,
      farmDetails,
      collateral,
      collateralValue,
      guarantor
    } = req.body;

    // Update fields
    if (purpose) loan.purpose = purpose;
    if (farmDetails) loan.farmDetails = { ...loan.farmDetails, ...farmDetails };
    if (collateral) loan.collateral = collateral;
    if (collateralValue) loan.collateralValue = collateralValue;
    if (guarantor) loan.guarantor = guarantor;

    await loan.save();

    res.json({
      success: true,
      message: 'Loan application updated successfully',
      data: loan
    });

  } catch (error) {
    console.error('Update loan application error:', error);
    res.status(500).json({
      error: 'Error updating loan application',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Cancel loan application
// @route   DELETE /api/loans/:id
// @access  Private
const cancelLoanApplication = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ error: 'Loan not found' });
    }

    // Check if user owns this loan
    if (loan.applicant.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Only allow cancellation if loan is pending
    if (loan.status !== 'pending') {
      return res.status(400).json({
        error: 'Cannot cancel loan application after approval'
      });
    }

    loan.status = 'cancelled';
    loan.isActive = false;
    await loan.save();

    res.json({
      success: true,
      message: 'Loan application cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel loan application error:', error);
    res.status(500).json({
      error: 'Error cancelling loan application',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// @desc    Get loan calculator
// @route   POST /api/loans/calculate
// @access  Public
const calculateLoan = async (req, res) => {
  try {
    const { amount, term, interestRate } = req.body;

    if (!amount || !term || !interestRate) {
      return res.status(400).json({
        error: 'Amount, term, and interest rate are required'
      });
    }

    // Calculate monthly interest rate
    const monthlyRate = interestRate / 100 / 12;
    
    // Calculate monthly payment using loan amortization formula
    let monthlyPayment;
    if (monthlyRate > 0) {
      monthlyPayment = (amount * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                      (Math.pow(1 + monthlyRate, term) - 1);
    } else {
      monthlyPayment = amount / term;
    }
    
    // Calculate total amount to be repaid
    const totalAmount = monthlyPayment * term;
    const totalInterest = totalAmount - amount;

    res.json({
      success: true,
      data: {
        loanAmount: amount,
        term: term,
        interestRate: interestRate,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalAmount: Math.round(totalAmount * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100
      }
    });

  } catch (error) {
    console.error('Loan calculation error:', error);
    res.status(500).json({
      error: 'Error calculating loan',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
  applyForLoan,
  getUserLoans,
  getLoanDetails,
  updateLoanApplication,
  cancelLoanApplication,
  calculateLoan
}; 