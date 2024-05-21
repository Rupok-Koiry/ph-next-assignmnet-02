import express from 'express';
import * as orderController from '../controllers/orderController';

const router = express.Router();

router
  .route('/')
  .get(orderController.getAllOrders)
  .post(orderController.validateAndCreateOrder, orderController.createOrder);

router
  .route('/:id')
  .get(orderController.getOrder)
  .put(orderController.updateOrder)
  .delete(orderController.deleteOrder);

export default router;
