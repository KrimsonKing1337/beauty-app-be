import { Router } from 'express';

import { getProcedures } from '../controllers/procedures';

const router = Router();

router.get('/procedures', getProcedures);

export { router };
