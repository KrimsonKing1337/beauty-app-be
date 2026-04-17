import express from 'express';
import fs from 'node:fs/promises';

import { authMiddleware } from '@/middlewares/authMiddleware';

import { ProceduresRepository } from '@/modules/procedures/procedures.repository';

import { createDirIfDoesNotExist, getUploadMiddleware, processImage } from './utils';

export const uploadsRouter = express.Router();

const proceduresRepository = new ProceduresRepository();

uploadsRouter.use(authMiddleware);

uploadsRouter.post('/:procedureId/:type', getUploadMiddleware(), async (req, res) => {
  const files = req.files;

  const procedureId = req.params.procedureId as string;
  const type = req.params.type as string;

  if (type !== 'before' && type !== 'after') {
    return res.status(400).json({ message: 'Некорректный тип изображения' });
  }

  if (!files || !Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ message: 'Файлы не загружены' });
  }

  const image = files[0];

  const imagePath = `${image.destination}/${image.filename}`;

  const outputPath = imagePath.replace('original', 'ready');
  const imageReadyDir = `${image.destination}`.replace('original', 'ready');

  await fs.rm(imageReadyDir, { force: true, recursive: true });
  await createDirIfDoesNotExist(imageReadyDir);

  await processImage({
    inputPath: imagePath,
    outputPath,
  });

  await fs.rm(image.destination, { force: true, recursive: true });

  const updated = await proceduresRepository.updateImage({
    userId: req.user!.userId,
    procedureId,
    type,
    imagePath: outputPath,
  });

  return res.json(updated);
});
