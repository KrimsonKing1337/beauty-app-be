import type { Request, Response } from 'express';
import { z } from 'zod';

import { AppError } from '@/utils/AppError';
import { requireUser } from '@/utils/requireUser';

import {
  createTagSchema,
  tagIdParamsSchema,
} from './tags.schemas';

import {
  createTagService,
  deleteTagService,
  getAllTagsService,
  getTagByIdService,
} from './tags.service';

export const getTagsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId } = requireUser(req);

  const tags = await getAllTagsService(userId);

  res.json(tags);
};

export const getTagByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = tagIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError(
      400,
      'Неверный id тэга',
      z.treeifyError(paramsResult.error),
    );
  }

  const { userId } = requireUser(req);

  const tag = await getTagByIdService(userId, paramsResult.data.id);

  if (!tag) {
    throw new AppError(404, 'Тэг не найден');
  }

  res.json(tag);
};

export const createTagController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const bodyResult = createTagSchema.safeParse(req.body);

  if (!bodyResult.success) {
    throw new AppError(
      400,
      'Неверный payload тэга',
      z.treeifyError(bodyResult.error),
    );
  }

  const { userId } = requireUser(req);

  const tag = await createTagService(userId, bodyResult.data);

  res.status(201).json(tag);
};

export const deleteTagController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = tagIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError(
      400,
      'Неверный id тэга',
      z.treeifyError(paramsResult.error),
    );
  }

  const { userId } = requireUser(req);

  const isDeleted = await deleteTagService(userId, paramsResult.data.id);

  if (!isDeleted) {
    throw new AppError(404, 'Тэг не найден');
  }

  res.status(204).send();
};
