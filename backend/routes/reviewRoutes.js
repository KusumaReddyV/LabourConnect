import express from 'express';
import { body } from 'express-validator';
import {
  createReview,
  getLabourReviews,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.use(protect, authorize('client', 'admin'));

router.get('/labour/:labourId', getLabourReviews);

router.post(
  '/',
  authorize('client'),
  [
    body('labourId').notEmpty(),
    body('rating').isInt({ min: 1, max: 5 }),
  ],
  validate,
  createReview
);

export default router;
