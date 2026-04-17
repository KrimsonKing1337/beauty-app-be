import type { ImageType } from '@/modules/procedures/procedures.types';

export type UploadImageParams = {
  procedureId: string;
  type: ImageType;
};

export type ProcessUploadImageArgs = {
  userId: string;
  procedureId: string;
  type: ImageType;
  imagePath: string;
};
