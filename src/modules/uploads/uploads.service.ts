import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';

import { addProcedureImages } from '@/modules/procedures/procedures.repository';
import { pinoLogger } from '@/utils/pinoLogger';

import { createDirIfDoesNotExist, processImage } from './utils';

import type { ProcessUploadImageArgs } from './uploads.types';

export const processUploadedProcedureImage = async ({
  userId,
  procedureId,
  images,
}: ProcessUploadImageArgs) => {
  const processedImages = [];

  for (const imageCur of images) {
    const outputPath = imageCur.imagePath.replace('original', 'ready');

    const imageReadyDir = imageCur.imagePath
      .split('/')
      .slice(0, -1)
      .join('/')
      .replace('original', 'ready');

    pinoLogger.info(
      {
        userId,
        procedureId,
        imagePath: imageCur.imagePath,
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
