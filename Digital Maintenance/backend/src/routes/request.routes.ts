import express from 'express';
import { body } from 'express-validator';
import { requireAuth } from '../middleware/auth';
import { checkRole } from '../middleware/roleGuard';
import { createRequest, getRequests, getRequestById, assignTechnician, updateStatus, addFeedback, getCategories } from '../controllers/requestController';
import { upload } from '../middleware/upload';

import { MAINTENANCE_CATEGORIES, REQUEST_STATUSES } from '../config/constants';

const router = express.Router();

router.use(requireAuth);

router.get('/categories', getCategories);

router.post(
    '/',
    checkRole(['resident']),
    upload.single('media'),
    [
        body('category').isIn([...MAINTENANCE_CATEGORIES]).withMessage('Invalid category'),
        body('description').notEmpty().withMessage('Description is required'),
        body('address').notEmpty().withMessage('Address is required')
    ],
    createRequest
);

router.get('/', getRequests);
router.get('/:id', getRequestById);

router.patch(
    '/:id/assign',
    checkRole(['admin']),
    [body('technicianId').isNumeric().withMessage('Technician ID is required')],
    assignTechnician
);

router.patch(
    '/:id/status',
    checkRole(['technician', 'admin']),
    [body('status').isIn([...REQUEST_STATUSES]).withMessage('Invalid status')],
    updateStatus
);

router.post(
    '/:id/feedback',
    checkRole(['resident']),
    [body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5')],
    addFeedback
);

export default router;
