import express from 'express';
import { subscribe, getSubscribers, sendNewsletter } from './newsletter.controller.js';
import { protect, admin } from '../../core/middlewares/auth.middleware.js';

const router = express.Router();

router.post('/subscribe', subscribe);
router.get('/subscribers', protect, admin, getSubscribers);
router.post('/send', protect, admin, sendNewsletter);

export default router;