import { Router } from 'express';

const router = Router();

/* GET home page. */
router.get('/', function (_req, res, _next) {
  res.render('index', { title: 'Express' });
});

export default router;
