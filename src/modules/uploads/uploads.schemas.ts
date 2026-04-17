import { z } from 'zod';

export const uploadImageParamsSchema = z.object({
  procedureId: z.uuid(),
  type: z.enum(['before', 'after']),
});

export type UploadImageParamsInput = z.infer<typeof uploadImageParamsSchema>;
