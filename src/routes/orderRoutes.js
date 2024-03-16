import express from 'express'
import { body } from 'express-validator'
import {
  deleteOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  placeOrder,
  updateOrder,
} from '../controllers/orderController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router
  .route('/')
  .post(protect, body('orderItems').isArray({ min: 1 }), placeOrder)
  .get(protect, admin, getOrders)
router.route('/myorders').get(protect, getMyOrders)
router
  .route('/:id')
  .get(protect, admin, getOrderById)
  .put(protect, body('orderItems').isArray({ min: 1 }), admin, updateOrder)
  .delete(protect, admin, deleteOrder)

export default router
