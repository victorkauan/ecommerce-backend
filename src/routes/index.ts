import { Router } from 'express';
import { router as customerRouter } from './customer';
import { router as productRouter } from './product';
import { router as productCategoryRouter } from './productCategory';
import { router as saleRouter } from './sale';

const router = Router();

router.use('/customers', customerRouter);
router.use('/products', productRouter);
router.use('/product-categories', productCategoryRouter);
router.use('/sales', saleRouter);

export { router };
