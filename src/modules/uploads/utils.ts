import fs from 'node:fs/promises';
import path from 'path';
import type { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { nanoid } from 'nanoid';

import { uploadsOriginalPath } from '@/constants';

export const checkIfExist = async (path: string) => {
  try {
    await fs.stat(path);

    return true;
  } catch (err) {
    return false;
  }
};

export const createDirIfDoesNotExist = async (path: string) => {
  try {
    await fs.stat(path);
  } catch (err) {
    await fs.mkdir(path);
  }
};

export const getUploadMiddleware = () => {
  const storage = multer.diskStorage({
    destination: async (req, _file, cb) => {
      const { login, userId } = req.user!;

      const uploadsPath = `${uploadsOriginalPath}/${login}___${userId}`;

      await createDirIfDoesNotExist(uploadsPath);

      cb(null, uploadsPath);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uuid = nanoid();

      const newName = `${uuid}${ext}`;

      cb(null, newName);
    },
  });

  const upload = multer({
    storage,
    fileFilter: (_req, file, callback) => {
      const ext = path.extname(file.originalname);

      if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return callback(new Error('Only image files allowed'));
      }

      callback(null, true);
    },
  });

  return (req: Request, res: Response, next: NextFunction)=> {
    const upl = upload.array('files');

    upl(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        res.status(500).send(err.message);

        next(err);
      } else if (err) {
        res.status(500).send(err.message);

        next(err);
      }

      next();
    });
  }
};
