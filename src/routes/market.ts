import { Router } from 'express';

import auth from '../middleware/auth';
import market from '../controller/market';

const router = Router();

/* Create Market */
router.post('/', auth, market.create);
router.get('/', auth, market.getAll);
router.get('/geo', auth, market.getByReverseGeocoding);
router.get('/:category', auth, market.getByCategory);
router.delete('/:name', auth, market.deleteMarket);

export default router;
