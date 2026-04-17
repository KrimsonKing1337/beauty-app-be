import type {
  CreateProcedureDto,
  UpdateProcedureDto,
} from './procedures.types';

import {
  createProcedure,
  deleteProcedure,
  getAllProceduresByUserId,
  getProcedureById,
  updateProcedure,
} from './procedures.repository';

export const getAllProcedures = async (userId: string) => {
  return getAllProceduresByUserId(userId);
};

export const getProcedure = async (userId: string, id: string) => {
  return getProcedureById(userId, id);
};

export const createProcedureService = async (
  userId: string,
  payload: CreateProcedureDto,
) => {
  return createProcedure(userId, payload);
};

export const updateProcedureService = async (
  userId: string,
  id: string,
  payload: UpdateProcedureDto,
) => {
  return updateProcedure(userId, id, payload);
};

export const deleteProcedureService = async (userId: string, id: string) => {
  return deleteProcedure(userId, id);
};
