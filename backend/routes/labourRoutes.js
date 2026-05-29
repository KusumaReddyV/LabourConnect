import express from 'express';
import {
  getMyProfile,
  updateProfile,
  getJobRequests,
  acceptJob,
  rejectJob,
  startJob,
  finishWork,
  getCompletedJobs,
  getLabourById,
  searchLabourers,
  getLabourEarnings,
  getMyEarnings,
} from '../controllers/labourController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// All labour listing & profiles require authentication (clients + admin)
router.use(protect);

router.get('/search', authorize('client', 'admin'), searchLabourers);
router.get('/public/:id', authorize('client', 'admin'), getLabourById);

router.get('/earnings/:labourId', authorize('labour', 'admin'), getLabourEarnings);

router.use(authorize('labour'));
router.get('/earnings/me', getMyEarnings);
router.get('/profile/me', getMyProfile);
router.put('/profile/me', uploadSingle('profileImage'), updateProfile);
router.get('/jobs/requests', getJobRequests);
router.get('/jobs/completed', getCompletedJobs);
router.put('/jobs/:id/accept', acceptJob);
router.put('/jobs/:id/reject', rejectJob);
router.put('/jobs/:id/start', startJob);
router.put('/jobs/:id/finish', finishWork);

export default router;
