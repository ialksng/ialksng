import express from 'express';
import { 
  getGames, createGame, getLiveStream, getGameStreams, 
  getProducts, createProduct, getLifePosts, createLifePost, 
  deleteGame, deleteProduct, deleteLifePost, deleteStream,
  getAllStreams, createStream, toggleStreamStatus
} from './more.controller.js';
import { adminOnly } from '../../core/middlewares/admin.middleware.js'; 

const router = express.Router();

router.get('/games', getGames);
router.get('/streams/live', getLiveStream);
router.get('/games/:gameId/streams', getGameStreams);
router.get('/products', getProducts);
router.get('/life', getLifePosts);

router.post('/games', adminOnly, createGame);
router.delete('/games/:id', adminOnly, deleteGame);
router.delete('/streams/:id', adminOnly, deleteStream);
router.delete('/products/:id', adminOnly, deleteProduct);
router.delete('/life/:id', adminOnly, deleteLifePost);
router.get('/streams/all', getAllStreams);
router.post('/streams', adminOnly, createStream);
router.put('/streams/:id/status', adminOnly, toggleStreamStatus);

export default router;