import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController';

const router = Router();
const customerController = new CustomerController();

router.get('/', customerController.index);
router.post('/', customerController.create);
router.patch('/:id', customerController.update);
router.delete('/:id', customerController.destroy);

export { router };
