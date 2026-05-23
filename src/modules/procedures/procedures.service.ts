import fs from 'node:fs/promises';
import path from 'node:path';

import { uploadsReadyPath } from '@/constants';
import { pinoLogger } from '@/utils/pinoLogger';

import type {
  CreateProcedureDto,
  GetProceduresQuery,
  ProcedureImage,
  UpdateProcedureDto,
} from './procedures.types';

import {
  createProcedure,
  deleteProcedure,
  getAllProceduresByUserId,
  getProcedureById,
  updateProcedure,
} from './procedures.repository';

const getSafeReadyImagePath = (imagePath: string) => {
  const readyRoot = path.resolve(uploadsReadyPath);
  const targetPath = path.resolve(imagePath);

  if (!targetPath.startsWith(`${readyRoot}${path.sep}`)) {
    return null;
  }

  return targetPath;
};

const deleteRemovedImages = async ({
  userId,
  procedureId,
  previousImages,
  nextImages,
}: {
  userId: string;
  procedureId: string;
  previousImages: ProcedureImage[];
  nextImages: ProcedureImage[];
}) => {
  const nextImagePaths = new Set(nextImages.map((image) => image.path));

  const removedImages = previousImages.filter(
    (image) => !nextImagePaths.has(image.path),
  );

  await Promise.all(
    removedImages.map(async (image) => {
      const safeImagePath = getSafeReadyImagePath(image.path);

      if (!safeImagePath) {
        pinoLogger.warn(
          {
            userId,
            procedureId,
            imagePath: image.path,
          },
          'Skipping unsafe procedure image deletion path',
        );

        return;
      }

      await fs.rm(safeImagePath, { force: true });

      pinoLogger.info(
        {
          userId,
          procedureId,
          imageId: image.id,
          imagePath: image.path,
        },
        'Procedure image physically deleted',
      );
    }),
  );
};

export const getAllProcedures = async (
  userId: string,
  query: GetProceduresQuery,
) => {
  return getAllProceduresByUserId(userId, query);
};

export const getProcedure = async (userId: string, id: string) => {
  return getProcedureById(userId, id);
};

export const createProcedureService = async (
  userId: string,
  payload: CreateProcedureDto,
) => {
  return createProcedure(userId, payload);
};

export const updateProcedureService = async (
  userId: string,
  id: string,
  payload: UpdateProcedureDto,
) => {
  const previousProcedure = payload.images
    ? await getProcedureById(userId, id)
    : null;

  const updatedProcedure = await updateProcedure(userId, id, payload);

  if (!updatedProcedure) {
    return null;
  }

  if (previousProcedure && payload.images) {
    await deleteRemovedImages({
      userId,
      procedureId: id,
      previousImages: previousProcedure.images,
      nextImages: updatedProcedure.images,
    });
  }

  return updatedProcedure;
};

export const deleteProcedureService = async (userId: string, id: string) => {
  return deleteProcedure(userId, id);
};
