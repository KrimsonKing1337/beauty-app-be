import type { Request, Response } from 'express';

import { createProcedureSchema, updateProcedureSchema } from './procedures.schemas';
import type { Procedure } from './procedures.types';
import { ProceduresService } from './procedures.service';

type ProcedureIdParams = {
  id: string;
};

export class ProceduresController {
  constructor(private readonly proceduresService: ProceduresService) {}

  getAll = async (_req: Request, res: Response): Promise<void> => {
    const items: Procedure[] = await this.proceduresService.getAll();
    res.json(items);
  };

  getById = async (
    req: Request<ProcedureIdParams>,
    res: Response,
  ): Promise<void> => {
    const item = await this.proceduresService.getById(req.params.id);

    if (!item) {
      res.status(404).json({ message: 'Процедура не найдена' });
      return;
    }

    res.json(item);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const payload = createProcedureSchema.parse(req.body);
    const item = await this.proceduresService.create(payload);

    res.status(201).json(item);
  };

  update = async (
    req: Request<ProcedureIdParams>,
    res: Response,
  ): Promise<void> => {
    const payload = updateProcedureSchema.parse(req.body);
    const item = await this.proceduresService.update(req.params.id, payload);

    if (!item) {
      res.status(404).json({ message: 'Процедура не найдена' });
      return;
    }

    res.json(item);
  };

  delete = async (
    req: Request<ProcedureIdParams>,
    res: Response,
  ): Promise<void> => {
    const deleted = await this.proceduresService.delete(req.params.id);

    if (!deleted) {
      res.status(404).json({ message: 'Процедура не найдена' });
      return;
    }

    res.status(204).send();
  };
}
