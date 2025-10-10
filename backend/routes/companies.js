import express from 'express';
import Company from '../models/Company.js';
import { protect } from '../middleware/auth.js';
import { validateCompanyCreation, validateObjectId, validatePagination } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
router.get('/', validatePagination, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { search, industry, status, assignedTo } = req.query;

  // Build query
  let query = { isActive: true };
  
  // Non-admin users can only see their assigned companies
  if (req.user.role !== 'admin') {
    query.assignedTo = req.user._id;
  } else if (assignedTo) {
    query.assignedTo = assignedTo;
  }
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (industry) {
    query.industry = industry;
  }
  
  if (status) {
    query.status = status;
  }

  const companies = await Company.find(query)
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Company.countDocuments(query);

  res.json({
    success: true,
    data: companies,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// @desc    Get company by ID
// @route   GET /api/companies/:id
// @access  Private
router.get('/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id)
    .populate('assignedTo', 'name email');

  if (!company) {
    return res.status(404).json({
      success: false,
      message: 'Company not found'
    });
  }

  // Check if user can access this company
  if (req.user.role !== 'admin' && company.assignedTo._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  res.json({
    success: true,
    data: company
  });
}));

// @desc    Create new company
// @route   POST /api/companies
// @access  Private
router.post('/', validateCompanyCreation, asyncHandler(async (req, res) => {
  const companyData = {
    ...req.body,
    assignedTo: req.body.assignedTo || req.user._id
  };

  // Check if company with this name already exists
  const existingCompany = await Company.findOne({ 
    name: companyData.name,
    isActive: true 
  });

  if (existingCompany) {
    return res.status(400).json({
      success: false,
      message: 'Company with this name already exists'
    });
  }

  const company = await Company.create(companyData);
  
  await company.populate('assignedTo', 'name email');

  res.status(201).json({
    success: true,
    message: 'Company created successfully',
    data: company
  });
}));

// @desc    Update company
// @route   PUT /api/companies/:id
// @access  Private
router.put('/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    return res.status(404).json({
      success: false,
      message: 'Company not found'
    });
  }

  // Check if user can update this company
  if (req.user.role !== 'admin' && company.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Check if name is being changed and if it's already taken
  if (req.body.name && req.body.name !== company.name) {
    const existingCompany = await Company.findOne({ 
      name: req.body.name,
      isActive: true,
      _id: { $ne: req.params.id }
    });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: 'Company with this name already exists'
      });
    }
  }

  const updatedCompany = await Company.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('assignedTo', 'name email');

  res.json({
    success: true,
    message: 'Company updated successfully',
    data: updatedCompany
  });
}));

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private
router.delete('/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);

  if (!company) {
    return res.status(404).json({
      success: false,
      message: 'Company not found'
    });
  }

  // Check if user can delete this company
  if (req.user.role !== 'admin' && company.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Soft delete
  company.isActive = false;
  await company.save();

  res.json({
    success: true,
    message: 'Company deleted successfully'
  });
}));

// @desc    Get companies by industry
// @route   GET /api/companies/industry/:industry
// @access  Private
router.get('/industry/:industry', asyncHandler(async (req, res) => {
  const { industry } = req.params;
  
  let query = { industry, isActive: true };
  
  // Non-admin users can only see their assigned companies
  if (req.user.role !== 'admin') {
    query.assignedTo = req.user._id;
  }

  const companies = await Company.find(query)
    .populate('assignedTo', 'name email')
    .sort({ name: 1 });

  res.json({
    success: true,
    data: companies
  });
}));

// @desc    Get companies by status
// @route   GET /api/companies/status/:status
// @access  Private
router.get('/status/:status', asyncHandler(async (req, res) => {
  const { status } = req.params;
  
  let query = { status, isActive: true };
  
  // Non-admin users can only see their assigned companies
  if (req.user.role !== 'admin') {
    query.assignedTo = req.user._id;
  }

  const companies = await Company.find(query)
    .populate('assignedTo', 'name email')
    .sort({ name: 1 });

  res.json({
    success: true,
    data: companies
  });
}));

// @desc    Get companies needing follow-up
// @route   GET /api/companies/follow-up
// @access  Private
router.get('/follow-up', asyncHandler(async (req, res) => {
  let query = {
    nextFollowUp: { $lte: new Date() },
    isActive: true
  };
  
  // Non-admin users can only see their assigned companies
  if (req.user.role !== 'admin') {
    query.assignedTo = req.user._id;
  }

  const companies = await Company.find(query)
    .populate('assignedTo', 'name email')
    .sort({ nextFollowUp: 1 });

  res.json({
    success: true,
    data: companies
  });
}));

// @desc    Update company status
// @route   PUT /api/companies/:id/status
// @access  Private
router.put('/:id/status', validateObjectId('id'), asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !['prospect', 'customer', 'partner', 'inactive'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Valid status is required'
    });
  }

  const company = await Company.findById(req.params.id);

  if (!company) {
    return res.status(404).json({
      success: false,
      message: 'Company not found'
    });
  }

  // Check if user can update this company
  if (req.user.role !== 'admin' && company.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  company.status = status;
  await company.save();

  res.json({
    success: true,
    message: 'Company status updated successfully',
    data: company
  });
}));

// @desc    Get company statistics
// @route   GET /api/companies/stats
// @access  Private
router.get('/stats', asyncHandler(async (req, res) => {
  let matchQuery = { isActive: true };
  
  // Non-admin users can only see their assigned companies
  if (req.user.role !== 'admin') {
    matchQuery.assignedTo = req.user._id;
  }

  const industryStats = await Company.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$industry',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$revenue' },
        avgRevenue: { $avg: '$revenue' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  const statusStats = await Company.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const sizeStats = await Company.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$size',
        count: { $sum: 1 }
      }
    }
  ]);

  const totalCompanies = await Company.countDocuments(matchQuery);
  
  const recentCompanies = await Company.find(matchQuery)
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    data: {
      totalCompanies,
      industryDistribution: industryStats,
      statusDistribution: statusStats,
      sizeDistribution: sizeStats,
      recentCompanies
    }
  });
}));

export default router;