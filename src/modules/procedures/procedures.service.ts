import type { CreateProcedureDto, UpdateProcedureDto } from './procedures.types';
import { ProceduresRepository } from './procedures.repository';

export class ProceduresService {
  constructor(private readonly proceduresRepository: ProceduresRepository) {}

  async getAll() {
    return this.proceduresRepository.findAll();
  }

  async getById(id: string) {
    return this.proceduresRepository.findById(id);
  }

  async create(payload: CreateProcedureDto) {
    return this.proceduresRepository.create(payload);
  }

  async update(id: string, payload: UpdateProcedureDto) {
    return this.proceduresRepository.update(id, payload);
  }

  async delete(id: string) {
    return this.proceduresRepository.delete(id);
  }
}
