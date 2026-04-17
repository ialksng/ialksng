import express from 'express';
import { globalSearch, getSuggestions } from './search.controller.js';

const router = express.Router();

router.get('/', globalSearch);
router.get('/suggestions', getSuggestions);

export default router;