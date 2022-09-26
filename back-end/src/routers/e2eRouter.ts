import { Router } from 'express';
import { preset, reset } from '../controllers/e2eController.js';

const e2eRouter = Router();

e2eRouter.post('/e2e/reset', reset);
e2eRouter.post('/e2e/preset', preset);

export default e2eRouter;