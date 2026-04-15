import express from 'express';
import { authMiddleware } from '@/middlewares/authMiddleware';

import { getUploadMiddleware } from './utils';
import { ProceduresRepository } from '@/modules/procedures/procedures.repository';

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

  const updated = await proceduresRepository.addImage({
    userId: req.user!.userId,
    procedureId,
    type,
    imagePath,
  });

  return res.json(updated);
});
