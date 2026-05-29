import express from 'express';
import { body } from 'express-validator';
import {
  createJob,
  getClientJobs,
  acceptJob,
  startJob,
  completeJob,
  completeJobById,
  sendMessage,
  getMessages,
  getOngoingJobs,
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect);

router.get('/ongoing', getOngoingJobs);

router.put('/complete/:jobId', authorize('labour'), completeJobById);

router.post(
  '/',
  authorize('client'),
  [
    body('labourId').notEmpty(),
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('location').trim().notEmpty(),
    body('wageOffered').isNumeric(),
    body('date').notEmpty(),
    body('timing').trim().notEmpty(),
  ],
  validate,
  createJob
);

router.get('/', authorize('client'), getClientJobs);

router.patch('/:id/accept', authorize('labour'), acceptJob);
router.patch('/:id/start', authorize('labour'), startJob);
router.patch('/:id/complete', authorize('labour'), completeJob);

router.post(
  '/:id/message',
  authorize('client', 'labour'),
  [body('message').trim().notEmpty()],
  validate,
  sendMessage
);

router.get('/:id/messages', authorize('client', 'labour', 'admin'), getMessages);

export default router;
