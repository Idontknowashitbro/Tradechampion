"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// Public routes
// Protected routes
router.get('/profile', auth_1.authenticate, userController_1.getUserProfile);
// Admin routes
router.get('/', auth_1.authenticate, auth_1.authorizeAdmin, userController_1.getUsers);
router.get('/:id', auth_1.authenticate, userController_1.getUserById);
router.put('/:id', auth_1.authenticate, auth_1.authorizeAdmin, userController_1.updateUser);
router.patch('/:id/status', auth_1.authenticate, auth_1.authorizeAdmin, userController_1.updateUserStatus);
router.patch('/:id/wallet', auth_1.authenticate, auth_1.authorizeAdmin, userController_1.updateUserWallet);
exports.default = router;
//# sourceMappingURL=users.js.map