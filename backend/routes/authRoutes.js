import express from 'express';
import { body } from 'express-validator';
import {
  registerLabour,
  registerClient,
  login,
  logout,
  getMe,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { uploadFields } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import { LABOUR_CATEGORIES } from '../models/Labour.js';
import { strictEmail, strongPassword, phoneNumber } from '../utils/validators.js';

const router = express.Router();

router.post(
  '/register/labour',
  uploadFields,
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    strictEmail('email'),
    strongPassword,
    phoneNumber,
    body('category').isIn(LABOUR_CATEGORIES).withMessage('Invalid category'),
    body('location').trim().notEmpty().withMessage('Location is required'),
  ],
  validate,
  registerLabour
);

router.post(
  '/register/client',
  [
    body('fullName').trim().notEmpty().withMessage('Full name is required'),
    strictEmail('email'),
    strongPassword,
    phoneNumber,
  ],
  validate,
  registerClient
);

router.post(
  '/login',
  [
    body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Enter a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    body('role').optional().trim(),
  ],
  validate,
  login
);

router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;
