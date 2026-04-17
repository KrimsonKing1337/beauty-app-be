import { Router } from 'express';

import { authMiddleware } from '@/middlewares/authMiddleware';

import {
  loginController,
  logoutController,
  meController,
  refreshController,
} from './auth.controller';

export const authRouter = Router();

authRouter.post('/login', loginController);
authRouter.post('/refresh', refreshController);
authRouter.post('/logout', logoutController);
authRouter.get('/me', authMiddleware, meController);
