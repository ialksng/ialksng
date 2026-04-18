import express from 'express';
import { getGames, createGame, getLiveStream, getGameStreams, getProducts, getLifePosts } from './more.controller.js';
import { verifyAdmin } from '../../core/middlewares/admin.middleware.js'; // Assuming you have this middleware based on repo structure

const router = express.Router();

router.get('/games', getGames);
router.get('/streams/live', getLiveStream);
router.get('/games/:gameId/streams', getGameStreams);
router.get('/products', getProducts);
router.get('/life', getLifePosts);

router.post('/games', verifyAdmin, createGame);

export default router;