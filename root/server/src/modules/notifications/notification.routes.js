import express from 'express';
import { getUserNotifications, markAsRead, markAllAsRead } from './notification.controller.js';
import { protect } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, getUserNotifications);
router.put('/read-all', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);

export default router;