import { Router } from 'express';

import auth from '../middleware/auth';
import market from '../controller/market';

const router = Router();

/* Create Market */
router.post('/', auth, market.create);
router.get('/', auth, market.getAll);
router.get('/geo', auth, market.getByReverseGeocoding);
router.get('/:category', auth, market.getByCategory);

export default router;
