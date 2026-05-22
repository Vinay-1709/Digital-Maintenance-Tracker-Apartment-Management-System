"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const roleGuard_1 = require("../middleware/roleGuard");
const requestController_1 = require("../controllers/requestController");
const upload_1 = require("../middleware/upload");
const router = express_1.default.Router();
router.use(auth_1.requireAuth);
router.get('/categories', requestController_1.getCategories);
router.post('/', (0, roleGuard_1.checkRole)(['resident']), upload_1.upload.single('media'), [
    (0, express_validator_1.body)('category').isIn(['Plumbing', 'Electrical', 'Painting', 'Carpentry', 'Cleaning', 'Appliance Repair', 'Other']).withMessage('Invalid category'),
    (0, express_validator_1.body)('description').notEmpty().withMessage('Description is required'),
    (0, express_validator_1.body)('address').notEmpty().withMessage('Address is required')
], requestController_1.createRequest);
router.get('/', requestController_1.getRequests);
router.get('/:id', requestController_1.getRequestById);
router.patch('/:id/assign', (0, roleGuard_1.checkRole)(['admin']), [(0, express_validator_1.body)('technicianId').isNumeric().withMessage('Technician ID is required')], requestController_1.assignTechnician);
router.patch('/:id/status', (0, roleGuard_1.checkRole)(['technician', 'admin']), [(0, express_validator_1.body)('status').isIn(['New', 'Assigned', 'In-Progress', 'Resolved']).withMessage('Invalid status')], requestController_1.updateStatus);
router.post('/:id/feedback', (0, roleGuard_1.checkRole)(['resident']), [(0, express_validator_1.body)('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be 1-5')], requestController_1.addFeedback);
exports.default = router;
