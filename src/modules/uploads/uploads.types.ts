export type UploadedImageInput = {
  imagePath: string;
  label: string;
};

export type ProcessUploadImageArgs = {
  userId: string;
  procedureId: string;
  images: UploadedImageInput[];
};
