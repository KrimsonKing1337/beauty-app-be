import sharp from 'sharp';

type ProcessImageArgs = {
  inputPath: string;
  outputPath: string;
};

export const processImage = async ({
  inputPath,
  outputPath,
}: ProcessImageArgs) => {
  await sharp(inputPath)
    .rotate()
    .resize({
      width: 1920,
      height: 1920,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toFile(outputPath);
};
