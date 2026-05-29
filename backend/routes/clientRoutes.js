import express from 'express';
import { body } from 'express-validator';
import {
  getMyProfile,
  updateProfile,
  hireLabour,
  getMyJobs,
  markJobOngoing,
  toggleFavourite,
  getFavourites,
  confirmJobComplete,
  getPendingVerifications,
} from '../controllers/clientController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect, authorize('client'));

router.get('/profile/me', getMyProfile);
router.put('/profile/me', updateProfile);
router.get('/favourites', getFavourites);
router.post('/favourites/:labourId', toggleFavourite);
router.post(
  '/hire',
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
  hireLabour
);
router.get('/jobs', getMyJobs);
router.put('/jobs/:id/ongoing', markJobOngoing);
router.put(
  '/jobs/:id/confirm-complete',
  [
    body('rating').isInt({ min: 1, max: 5 }),
    body('review').optional().isString(),
    body('paymentStatus').optional().isIn(['pending', 'verified', 'paid']),
  ],
  validate,
  confirmJobComplete
);
router.get('/jobs/pending-verification', getPendingVerifications);

export default router;
