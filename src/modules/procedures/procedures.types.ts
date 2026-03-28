export type Procedure = {
  id: string;
  procedureName: string;
  date: string;
  place: string | null;
  duration: string | null;
  price: number | null;
  beforeAfter: string[];
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProcedureEntity = {
  id: string;
  procedure_name: string;
  date: string;
  place: string | null;
  duration: string | null;
  price: number | null;
  before_after: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateProcedureDto = {
  procedureName: string;
  date: string;
  place: string | null;
  duration: string | null;
  price: number | null;
  beforeAfter: string[];
  notes: string | null;
};

export type UpdateProcedureDto = Partial<CreateProcedureDto>;
