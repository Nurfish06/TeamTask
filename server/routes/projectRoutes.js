import express from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { protect, manager } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getProjects)
  .post(protect, manager, createProject);

router.route('/:id')
  .put(protect, manager, updateProject)
  .delete(protect, manager, deleteProject);

export default router;
