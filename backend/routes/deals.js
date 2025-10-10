import express from 'express';
import Deal from '../models/Deal.js';
import { protect } from '../middleware/auth.js';
import { validateDealCreation, validateObjectId, validatePagination } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get all deals
// @route   GET /api/deals
// @access  Private
router.get('/', validatePagination, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { search, stage, assignedTo, minValue, maxValue } = req.query;

  // Build query
  let query = { isActive: true };
  
  // Non-admin users can only see their assigned deals
  if (req.user.role !== 'admin') {
    query.assignedTo = req.user._id;
  } else if (assignedTo) {
    query.assignedTo = assignedTo;
  }
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (stage) {
    query.stage = stage;
  }
  
  if (minValue || maxValue) {
    query.value = {};
    if (minValue) query.value.$gte = parseFloat(minValue);
    if (maxValue) query.value.$lte = parseFloat(maxValue);
  }

  const deals = await Deal.find(query)
    .populate('assignedTo', 'name email')
    .populate('contact', 'firstName lastName email')
    .populate('company', 'name industry')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Deal.countDocuments(query);

  res.json({
    success: true,
    data: deals,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// @desc    Get deal by ID
// @route   GET /api/deals/:id
// @access  Private
router.get('/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('contact', 'firstName lastName email phone')
    .populate('company', 'name industry website')
    .populate('activities.createdBy', 'name email');

  if (!deal) {
    return res.status(404).json({
      success: false,
      message: 'Deal not found'
    });
  }

  // Check if user can access this deal
  if (req.user.role !== 'admin' && deal.assignedTo._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  res.json({
    success: true,
    data: deal
  });
}));

// @desc    Create new deal
// @route   POST /api/deals
// @access  Private
router.post('/', validateDealCreation, asyncHandler(async (req, res) => {
  const dealData = {
    ...req.body,
    assignedTo: req.body.assignedTo || req.user._id
  };

  const deal = await Deal.create(dealData);
  
  await deal.populate('assignedTo', 'name email');
  await deal.populate('contact', 'firstName lastName email');
  await deal.populate('company', 'name industry');

  res.status(201).json({
    success: true,
    message: 'Deal created successfully',
    data: deal
  });
}));

// @desc    Update deal
// @route   PUT /api/deals/:id
// @access  Private
router.put('/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id);

  if (!deal) {
    return res.status(404).json({
      success: false,
      message: 'Deal not found'
    });
  }

  // Check if user can update this deal
  if (req.user.role !== 'admin' && deal.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  const updatedDeal = await Deal.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
  .populate('assignedTo', 'name email')
  .populate('contact', 'firstName lastName email')
  .populate('company', 'name industry');

  res.json({
    success: true,
    message: 'Deal updated successfully',
    data: updatedDeal
  });
}));

// @desc    Delete deal
// @route   DELETE /api/deals/:id
// @access  Private
router.delete('/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const deal = await Deal.findById(req.params.id);

  if (!deal) {
    return res.status(404).json({
      success: false,
      message: 'Deal not found'
    });
  }

  // Check if user can delete this deal
  if (req.user.role !== 'admin' && deal.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Soft delete
  deal.isActive = false;
  await deal.save();

  res.json({
    success: true,
    message: 'Deal deleted successfully'
  });
}));

// @desc    Get deals by stage
// @route   GET /api/deals/stage/:stage
// @access  Private
router.get('/stage/:stage', asyncHandler(async (req, res) => {
  const { stage } = req.params;
  
  let query = { stage, isActive: true };
  
  // Non-admin users can only see their assigned deals
  if (req.user.role !== 'admin') {
    query.assignedTo = req.user._id;
  }

  const deals = await Deal.find(query)
    .populate('assignedTo', 'name email')
    .populate('contact', 'firstName lastName email')
    .populate('company', 'name industry')
    .sort({ expectedCloseDate: 1 });

  res.json({
    success: true,
    data: deals
  });
}));

// @desc    Get overdue deals
// @route   GET /api/deals/overdue
// @access  Private
router.get('/overdue', asyncHandler(async (req, res) => {
  let query = {
    expectedCloseDate: { $lt: new Date() },
    stage: { $nin: ['closed_won', 'closed_lost'] },
    isActive: true
  };
  
  // Non-admin users can only see their assigned deals
  if (req.user.role !== 'admin') {
    query.assignedTo = req.user._id;
  }

  const deals = await Deal.find(query)
    .populate('assignedTo', 'name email')
    .populate('contact', 'firstName lastName email')
    .populate('company', 'name industry')
    .sort({ expectedCloseDate: 1 });

  res.json({
    success: true,
    data: deals
  });
}));

