import express from 'express';
import {
  getOvertimeLogs,
  createOvertimeLog,
  updateOvertimeLog,
  deleteOvertimeLog,
  getOvertimeSummary
} from '../controllers/overtimeController.js';
import { protect, manager } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/summary')
  .get(protect, getOvertimeSummary);

router.route('/')
  .get(protect, getOvertimeLogs)
  .post(protect, manager, createOvertimeLog);

router.route('/:id')
  .put(protect, manager, updateOvertimeLog)
  .delete(protect, manager, deleteOvertimeLog);

export default router;
