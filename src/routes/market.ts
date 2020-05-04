import { Router } from 'express';

import auth from '../middleware/auth';
import market from '../controller/market';

const router = Router();

/* Create Market */
router.post('/', auth, market.create);
router.get('/', auth, market.getAll);

export default router;
