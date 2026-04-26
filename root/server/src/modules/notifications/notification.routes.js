import express from 'express';
import { getUserNotifications, markAsRead, markAllAsRead, getPublicNotifications } from './notification.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

// PUBLIC ROUTE: Accessible without login (Put this BEFORE the / route)
router.get('/public', getPublicNotifications);

// PROTECTED ROUTES:
router.get('/', protect, getUserNotifications);
router.put('/read-all', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);

export default router;