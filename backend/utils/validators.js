import { body } from 'express-validator';

/** Strict email: user@domain.tld (supports gmail.com etc.) */
export const strictEmail = (field = 'email') =>
  body(field)
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage('Enter a valid email like name@gmail.com')
    .normalizeEmail();

export const strongPassword = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters')
  .matches(/[A-Za-z]/)
  .withMessage('Password must contain at least one letter')
  .matches(/[0-9]/)
  .withMessage('Password must contain at least one number');

export const phoneNumber = body('phoneNumber')
  .matches(/^[6-9][0-9]{9}$/)
  .withMessage('Enter a valid 10-digit Indian mobile number');
