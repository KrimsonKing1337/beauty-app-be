export type ProcedureImage = {
  id: string;
  path: string;
  label: string;
};

export type Procedure = {
  id: string;
  procedureName: string;
  dateTime: string;
  placeId: string | null;
  durationHours: number | null;
  durationMinutes: number | null;
  price: number | null;
  images: ProcedureImage[];
  notes: string | null;
  typeId: string | null;
  tagIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type ProcedureEntity = {
  id: string;
  procedure_name: string;
  date_time: string;
  place_id: string | null;
  duration_hours: number | null;
  duration_minutes: number | null;
  price: number | null;
  images: ProcedureImage[] | string | null;
  notes: string | null;
  type_id: string | null;
  tag_ids: string[] | null;
  created_at: string;
  updated_at: string;
};

export type CreateProcedureDto = {
  procedureName: string;
  dateTime: string;
  placeId: string | null;
  durationHours: number | null;
  durationMinutes: number | null;
  price: number | null;
  images: ProcedureImage[];
  notes: string | null;
  typeId: string | null;
  tagIds: string[];
};

export type UpdateProcedureDto = Partial<CreateProcedureDto>;

export type ProcedureSortBy =
  | 'dateTime'
  | 'createdAt'
  | 'updatedAt'
  | 'procedureName'
  | 'price'
  | 'duration';

export type SortOrder = 'asc' | 'desc';

export type GetProceduresQuery = {
  page: number;
  limit: number;
  sortBy: ProcedureSortBy;
  sortOrder: SortOrder;
  search: string;
  typeId: string | null;
  tagIds: string[];
  dateFrom?: string;
  dateTo?: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: Pagination;
};

export type AddProcedureImagesArgs = {
  userId: string;
  procedureId: string;
  images: ProcedureImage[];
};

export type AddProcedureImagesResult = Procedure
  | null
  | {
  error: 'MAX_IMAGES_EXCEEDED';
  maxImages: number;
};
