import express from 'express'
import { body } from 'express-validator'
import {
  createProduct,
  createProductReview,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/productController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router
  .route('/')
  .get(getProducts)
  .post(
    protect,
    admin,
    body('name').notEmpty().trim(),
    body('description').trim(),
    body('countInStock').isInt({ min: 0 }),
    body('category').notEmpty().trim(),
    createProduct,
  )
router
  .route('/:id/reviews')
  .post(
    protect,
    body('comment').trim(),
    body('rating').isInt({ min: 0, max: 5 }),
    createProductReview,
  )
router
  .route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(
    protect,
    body('name').notEmpty().trim(),
    body('countInStock').isInt({ min: 0 }),
    body('description').trim(),
    body('category').notEmpty().trim(),
    admin,
    updateProduct,
  )

export default router
