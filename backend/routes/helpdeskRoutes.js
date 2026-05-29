import express from 'express';
import { body } from 'express-validator';
import { createTicket } from '../controllers/helpdeskController.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('message').trim().notEmpty(),
  ],
  validate,
  createTicket
);

export default router;
