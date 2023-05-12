import { Router } from 'express';
import { SaleController } from '../controllers/SaleController';

const router = Router();
const saleController = new SaleController();

router.get('/', saleController.index);
router.post('/', saleController.create);
router.put('/:id', saleController.update);
router.delete('/:id', saleController.destroy);

export { router };
