"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const roleGuard_1 = require("../middleware/roleGuard");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
router.use(auth_1.requireAuth);
router.get('/', (0, roleGuard_1.checkRole)(['admin']), userController_1.getAllUsers);
router.get('/:id', userController_1.getUserById); // Users can view their own profile or admin can view any (needs refinement logic in real app)
router.get('/role/:role', (0, roleGuard_1.checkRole)(['admin', 'resident']), userController_1.getUsersByRole); // Residents might need to see technicians? Or only admin.
exports.default = router;
