import fs from 'node:fs/promises';
import type { Request, Response } from 'express';
import { z } from 'zod';

import { uploadsOriginalPath, uploadsReadyPath } from '@/constants';
import { AppError } from '@/utils/appError';

import {
  createProcedureSchema,
  procedureIdParamsSchema,
  updateProcedureSchema,
} from './procedures.schemas';

import {
  createProcedureService,
  deleteProcedureService,
  getAllProcedures,
  getProcedure,
  updateProcedureService,
} from './procedures.service';

export const getProceduresController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user!.userId;

  const procedures = await getAllProcedures(userId);

  res.json(procedures);
};

export const getProcedureByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = procedureIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError(400, 'Неверный id процедуры', z.treeifyError(paramsResult.error));
  }

  const userId = req.user!.userId;

  const item = await getProcedure(userId, paramsResult.data.id);

  if (!item) {
    throw new AppError(404, 'Процедура не найдена');
  }

  res.json(item);
};

export const createProcedureController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const bodyResult = createProcedureSchema.safeParse(req.body);

  if (!bodyResult.success) {
    throw new AppError(400, 'Неверный payload процедуры', z.treeifyError(bodyResult.error));
  }

  const userId = req.user!.userId;

  const procedure = await createProcedureService(userId, bodyResult.data);

  res.status(201).json(procedure);
};

export const patchProcedureController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = procedureIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError(400, 'Неверный id процедуры', z.treeifyError(paramsResult.error));
  }

  const bodyResult = updateProcedureSchema.safeParse(req.body);

  if (!bodyResult.success) {
    throw new AppError(400, 'Неверный payload процедуры', z.treeifyError(bodyResult.error));
  }

  const userId = req.user!.userId;

  const item = await updateProcedureService(
    userId,
    paramsResult.data.id,
    bodyResult.data,
  );

  if (!item) {
    throw new AppError(404, 'Процедура не найдена');
  }

  res.json(item);
};

export const deleteProcedureController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = procedureIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError(400, 'Неверный id процедуры', z.treeifyError(paramsResult.error));
  }

  const login = req.user!.login;
  const userId = req.user!.userId;
  const procedureId = paramsResult.data.id;

  const deleted = await deleteProcedureService(userId, procedureId);

  if (!deleted) {
    throw new AppError(404, 'Процедура не найдена');
  }

  await fs.rm(`${uploadsOriginalPath}/${login}___${userId}/${procedureId}`, {
    force: true,
    recursive: true,
  });

  await fs.rm(`${uploadsReadyPath}/${login}___${userId}/${procedureId}`, {
    force: true,
    recursive: true,
  });

  res.status(204).send();
};
