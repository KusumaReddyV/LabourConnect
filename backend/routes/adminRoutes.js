import express from 'express';
import {
  getAllUsers,
  deleteUser,
  blockUser,
  getAnalytics,
} from '../controllers/adminController.js';
import { getAllTickets, updateTicketStatus } from '../controllers/helpdeskController.js';
import { getAdminJobs } from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/block', blockUser);
router.get('/analytics', getAnalytics);
router.get('/helpdesk', getAllTickets);
router.patch('/helpdesk/:id', updateTicketStatus);
router.get('/jobs', getAdminJobs);

export default router;
