import fs from 'node:fs/promises';

import { updateProcedureImage } from '@/modules/procedures/procedures.repository';
import { pinoLogger } from '@/utils/pinoLogger';

import { createDirIfDoesNotExist, processImage } from './utils';

import type { ProcessUploadImageArgs } from './uploads.types';

export const processUploadedProcedureImage = async ({
  userId,
  procedureId,
  type,
  imagePath,
}: ProcessUploadImageArgs) => {
  const outputPath = imagePath.replace('original', 'ready');

  const imageReadyDir = imagePath
    .split('/')
    .slice(0, -1)
    .join('/')
    .replace('original', 'ready');

  const imageOriginalDir = imagePath
    .split('/')
    .slice(0, -1)
    .join('/');

  pinoLogger.info(
    {
      userId,
      procedureId,
      imageType: type,
    },
    'Processing uploaded image',
  );

  await fs.rm(imageReadyDir, { force: true, recursive: true });
  await createDirIfDoesNotExist(imageReadyDir);

  await processImage({
    inputPath: imagePath,
    outputPath,
  });

  await fs.rm(imageOriginalDir, { force: true, recursive: true });

  const updatedProcedure = await updateProcedureImage({
    userId,
    procedureId,
    type,
    imagePath: outputPath,
  });

  pinoLogger.info(
    {
      userId,
      procedureId,
      imageType: type,
      isProcedureUpdated: Boolean(updatedProcedure),
    },
    'Uploaded image processed',
  );

  return updatedProcedure;
};
