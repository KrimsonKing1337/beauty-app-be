import type { Request, Response } from 'express';
import { z } from 'zod';

import { AppError } from '@/utils/AppError';
import { requireUser } from '@/utils/requireUser';

import {
  createProcedureTypeSchema,
  procedureTypeIdParamsSchema,
} from './procedureTypes.schemas';

import {
  createProcedureTypeService,
  deleteProcedureTypeService,
  getAllProcedureTypesService,
  getProcedureTypeByIdService,
} from './procedureTypes.service';

export const getProcedureTypesController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userId } = requireUser(req);

  const procedureTypes = await getAllProcedureTypesService(userId);

  res.json(procedureTypes);
};

export const getProcedureTypeByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = procedureTypeIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError(
      400,
      'Неверный id типа процедуры',
      z.treeifyError(paramsResult.error),
    );
  }

  const { userId } = requireUser(req);

  const procedureType = await getProcedureTypeByIdService(
    userId,
    paramsResult.data.id,
  );

  if (!procedureType) {
    throw new AppError(404, 'Тип процедуры не найден');
  }

  res.json(procedureType);
};

export const createProcedureTypeController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const bodyResult = createProcedureTypeSchema.safeParse(req.body);

  if (!bodyResult.success) {
    throw new AppError(
      400,
      'Неверный payload типа процедуры',
      z.treeifyError(bodyResult.error),
    );
  }

  const { userId } = requireUser(req);

  const procedureType = await createProcedureTypeService(
    userId,
    bodyResult.data,
  );

  res.status(201).json(procedureType);
};

export const deleteProcedureTypeController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = procedureTypeIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError(
      400,
      'Неверный id типа процедуры',
      z.treeifyError(paramsResult.error),
    );
  }

  const { userId } = requireUser(req);

  const isDeleted = await deleteProcedureTypeService(
    userId,
    paramsResult.data.id,
  );

  if (!isDeleted) {
    throw new AppError(404, 'Тип процедуры не найден');
  }

  res.status(204).send();
};
