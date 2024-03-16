import express from 'express'
import { body } from 'express-validator'
import {
  authUser,
  deleteUser,
  getUserById,
  getUserProfile,
  getUsers,
  registerUser,
  updateUser,
  updateUserProfile,
} from '../controllers/userController.js'
import { admin, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router
  .route('/')
  .post(
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    body('name').trim(),
    registerUser,
  )
  .get(protect, admin, getUsers)
router.post('/login', authUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(
    protect,
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    updateUserProfile,
  )
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(
    protect,
    admin,
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    updateUser,
  )

export default router