// @desc    Update deal stage
// @route   PUT /api/deals/:id/stage
// @access  Private
router.put('/:id/stage', validateObjectId('id'), asyncHandler(async (req, res) => {
  const { stage, probability } = req.body;

  if (!stage || !['lead', 'qualified', 'proposal', 'negotiation', 'closed_won', 'closed_lost'].includes(stage)) {
    return res.status(400).json({
      success: false,
      message: 'Valid stage is required'
    });
  }

  const deal = await Deal.findById(req.params.id);

  if (!deal) {
    return res.status(404).json({
      success: false,
      message: 'Deal not found'
    });
  }

  // Check if user can update this deal
  if (req.user.role !== 'admin' && deal.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  deal.stage = stage;
  if (probability !== undefined) {
    deal.probability = probability;
  }

  await deal.save();

  res.json({
    success: true,
    message: 'Deal stage updated successfully',
    data: deal
  });
}));

// @desc    Add activity to deal
// @route   POST /api/deals/:id/activities
// @access  Private
router.post('/:id/activities', validateObjectId('id'), asyncHandler(async (req, res) => {
  const { type, description } = req.body;

  if (!type || !description) {
    return res.status(400).json({
      success: false,
      message: 'Activity type and description are required'
    });
  }

  if (!['call', 'email', 'meeting', 'note', 'task'].includes(type)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid activity type'
    });
  }

  const deal = await Deal.findById(req.params.id);

  if (!deal) {
    return res.status(404).json({
      success: false,
      message: 'Deal not found'
    });
  }

  // Check if user can update this deal
  if (req.user.role !== 'admin' && deal.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  deal.activities.push({
    type,
    description,
    createdBy: req.user._id
  });

  await deal.save();
  await deal.populate('activities.createdBy', 'name email');

  res.json({
    success: true,
    message: 'Activity added successfully',
    data: deal.activities[deal.activities.length - 1]
  });
}));

// @desc    Get pipeline summary
// @route   GET /api/deals/pipeline/summary
// @access  Private
router.get('/pipeline/summary', asyncHandler(async (req, res) => {
  let matchQuery = { isActive: true };
  
  // Non-admin users can only see their assigned deals
  if (req.user.role !== 'admin') {
    matchQuery.assignedTo = req.user._id;
  }

  const pipelineSummary = await Deal.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$stage',
        count: { $sum: 1 },
        totalValue: { $sum: '$value' },
        avgValue: { $avg: '$value' },
        weightedValue: { $sum: { $multiply: ['$value', { $divide: ['$probability', 100] }] } }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const totalDeals = await Deal.countDocuments(matchQuery);
  const totalValue = await Deal.aggregate([
    { $match: matchQuery },
    { $group: { _id: null, total: { $sum: '$value' } } }
  ]);

  res.json({
    success: true,
    data: {
      totalDeals,
      totalValue: totalValue[0]?.total || 0,
      pipelineStages: pipelineSummary
    }
  });
}));

// @desc    Get deal statistics
// @route   GET /api/deals/stats
// @access  Private
router.get('/stats', asyncHandler(async (req, res) => {
  let matchQuery = { isActive: true };
  
  // Non-admin users can only see their assigned deals
  if (req.user.role !== 'admin') {
    matchQuery.assignedTo = req.user._id;
  }

  const stageStats = await Deal.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$stage',
        count: { $sum: 1 },
        totalValue: { $sum: '$value' }
      }
    }
  ]);

  const sourceStats = await Deal.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$source',
        count: { $sum: 1 }
      }
    }
  ]);

  const totalDeals = await Deal.countDocuments(matchQuery);
  
  const recentDeals = await Deal.find(matchQuery)
    .populate('assignedTo', 'name email')
    .populate('contact', 'firstName lastName email')
    .populate('company', 'name industry')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    data: {
      totalDeals,
      stageDistribution: stageStats,
      sourceDistribution: sourceStats,
      recentDeals
    }
  });
}));

export default router;