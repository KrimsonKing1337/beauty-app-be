import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { addProcedureImages } from '@/modules/procedures/procedures.repository';
import { pinoLogger } from '@/utils/pinoLogger';

import { createDirIfDoesNotExist, processImage } from './utils';

import type { ProcessUploadImageArgs } from './uploads.types';
import { uploadsOriginalPath } from '@/constants';

const getReadyImagePath = (originalImagePath: string) => {
  const parsedPath = path.parse(originalImagePath.replace('original', 'ready'));

  return path.join(parsedPath.dir, `${parsedPath.name}.webp`);
};

export const processUploadedProcedureImage = async ({
  userId,
  uploadPath,
  procedureId,
  images,
}: ProcessUploadImageArgs) => {
  const processedImages = [];

  for (const imageCur of images) {
    const outputPath = getReadyImagePath(imageCur.imagePath);
    const imageReadyDir = path.dirname(outputPath);

    pinoLogger.info(
      {
        userId,
        procedureId,
        imagePath: imageCur.imagePath,
        outputPath,
      },
      'Processing uploaded image',
    );

    await createDirIfDoesNotExist(imageReadyDir);

    await processImage({
      inputPath: imageCur.imagePath,
      outputPath,
    });

    await fs.rm(imageCur.imagePath, { force: true });

    processedImages.push({
      id: randomUUID(),
      path: outputPath,
      label: imageCur.label,
    });
  }

  if (images.length > 0) {
    await fs.rm(path.resolve(uploadPath), { force: true, recursive: true });
  }

  const updatedProcedure = await addProcedureImages({
    userId,
    procedureId,
    images: processedImages,
  });

  pinoLogger.info(
    {
      userId,
      procedureId,
      imagesCount: processedImages.length,
      isProcedureUpdated: Boolean(updatedProcedure),
    },
    'Uploaded images processed',
  );

  return updatedProcedure;
};
