import { Router } from 'express';
import { ProductCategoryController } from '../controllers/ProductCategoryController';

const router = Router();
const productCategoryController = new ProductCategoryController();

router.get('/', productCategoryController.index);
router.post('/', productCategoryController.create);
router.put('/:id', productCategoryController.update);
router.delete('/:id', productCategoryController.destroy);

export { router };
