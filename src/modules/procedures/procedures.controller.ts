import fs from 'node:fs/promises';
import type { Request, Response } from 'express';
import { z } from 'zod';

import { uploadsOriginalPath, uploadsReadyPath } from '@/constants';

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
    res.status(400).json({
      message: 'Invalid procedure id',
      errors: z.treeifyError(paramsResult.error),
    });

    return;
  }

  const userId = req.user!.userId;

  const item = await getProcedure(userId, paramsResult.data.id);

  if (!item) {
    res.status(404).json({ message: 'Процедура не найдена' });
    return;
  }

  res.json(item);
};

export const createProcedureController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const bodyResult = createProcedureSchema.safeParse(req.body);

  if (!bodyResult.success) {
    res.status(400).json({
      message: 'Invalid procedure payload',
      errors: z.treeifyError(bodyResult.error),
    });

    return;
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
    res.status(400).json({
      message: 'Invalid procedure id',
      errors: z.treeifyError(paramsResult.error),
    });

    return;
  }

  const bodyResult = updateProcedureSchema.safeParse(req.body);

  if (!bodyResult.success) {
    res.status(400).json({
      message: 'Invalid procedure payload',
      errors: z.treeifyError(bodyResult.error),
    });

    return;
  }

  const userId = req.user!.userId;

  const item = await updateProcedureService(
    userId,
    paramsResult.data.id,
    bodyResult.data,
  );

  if (!item) {
    res.status(404).json({ message: 'Процедура не найдена' });
    return;
  }

  res.json(item);
};

export const deleteProcedureController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = procedureIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    res.status(400).json({
      message: 'Invalid procedure id',
      errors: z.treeifyError(paramsResult.error),
    });

    return;
  }

  const login = req.user!.login;
  const userId = req.user!.userId;
  const procedureId = paramsResult.data.id;

  const deleted = await deleteProcedureService(userId, procedureId);

  if (!deleted) {
    res.status(404).json({ message: 'Процедура не найдена' });
    return;
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
