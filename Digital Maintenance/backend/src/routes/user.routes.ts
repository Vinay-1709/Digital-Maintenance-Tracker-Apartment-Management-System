import express from 'express';
import { requireAuth } from '../middleware/auth';
import { checkRole } from '../middleware/roleGuard';
import { getAllUsers, getUserById, getUsersByRole } from '../controllers/userController';

const router = express.Router();

router.use(requireAuth);

router.get('/', checkRole(['admin']), getAllUsers);
router.get('/:id', getUserById); // Users can view their own profile or admin can view any (needs refinement logic in real app)
router.get('/role/:role', checkRole(['admin', 'resident']), getUsersByRole); // Residents might need to see technicians? Or only admin.

export default router;
