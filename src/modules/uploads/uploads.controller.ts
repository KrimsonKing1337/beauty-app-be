import type { Request, Response } from 'express';
import { z } from 'zod';

import { uploadImageParamsSchema } from './uploads.schemas';
import { processUploadedProcedureImage } from './uploads.service';

export const uploadProcedureImageController = async (
  req: Request,
  res: Response,
) => {
  const paramsResult = uploadImageParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    return res.status(400).json({
      message: 'Некорректные параметры загрузки',
      errors: z.treeifyError(paramsResult.error),
    });
  }

  const files = req.files;

  if (!files || !Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ message: 'Файлы не загружены' });
  }

  const image = files[0];

  const updated = await processUploadedProcedureImage({
    userId: req.user!.userId,
    procedureId: paramsResult.data.procedureId,
    type: paramsResult.data.type,
    imagePath: `${image.destination}/${image.filename}`,
  });

  if (!updated) {
    return res.status(404).json({
      message: 'Процедура не найдена',
    });
  }

  return res.json(updated);
};
