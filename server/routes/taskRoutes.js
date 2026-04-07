import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { protect, manager } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, manager, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, manager, deleteTask);

export default router;
