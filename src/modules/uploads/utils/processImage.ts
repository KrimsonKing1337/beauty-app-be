import fs from 'node:fs/promises';
import sharp from 'sharp';

type ProcessImageArgs = {
  inputPath: string;
  outputPath: string;
};

export const processImage = async ({ inputPath, outputPath }: ProcessImageArgs) => {
  await sharp(inputPath)
    .rotate()
    .resize({
      width: 1600,
      height: 1600,
      fit: 'cover',
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toFile(outputPath);

  await fs.unlink(inputPath);
};
