export type Procedure = {
  id: string;
  procedureName: string;
  dateTime: string;
  place: string | null;
  durationHours: number | null;
  durationMinutes: number | null;
  price: number | null;
  beforeImagePaths: string[];
  afterImagePaths: string[];
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
  place: string | null;
  duration_hours: number | null;
  duration_minutes: number | null;
  price: number | null;
  before_image_paths: string[];
  after_image_paths: string[];
  notes: string | null;
  type_id: string | null;
  tag_ids: string[] | null;
  created_at: string;
  updated_at: string;
};

export type CreateProcedureDto = {
  procedureName: string;
  dateTime: string;
  place: string | null;
  durationHours: number | null;
  durationMinutes: number | null;
  price: number | null;
  notes: string | null;
  typeId: string | null;
  tagIds: string[];
};

export type UpdateProcedureDto = Partial<CreateProcedureDto>;

export type ImageType = 'before' | 'after';

export type UpdateImageArgs = {
  userId: string;
  procedureId: string;
  type: ImageType;
  imagePath: string;
};
