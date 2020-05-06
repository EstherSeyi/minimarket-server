import { Router } from 'express';

import auth from '../middleware/auth';
import market from '../controller/market';

const router = Router();

/* Create Market */
router.post('/', auth, market.create);
router.get('/', market.getAll);
router.put('/', auth, market.updateMarket);
router.delete('/', auth, market.deleteMarkets);
router.get('/geo', market.getByReverseGeocoding);
router.get('/category', market.getByCategory);
router.get('/nearest', market.getNearestMarket);
router.put('/name', auth, market.updateMarketName);

export default router;
