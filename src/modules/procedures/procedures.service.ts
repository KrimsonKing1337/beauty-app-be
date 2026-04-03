import type { CreateProcedureDto, UpdateProcedureDto } from './procedures.types';
import { ProceduresRepository } from './procedures.repository';

export class ProceduresService {
  constructor(private readonly proceduresRepository: ProceduresRepository) {}

  async getAll(userId: string) {
    return this.proceduresRepository.findAllByUserId(userId);
  }

  async getById(userId: string, id: string) {
    return this.proceduresRepository.findById(userId, id);
  }

  async create(userId: string, payload: CreateProcedureDto) {
    return this.proceduresRepository.create(userId, payload);
  }

  async update(userId: string, id: string, payload: UpdateProcedureDto) {
    return this.proceduresRepository.update(userId, id, payload);
  }

  async delete(userId: string, id: string) {
    return this.proceduresRepository.delete(userId, id);
  }
}
