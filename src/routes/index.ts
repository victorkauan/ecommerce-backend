import { Router } from 'express';
import { router as customerRouter } from './customer';
import { router as productRouter } from './product';
import { router as productCategoryRouter } from './productCategory';

const router = Router();

router.use('/customers', customerRouter);
router.use('/products', productRouter);
router.use('/product-categories', productCategoryRouter);

export { router };
