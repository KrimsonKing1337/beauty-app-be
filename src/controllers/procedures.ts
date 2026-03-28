import type { Request, Response } from 'express';

import { getAllProcedures } from '../repositories/procedures';
import { mapProcedureToDto } from '../mappers/procedure';

export const getProcedures = async (_req: Request, res: Response) => {
  try {
    const procedures = await getAllProcedures();
    const proceduresCamelCase = procedures.map(mapProcedureToDto);

    res.json(proceduresCamelCase);
  } catch (e) {
    console.error(e);

    res.status(500).json({
      message: 'Failed to fetch procedures',
    });
  }
};
