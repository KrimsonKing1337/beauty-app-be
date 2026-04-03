import { Router } from 'express';

import { authMiddleware } from '@/middlewares/authMiddleware';

import { authController } from './auth.controller';

export const authRoutes = Router();

authRoutes.post('/login', authController.login);
authRoutes.post('/refresh', authController.refresh);
authRoutes.post('/logout', authController.logout);
authRoutes.get('/me', authMiddleware, authController.me);
