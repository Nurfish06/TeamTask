import express from 'express';
import {
  loginUser,
  registerUser,
  logoutUser,
  getTeamMembers
} from '../controllers/authController.js';
import { protect, manager } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', protect, manager, registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/members', protect, getTeamMembers);

export default router;
