import fs from 'node:fs/promises';

import type { Request, Response } from 'express';
import { z } from 'zod';

import { uploadsOriginalPath, uploadsReadyPath } from '@/constants';

import { AppError } from '@/utils/AppError';
import { requireUser } from '@/utils/requireUser';

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
  const { userId } = requireUser(req);

  const procedures = await getAllProcedures(userId);

  res.json(procedures);
};

export const getProcedureByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = procedureIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError(
      400,
      'Неверный id процедуры',
      z.treeifyError(paramsResult.error),
    );
  }

  const { userId } = requireUser(req);

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
    throw new AppError(
      400,
      'Неверный payload процедуры',
      z.treeifyError(bodyResult.error),
    );
  }

  const { userId } = requireUser(req);

  req.log.info(
    {
      userId,
      procedureName: bodyResult.data.procedureName,
      typeId: bodyResult.data.typeId,
      tagIdsCount: bodyResult.data.tagIds?.length ?? 0,
      dateTime: bodyResult.data.dateTime,
    },
    'Creating procedure',
  );

  const procedure = await createProcedureService(userId, bodyResult.data);

  req.log.info(
    {
      userId,
      procedureId: procedure?.id,
    },
    'Procedure created',
  );

  res.status(201).json(procedure);
};

export const patchProcedureController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = procedureIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError(
      400,
      'Неверный id процедуры',
      z.treeifyError(paramsResult.error),
    );
  }

  const bodyResult = updateProcedureSchema.safeParse(req.body);

  if (!bodyResult.success) {
    throw new AppError(
      400,
      'Неверный payload процедуры',
      z.treeifyError(bodyResult.error),
    );
  }

  const { userId } = requireUser(req);
  const procedureId = paramsResult.data.id;

  req.log.info(
    {
      userId,
      procedureId,
      updatedFields: Object.keys(bodyResult.data),
      tagIdsCount: bodyResult.data.tagIds?.length ?? 0,
    },
    'Updating procedure',
  );

  const item = await updateProcedureService(userId, procedureId, bodyResult.data);

  if (!item) {
    throw new AppError(404, 'Процедура не найдена');
  }

  req.log.info(
    {
      userId,
      procedureId,
    },
    'Procedure updated',
  );

  res.json(item);
};

export const deleteProcedureController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const paramsResult = procedureIdParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError(
      400,
      'Неверный id процедуры',
      z.treeifyError(paramsResult.error),
    );
  }

  const { userId, login } = requireUser(req);

  const procedureId = paramsResult.data.id;

  req.log.info(
    {
      userId,
      procedureId,
    },
    'Deleting procedure',
  );

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

  req.log.info(
    {
      userId,
      procedureId,
    },
    'Procedure deleted',
  );

  res.status(204).send();
};
