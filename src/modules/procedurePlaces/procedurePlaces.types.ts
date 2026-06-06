export type ProcedurePlace = {
  id: string;
  userId: string | null;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type ProcedurePlaceRow = {
  id: string;
  user_id: string | null;
  name: string;
  created_at: string;
  updated_at: string;
};

export type CreateProcedurePlaceInput = {
  name: string;
};
