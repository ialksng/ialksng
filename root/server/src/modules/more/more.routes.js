import express from 'express';
import {
  getGames, createGame, deleteGame,
  getProducts, createProduct, deleteProduct,
  getLifePosts, createLifePost, deleteLifePost,
  getLiveStream, getGameStreams, getAllStreams, createStream, deleteStream, toggleStreamStatus
} from './more.controller.js';
import { verifyAdmin } from '../../core/middlewares/admin.middleware.js';
import { upload } from '../../core/middlewares/upload.middleware.js';

const router = express.Router();

router.get('/games', getGames);
router.get('/products', getProducts);
router.get('/life', getLifePosts);
router.get('/streams/live', getLiveStream);
router.get('/games/:gameId/streams', getGameStreams);

router.post('/games', verifyAdmin, upload.single('image'), createGame);
router.post('/products', verifyAdmin, upload.single('image'), createProduct);
router.post('/life', verifyAdmin, upload.single('image'), createLifePost);

router.get('/streams/all', getAllStreams);
router.post('/streams', verifyAdmin, createStream);
router.put('/streams/:id/status', verifyAdmin, toggleStreamStatus);

router.delete('/games/:id', verifyAdmin, deleteGame);
router.delete('/products/:id', verifyAdmin, deleteProduct);
router.delete('/life/:id', verifyAdmin, deleteLifePost);
router.delete('/streams/:id', verifyAdmin, deleteStream);

export default router;