import { Router } from 'express';

import { authMiddleware } from '@/middlewares/authMiddleware';
import { asyncHandler } from '@/utils/asyncHandler';

import {
  loginController,
  logoutController,
  meController,
  refreshController,
} from './auth.controller';

export const authRouter = Router();

authRouter.post('/login', asyncHandler(loginController));
authRouter.post('/refresh', asyncHandler(refreshController));
authRouter.post('/logout', asyncHandler(logoutController));
authRouter.get('/me', authMiddleware, asyncHandler(meController));
