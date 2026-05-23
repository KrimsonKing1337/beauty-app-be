import type { Request, Response } from 'express';
import { z } from 'zod';

import { AppError } from '@/utils/AppError';
import { requireUser } from '@/utils/requireUser';

import {
  uploadImageBodySchema,
  uploadImageParamsSchema,
} from './uploads.schemas';

import { processUploadedProcedureImage } from './uploads.service';
import { getUploadPath } from '@/modules/uploads/utils';

const normalizeLabels = (rawLabels: unknown, fallbackLabel: string): string[] => {
  if (Array.isArray(rawLabels)) {
    return rawLabels.map((label) => String(label));
  }

  if (typeof rawLabels !== 'string') {
    return [];
  }

  try {
    const parsed = JSON.parse(rawLabels);

    if (Array.isArray(parsed)) {
      return parsed.map((label) => String(label));
    }
  } catch {
    return [rawLabels];
  }

  return [fallbackLabel];
};

export const uploadProcedureImageController = async (
  req: Request,
  res: Response,
) => {
  const paramsResult = uploadImageParamsSchema.safeParse(req.params);

  if (!paramsResult.success) {
    throw new AppError(
      400,
      'Некорректные параметры загрузки',
      z.treeifyError(paramsResult.error),
    );
  }

  const bodyResult = uploadImageBodySchema.safeParse(req.body);

  if (!bodyResult.success) {
    throw new AppError(
      400,
      'Некорректный payload загрузки',
      z.treeifyError(bodyResult.error),
    );
  }

  const files = req.files;

  if (!files || !Array.isArray(files) || files.length === 0) {
    throw new AppError(400, 'Файлы не загружены');
  }

  const { userId } = requireUser(req);

  const labels = normalizeLabels(
    bodyResult.data.labels,
    bodyResult.data.label ?? '',
  );

  req.log.info(
    {
      userId,
      procedureId: paramsResult.data.procedureId,
      filesCount: files.length,
    },
    'Uploading procedure images',
  );

  const uploadPath = getUploadPath(req);

  const updated = await processUploadedProcedureImage({
    userId,
    uploadPath,
    procedureId: paramsResult.data.procedureId,
    images: files.map((file, index) => ({
      imagePath: `${file.destination}/${file.filename}`,
      label: labels[index] ?? bodyResult.data.label ?? '',
    })),
  });

  if (!updated) {
    throw new AppError(404, 'Процедура не найдена');
  }

  if ('error' in updated && updated.error === 'MAX_IMAGES_EXCEEDED') {
    throw new AppError(
      400,
      `К процедуре можно прикрепить не больше ${updated.maxImages} фотографий`,
    );
  }

  req.log.info(
    {
      userId,
      procedureId: paramsResult.data.procedureId,
      filesCount: files.length,
    },
    'Procedure images uploaded',
  );

  return res.json(updated);
};
