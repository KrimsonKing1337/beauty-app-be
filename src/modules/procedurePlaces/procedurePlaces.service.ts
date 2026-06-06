import {
  createProcedurePlace,
  deleteProcedurePlace,
  getAllProcedurePlacesByUserId,
  getProcedurePlaceById,
} from './procedurePlaces.repository';

import type { CreateProcedurePlaceInput } from './procedurePlaces.types';

export const getAllProcedurePlacesService = async (userId: string) => {
  return getAllProcedurePlacesByUserId(userId);
};

export const getProcedurePlaceByIdService = async (
  userId: string,
  id: string,
) => {
  return getProcedurePlaceById(userId, id);
};

export const createProcedurePlaceService = async (
  userId: string,
  input: CreateProcedurePlaceInput,
) => {
  return createProcedurePlace(userId, input);
};

export const deleteProcedurePlaceService = async (
  userId: string,
  id: string,
) => {
  return deleteProcedurePlace(userId, id);
};
