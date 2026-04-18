import express from 'express';
import { 
getGames, 
  createGame, 
  deleteGame,          
  getLiveStream, 
  getGameStreams, 
  toggleStreamStatus,
  deleteStream,         
  getProducts, 
  deleteProduct,        
  getLifePosts, 
  deleteLifePost
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

export default router;