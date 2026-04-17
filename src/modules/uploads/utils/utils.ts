import fs from 'node:fs/promises';
import path from 'path';
import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { nanoid } from 'nanoid';

import { uploadsOriginalPath } from '@/constants';
import { AppError } from '@/utils/appError';

export const createDirIfDoesNotExist = async (targetPath: string) => {
  await fs.mkdir(targetPath, { recursive: true });
};

export const getUploadPath = (req: Request) => {
  const { login, userId } = req.user!;
  const { procedureId, type } = req.params;

  return `${uploadsOriginalPath}/${login}___${userId}/${procedureId}/${type}`;
};

export const getUploadMiddleware = () => {
  const storage = multer.diskStorage({
    destination: async (req, _file, cb) => {
      try {
        const uploadPath = getUploadPath(req);

        await createDirIfDoesNotExist(uploadPath);

        cb(null, uploadPath);
      } catch (error) {
        cb(error as Error, '');
      }
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uuid = nanoid();

      cb(null, `${uuid}${ext}`);
    },
  });

  const upload = multer({
    storage,
    fileFilter: (_req, file, callback) => {
      const ext = path.extname(file.originalname).toLowerCase();

      if (!['.png', '.jpg', '.jpeg', '.gif'].includes(ext)) {
        return callback(new Error('Only image files allowed'));
      }

      callback(null, true);
    },
  });

  return (req: Request, res: Response, next: NextFunction) => {
    const middleware = upload.array('files');

    middleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        next(new AppError(400, err.message));

        return;
      }

      if (err) {
        next(new AppError(400, (err as Error).message));

        return;
      }

      next();
    });
  };
};
