import express from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/authController';

const router = express.Router();

router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters'),
        body('name').notEmpty().withMessage('Name is required'),
        body('role').isIn(['resident', 'technician', 'admin']).withMessage('Invalid role')
    ],
    register
);

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().notEmpty().withMessage('Password is required')
    ],
    login
);

export default router;
