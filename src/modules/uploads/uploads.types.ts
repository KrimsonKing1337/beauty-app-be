export type UploadedImageInput = {
  imagePath: string;
  label: string;
};

export type ProcessUploadImageArgs = {
  userId: string;
  uploadPath: string;
  procedureId: string;
  images: UploadedImageInput[];
};
