import type { Request, Response } from 'express';
import { z } from 'zod';

import { uploadImageParamsSchema } from './uploads.schemas';
import { processUploadedProcedureImage } from './uploads.service';

import { AppError } from '@/utils/AppError';
import { requireUser } from '@/utils/requireUser';

export const uploadProcedureImageController = async (
  req: Request,
  res: Response,
) => {
  const paramsResult = uploadImageParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError(400, 'Некорректные параметры загрузки', z.treeifyError(paramsResult.error));
  }

  const files = req.files;

  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new AppError(400, 'Файлы не загружены');
  }

  const image = files[0];

   const { userId } = requireUser(req);

  const updated = await processUploadedProcedureImage({
    userId,
    procedureId: paramsResult.data.procedureId,
    type: paramsResult.data.type,
    imagePath: `${image.destination}/${image.filename}`,
  });

  if (!updated) {
    throw new AppError(404, 'Процедура не найдена');
  }

  return res.json(updated);
};
