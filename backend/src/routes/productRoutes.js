import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProductStock,
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id').get(getProductById);
router.route('/:id/stock').put(protect, admin, updateProductStock);

export default router;