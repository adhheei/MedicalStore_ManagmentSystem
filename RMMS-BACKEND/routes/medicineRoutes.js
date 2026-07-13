import express from 'express';
import {
  getMedicines,
  addMedicine,
  updateMedicine,
  deleteMedicine,
} from '../controllers/medicineController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes below
router.use(protect);

router
  .route('/')
  .get(authorize('admin', 'pharmacist'), getMedicines)
  .post(authorize('admin', 'pharmacist'), addMedicine);

router
  .route('/:id')
  .put(authorize('admin', 'pharmacist'), updateMedicine)
  .delete(authorize('admin'), deleteMedicine);

export default router;