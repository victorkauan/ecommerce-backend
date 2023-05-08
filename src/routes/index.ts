import { Router } from 'express';
import { router as customerRouter } from './customer';

const router = Router();

router.use('/customers', customerRouter);

export { router };
