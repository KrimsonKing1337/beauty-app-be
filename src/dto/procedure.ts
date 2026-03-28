export type ProcedureDto = {
  id: string;
  procedureName: string;
  date: string;
  place: string | null;
  duration: string | null;
  price: number | null;
  beforeAfter: string[];
  notes: string | null;
  createdAt: string;
};
