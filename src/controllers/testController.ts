import type { Request, Response } from 'express';

import { getAllTestItems } from '../repositories/testRepository';

export const getRoot = async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await getAllTestItems();

    res.json({
      message: 'hello world',
      data: items,
    });
  } catch (error) {
    console.error('Error in getRoot:', error);

    res.status(500).json({
      message: 'Database error',
    });
  }
};

export const getTest = async (_req: Request, res: Response): Promise<void> => {
  try {
    const items = await getAllTestItems();

    res.json({
      message: 'hello world',
      data: items,
    });
  } catch (error) {
    console.error('Error in getTest:', error);

    res.status(500).json({
      message: 'Database error',
    });
  }
};
