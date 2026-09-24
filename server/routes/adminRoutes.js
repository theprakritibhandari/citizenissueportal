import express from 'express';
import {
  getDashboardStats,
  getAllIssuesAdmin,
  updateIssueStatus,
  deleteIssueAdmin,
  getAllUsers,
  updateAdminProfile,
  updateAdminPassword,
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/role.js';

const router = express.Router();

// All routes here require login and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/issues', getAllIssuesAdmin);
router.put('/issues/:id/status', updateIssueStatus);
router.delete('/issues/:id', deleteIssueAdmin);
router.get('/users', getAllUsers);
router.put('/profile', updateAdminProfile);
router.put('/password', updateAdminPassword);

export default router;
