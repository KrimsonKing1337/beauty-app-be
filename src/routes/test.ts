import { Router } from 'express';

import { getRoot, getTest } from '../controllers/testController';

const router = Router();

router.get('/', getRoot);
router.get('/test', getTest);

export { router };
