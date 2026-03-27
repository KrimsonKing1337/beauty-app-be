import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.send('hello world');
});

router.get('/test', (_req, res) => {
  res.send('hello world');
});

export { router };
