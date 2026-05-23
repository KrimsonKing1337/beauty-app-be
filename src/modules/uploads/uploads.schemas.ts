import { z } from 'zod';

export const uploadImageParamsSchema = z.object({
  procedureId: z.uuid(),
});

export const uploadImageBodySchema = z.object({
  label: z.string().trim().max(120).optional(),
  labels: z.union([z.string(), z.array(z.string())]).optional(),
});

export type UploadImageParamsInput = z.infer<typeof uploadImageParamsSchema>;
export type UploadImageBodyInput = z.infer<typeof uploadImageBodySchema>;
