import express from 'express';
import {
  getGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  getProducts,
  createProduct,
  deleteProduct,
  getLifePosts,
  createLifePost,
  deleteLifePost,
  reactToLifePost, // NEW
  commentOnLifePost, // NEW
  getLiveStream,
  getGameStreams,
  getAllStreams,
  createStream,
  deleteStream,
  toggleStreamStatus
} from './more.controller.js';

import { adminOnly } from '../../core/middlewares/admin.middleware.js';
import { protect } from '../../core/middlewares/auth.middleware.js';
import { upload } from '../../core/middlewares/upload.middleware.js';

const router = express.Router();

router.get('/games', getGames);
router.get('/games/:id', getGameById);
router.get('/products', getProducts);
router.get('/life', getLifePosts);
router.get('/streams/live', getLiveStream);
router.get('/games/:gameId/streams', getGameStreams);
router.get('/streams/all', getAllStreams);

router.post('/games', protect, adminOnly, upload.single('image'), createGame);
router.put('/games/:id', protect, adminOnly, upload.single('image'), updateGame);
router.delete('/games/:id', protect, adminOnly, deleteGame);

router.post('/products', protect, adminOnly, upload.single('image'), createProduct);
router.delete('/products/:id', protect, adminOnly, deleteProduct);

router.post('/life', protect, adminOnly, createLifePost);
router.delete('/life/:id', protect, adminOnly, deleteLifePost);

router.post('/life/:id/react', protect, reactToLifePost);
router.post('/life/:id/comment', protect, commentOnLifePost);

router.post('/streams', protect, adminOnly, createStream);
router.put('/streams/:id/status', protect, adminOnly, toggleStreamStatus);
router.delete('/streams/:id', protect, adminOnly, deleteStream);

export default router;