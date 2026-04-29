import {
  createTag,
  deleteTag,
  getAllTagsByUserId,
  getTagById,
} from './tags.repository';

import type { CreateTagInput } from './tags.types';

export const getAllTagsService = async (userId: string) => {
  return getAllTagsByUserId(userId);
};

export const getTagByIdService = async (
  userId: string,
  id: string,
) => {
  return getTagById(userId, id);
};

export const createTagService = async (
  userId: string,
  input: CreateTagInput,
) => {
  return createTag(userId, input);
};

export const deleteTagService = async (
  userId: string,
  id: string,
) => {
  return deleteTag(userId, id);
};
