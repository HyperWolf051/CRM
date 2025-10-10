import express from 'express';
import User from '../models/User.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateUserUpdate, validateObjectId, validatePagination } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin/Manager)
router.get('/', authorize('admin', 'manager'), validatePagination, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { search, role, isActive } = req.query;

  // Build query
  let query = {};
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (role) {
    query.role = role;
  }
  
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Users can only view their own profile unless they're admin/manager
  if (req.user._id.toString() !== req.params.id && 
      !['admin', 'manager'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  res.json({
    success: true,
    data: user
  });
}));

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', validateObjectId('id'), validateUserUpdate, asyncHandler(async (req, res) => {
  const { name, email, phone, department, position, preferences } = req.body;

  // Users can only update their own profile unless they're admin
  if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check if email is being changed and if it's already taken
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email is already taken'
      });
    }
  }

  // Update fields
  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (department) user.department = department;
  if (position) user.position = position;
  if (preferences) user.preferences = { ...user.preferences, ...preferences };

  await user.save();

  res.json({
    success: true,
    message: 'User updated successfully',
    data: user.profile
  });
}));

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (Admin only)
router.put('/:id/role', authorize('admin'), validateObjectId('id'), asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!role || !['admin', 'manager', 'user'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Valid role is required (admin, manager, or user)'
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Prevent admin from changing their own role
  if (req.user._id.toString() === req.params.id) {
    return res.status(400).json({
      success: false,
      message: 'Cannot change your own role'
    });
  }

  user.role = role;
  await user.save();

  res.json({
    success: true,
    message: 'User role updated successfully',
    data: user.profile
  });
}));

// @desc    Deactivate user
// @route   PUT /api/users/:id/deactivate
// @access  Private (Admin only)
router.put('/:id/deactivate', authorize('admin'), validateObjectId('id'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Prevent admin from deactivating themselves
  if (req.user._id.toString() === req.params.id) {
    return res.status(400).json({
      success: false,
      message: 'Cannot deactivate your own account'
    });
  }

  user.isActive = false;
  await user.save();

  res.json({
    success: true,
    message: 'User deactivated successfully'
  });
}));

// @desc    Activate user
// @route   PUT /api/users/:id/activate
// @access  Private (Admin only)
router.put('/:id/activate', authorize('admin'), validateObjectId('id'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  user.isActive = true;
  await user.save();

  res.json({
    success: true,
    message: 'User activated successfully'
  });
}));

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
router.delete('/:id', authorize('admin'), validateObjectId('id'), asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Prevent admin from deleting themselves
  if (req.user._id.toString() === req.params.id) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete your own account'
    });
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
}));

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private (Admin/Manager)
router.get('/stats', authorize('admin', 'manager'), asyncHandler(async (req, res) => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: { $sum: { $cond: ['$isActive', 1, 0] } },
        inactiveUsers: { $sum: { $cond: ['$isActive', 0, 1] } }
      }
    }
  ]);

  const roleStats = await User.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);

  const recentUsers = await User.find({ isActive: true })
    .select('-password')
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    data: {
      overview: stats[0] || { totalUsers: 0, activeUsers: 0, inactiveUsers: 0 },
      roleDistribution: roleStats,
      recentUsers
    }
  });
}));

export default router;