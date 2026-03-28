import type { Request, Response } from 'express';

import { getAllProcedures } from '../repositories/procedures';

export const getProcedures = async (_req: Request, res: Response) => {
  try {
    const procedures = await getAllProcedures();

    res.json(procedures);
  } catch (e) {
    console.error(e);

    res.status(500).json({
      message: 'Failed to fetch procedures',
    });
  }
};
