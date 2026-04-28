import {
  createProcedureType,
  deleteProcedureType,
  getAllProcedureTypesByUserId,
  getProcedureTypeById,
} from './procedureTypes.repository';

import type { CreateProcedureTypeInput } from './procedureTypes.types';

export const getAllProcedureTypesService = async (userId: string) => {
  return getAllProcedureTypesByUserId(userId);
};

export const getProcedureTypeByIdService = async (
  userId: string,
  id: string,
) => {
  return getProcedureTypeById(userId, id);
};

export const createProcedureTypeService = async (
  userId: string,
  input: CreateProcedureTypeInput,
) => {
  return createProcedureType(userId, input);
};

export const deleteProcedureTypeService = async (
  userId: string,
  id: string,
) => {
  return deleteProcedureType(userId, id);
};
