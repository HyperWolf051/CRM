import express from 'express';
import Notification from '../models/Notification.js';
import { protect } from '../middleware/auth.js';
import { validateObjectId, validatePagination } from '../middleware/validation.js';
import { asyncHandler } from '../middleware/errorHandler.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// @desc    Get all notifications for user
// @route   GET /api/notifications
// @access  Private
router.get('/', validatePagination, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const { type, category, isRead } = req.query;

  let query = { recipient: req.user._id, isActive: true };
  
  if (type) query.type = type;
  if (category) query.category = category;
  if (isRead !== undefined) query.isRead = isRead === 'true';

  const notifications = await Notification.findForUser(req.user._id, page, limit);
  const total = await Notification.countDocuments(query);

  res.json({
    success: true,
    data: notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));

// @desc    Get unread notifications count
// @route   GET /api/notifications/unread-count
// @access  Private
router.get('/unread-count', asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
    isActive: true
  });

  res.json({
    success: true,
    data: { count }
  });
}));

// @desc    Get unread notifications
// @route   GET /api/notifications/unread
// @access  Private
router.get('/unread', asyncHandler(async (req, res) => {
  const notifications = await Notification.findUnreadForUser(req.user._id);

  res.json({
    success: true,
    data: notifications
  });
}));

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', validateObjectId('id'), asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  // Check if user owns this notification
  if (notification.recipient.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  notification.isRead = true;
  await notification.save();

  res.json({
    success: true,
    message: 'Notification marked as read',
    data: notification
  });
}));

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
router.put('/mark-all-read', asyncHandler(async (req, res) => {
  await Notification.markAllAsReadForUser(req.user._id);

  res.json({
    success: true,
    message: 'All notifications marked as read'
  });
}));

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', validateObjectId('id'), asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  // Check if user owns this notification
  if (notification.recipient.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }

  // Soft delete
  notification.isActive = false;
  await notification.save();

  res.json({
    success: true,
    message: 'Notification deleted successfully'
  });
}));

// @desc    Create notification (for testing or admin use)
// @route   POST /api/notifications
// @access  Private
router.post('/', asyncHandler(async (req, res) => {
  const { title, message, type, category, priority, actionUrl, actionText, recipientId } = req.body;

  if (!title || !message) {
    return res.status(400).json({
      success: false,
      message: 'Title and message are required'
    });
  }

  const notification = await Notification.create({
    title,
    message,
    type: type || 'info',
    category: category || 'general',
    priority: priority || 'medium',
    actionUrl,
    actionText,
    recipient: recipientId || req.user._id,
    sender: req.user._id
  });

  await notification.populate('sender', 'name email');

  res.status(201).json({
    success: true,
    message: 'Notification created successfully',
    data: notification
  });
}));

// @desc    Get notification statistics
// @route   GET /api/notifications/stats
// @access  Private
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await Notification.getCountsByType(req.user._id);

  const totalNotifications = await Notification.countDocuments({
    recipient: req.user._id,
    isActive: true
  });

  const unreadNotifications = await Notification.countDocuments({
    recipient: req.user._id,
    isRead: false,
    isActive: true
  });

  res.json({
    success: true,
    data: {
      totalNotifications,
      unreadNotifications,
      typeDistribution: stats
    }
  });
}));

export default router;