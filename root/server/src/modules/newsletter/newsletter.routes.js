import express from 'express';
import { subscribe, getSubscribers } from './newsletter.controller.js';
import { protect, admin } from '../../core/middleware/auth.middleware.js';

const router = express.Router();

router.post('/subscribe', subscribe);
router.get('/subscribers', protect, admin, getSubscribers);

export default router;