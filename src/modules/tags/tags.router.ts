import { Router } from 'express';

import { authMiddleware } from '@/middlewares/authMiddleware';
import { asyncHandler } from '@/utils/asyncHandler';

import {
  createTagController,
  deleteTagController,
  getTagByIdController,
  getTagsController,
} from './tags.controller';

export const tagsRouter = Router();

tagsRouter.use(authMiddleware);

tagsRouter.get('/', asyncHandler(getTagsController));
tagsRouter.get('/:id', asyncHandler(getTagByIdController));
tagsRouter.post('/', asyncHandler(createTagController));
tagsRouter.delete('/:id', asyncHandler(deleteTagController));
