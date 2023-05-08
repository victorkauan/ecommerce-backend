import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

const router = Router();
const productController = new ProductController();

router.get('/', productController.index);
router.post('/', productController.create);
router.patch('/:id', productController.update);
router.delete('/:id', productController.destroy);

export { router };
