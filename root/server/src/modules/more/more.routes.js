import express from 'express';
import {
  getGames, createGame, deleteGame,
  getProducts, createProduct, deleteProduct,
  getLifePosts, createLifePost, deleteLifePost,
  getLiveStream, getGameStreams, getAllStreams, createStream, deleteStream, toggleStreamStatus
} from './more.controller.js';
import { adminOnly } from '../../core/middlewares/admin.middleware.js';
import { upload } from '../../core/middlewares/upload.middleware.js';

const router = express.Router();

router.get('/games', getGames);
router.get('/products', getProducts);
router.get('/life', getLifePosts);
router.get('/streams/live', getLiveStream);
router.get('/games/:gameId/streams', getGameStreams);

router.post('/games', adminOnly, upload.single('image'), createGame);
router.post('/products', adminOnly, upload.single('image'), createProduct);
router.post('/life', adminOnly, upload.single('image'), createLifePost);

router.get('/streams/all', getAllStreams);
router.post('/streams', adminOnly, createStream);
router.put('/streams/:id/status', adminOnly, toggleStreamStatus);

router.delete('/games/:id', adminOnly, deleteGame);
router.delete('/products/:id', adminOnly, deleteProduct);
router.delete('/life/:id', adminOnly, deleteLifePost);
router.delete('/streams/:id', adminOnly, deleteStream);

export default router;