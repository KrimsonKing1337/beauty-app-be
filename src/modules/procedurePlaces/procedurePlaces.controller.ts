import type { Request, Response } from 'express';
import { z } from 'zod';

import { AppError } from '@/utils/AppError';
import { requireUser } from '@/utils/requireUser';

import {
  createProcedurePlaceSchema,
  procedurePlaceIdParamsSchema,
} from './procedurePlaces.schemas';

import {
  createProcedurePlaceService,
  deleteProcedurePlaceService,
  getAllProcedurePlacesService,
  getProcedurePlaceByIdService,
} from './procedurePlaces.service';

export const getProcedurePlacesController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId } = requireUser(req);

  const procedurePlaces = await getAllProcedurePlacesService(userId);

  res.json(procedurePlaces);
};

export const getProcedurePlaceByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = procedurePlaceIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError(
      400,
      'Неверный id места проведения процедуры',
      z.treeifyError(paramsResult.error),
    );
  }

  const { userId } = requireUser(req);

  const procedurePlace = await getProcedurePlaceByIdService(
    userId,
    paramsResult.data.id,
  );

  if (!procedurePlace) {
    throw new AppError(404, 'Место проведения процедуры не найдено');
  }

  res.json(procedurePlace);
};

export const createProcedurePlaceController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const bodyResult = createProcedurePlaceSchema.safeParse(req.body);

  if (!bodyResult.success) {
    throw new AppError(
      400,
      'Неверный payload места проведения процедуры',
      z.treeifyError(bodyResult.error),
    );
  }

  const { userId } = requireUser(req);

  const procedurePlace = await createProcedurePlaceService(
    userId,
    bodyResult.data,
  );

  res.status(201).json(procedurePlace);
};

export const deleteProcedurePlaceController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = procedurePlaceIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError(
      400,
      'Неверный id места проведения процедуры',
      z.treeifyError(paramsResult.error),
    );
  }

  const { userId } = requireUser(req);

  const isDeleted = await deleteProcedurePlaceService(
    userId,
    paramsResult.data.id,
  );

  if (!isDeleted) {
    throw new AppError(404, 'Место проведения процедуры не найдено');
  }

  res.status(204).send();
};
