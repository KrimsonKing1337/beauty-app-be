import fs from 'node:fs/promises';
import type { Request, Response } from 'express';

import { updateProcedureSchema } from './procedures.schemas';
import { ProceduresService } from './procedures.service';
import { uploadsOriginalPath, uploadsReadyPath } from '@/constants';

type ProcedureIdParams = {
  id: string;
};

export class ProceduresController {
  constructor(private readonly proceduresService: ProceduresService) {}

  getAll = async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const procedures = await this.proceduresService.getAll(userId);

    return res.json(procedures);
  };

  getById = async (
    req: Request<ProcedureIdParams>,
    res: Response,
  ): Promise<void> => {
    const userId = req.user!.userId;

    const item = await this.proceduresService.getById(userId, req.params.id as string);

    if (!item) {
      res.status(404).json({ message: 'Процедура не найдена' });
      return;
    }

    res.json(item);
  };

  create = async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const procedure = await this.proceduresService.create(userId, req.body);

    return res.status(201).json(procedure);
  };

  update = async (
    req: Request<ProcedureIdParams>,
    res: Response,
  ): Promise<void> => {
    const userId = req.user!.userId;

    const payload = updateProcedureSchema.parse(req.body);

    const item = await this.proceduresService.update(
      userId,
      req.params.id as string,
      payload,
    );

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
    const login = req.user!.login;
    const userId = req.user!.userId;
    const procedureId = req.params.id as string;

    const deleted = await this.proceduresService.delete(userId, procedureId);

    if (!deleted) {
      res.status(404).json({ message: 'Процедура не найдена' });

      return;
    }

    await fs.rm(`${uploadsOriginalPath}/${login}___${userId}/${procedureId}`, { force: true, recursive: true });
    await fs.rm(`${uploadsReadyPath}/${login}___${userId}/${procedureId}`, { force: true, recursive: true });

    res.status(204).send();
  };
}
