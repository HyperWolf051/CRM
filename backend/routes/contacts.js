import express from 'express';
import Contact from '../models/Contact.js';
import { protect, authorizeOwnerOrAdmin } from '../middleware/auth.js';
import { validateContactCreation, validateObjectId, validatePagination } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private
router.get('/', validatePagination, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { search, status, source, assignedTo } = req.query;

  // Build query
  let query = { isActive: true };
  
  // Non-admin users can only see their assigned contacts
  if (req.user.role !== 'admin') {
    query.assignedTo = req.user._id;
  } else if (assignedTo) {
    query.assignedTo = assignedTo;
  }
  
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (status) {
    query.status = status;
  }
  
  if (source) {
    query.source = source;
  }

  const contacts = await Contact.find(query)
    .populate('assignedTo', 'name email')
    .populate('company', 'name industry')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Contact.countDocuments(query);

  res.json({
    success: true,
    data: contacts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// @desc    Get contact by ID
// @route   GET /api/contacts/:id
// @access  Private
router.get('/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)
    .populate('assignedTo', 'name email')
    .populate('company', 'name industry website');

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }

  // Check if user can access this contact
  if (req.user.role !== 'admin' && contact.assignedTo._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  res.json({
    success: true,
    data: contact
  });
}));

// @desc    Create new contact
// @route   POST /api/contacts
// @access  Private
router.post('/', validateContactCreation, asyncHandler(async (req, res) => {
  const contactData = {
    ...req.body,
    assignedTo: req.body.assignedTo || req.user._id
  };

  // Check if contact with this email already exists
  const existingContact = await Contact.findOne({ 
    email: contactData.email,
    isActive: true 
  });

  if (existingContact) {
    return res.status(400).json({
      success: false,
      message: 'Contact with this email already exists'
    });
  }

  const contact = await Contact.create(contactData);
  
  await contact.populate('assignedTo', 'name email');
  await contact.populate('company', 'name industry');

  res.status(201).json({
    success: true,
    message: 'Contact created successfully',
    data: contact
  });
}));

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Private
router.put('/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }

  // Check if user can update this contact
  if (req.user.role !== 'admin' && contact.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Check if email is being changed and if it's already taken
  if (req.body.email && req.body.email !== contact.email) {
    const existingContact = await Contact.findOne({ 
      email: req.body.email,
      isActive: true,
      _id: { $ne: req.params.id }
    });

    if (existingContact) {
      return res.status(400).json({
        success: false,
        message: 'Contact with this email already exists'
      });
    }
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  )
  .populate('assignedTo', 'name email')
  .populate('company', 'name industry');

  res.json({
    success: true,
    message: 'Contact updated successfully',
    data: updatedContact
  });
}));

// @desc    Delete contact
// @route   DELETE /api/contacts/:id
// @access  Private
router.delete('/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }

  // Check if user can delete this contact
  if (req.user.role !== 'admin' && contact.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Soft delete
  contact.isActive = false;
  await contact.save();

  res.json({
    success: true,
    message: 'Contact deleted successfully'
  });
}));

// @desc    Get contacts by status
// @route   GET /api/contacts/status/:status
// @access  Private
router.get('/status/:status', asyncHandler(async (req, res) => {
  const { status } = req.params;
  
  let query = { status, isActive: true };
  
  // Non-admin users can only see their assigned contacts
  if (req.user.role !== 'admin') {
    query.assignedTo = req.user._id;
  }

  const contacts = await Contact.find(query)
    .populate('assignedTo', 'name email')
    .populate('company', 'name industry')
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: contacts
  });
}));

// @desc    Get contacts needing follow-up
// @route   GET /api/contacts/follow-up
// @access  Private
router.get('/follow-up', asyncHandler(async (req, res) => {
  let query = {
    nextFollowUp: { $lte: new Date() },
    isActive: true
  };
  
  // Non-admin users can only see their assigned contacts
  if (req.user.role !== 'admin') {
    query.assignedTo = req.user._id;
  }

  const contacts = await Contact.find(query)
    .populate('assignedTo', 'name email')
    .populate('company', 'name industry')
    .sort({ nextFollowUp: 1 });

  res.json({
    success: true,
    data: contacts
  });
}));

// @desc    Update contact status
// @route   PUT /api/contacts/:id/status
// @access  Private
router.put('/:id/status', validateObjectId('id'), asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !['active', 'inactive', 'prospect', 'customer', 'lead'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Valid status is required'
    });
  }

  const contact = await Contact.findById(req.params.id);

  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }

  // Check if user can update this contact
  if (req.user.role !== 'admin' && contact.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  contact.status = status;
  await contact.save();

  res.json({
    success: true,
    message: 'Contact status updated successfully',
    data: contact
  });
}));

// @desc    Get contact statistics
// @route   GET /api/contacts/stats
// @access  Private
router.get('/stats', asyncHandler(async (req, res) => {
  let matchQuery = { isActive: true };
  
  // Non-admin users can only see their assigned contacts
  if (req.user.role !== 'admin') {
    matchQuery.assignedTo = req.user._id;
  }

  const statusStats = await Contact.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const sourceStats = await Contact.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$source',
        count: { $sum: 1 }
      }
    }
  ]);

  const totalContacts = await Contact.countDocuments(matchQuery);
  
  const recentContacts = await Contact.find(matchQuery)
    .populate('assignedTo', 'name email')
    .populate('company', 'name industry')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    data: {
      totalContacts,
      statusDistribution: statusStats,
      sourceDistribution: sourceStats,
      recentContacts
    }
  });
}));

export default router;