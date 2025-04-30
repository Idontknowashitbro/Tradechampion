"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const notificationController_1 = require("../controllers/notificationController");
const router = express_1.default.Router();
// User routes
router.get('/', auth_1.authenticate, notificationController_1.getNotifications);
router.patch('/:id/read', auth_1.authenticate, notificationController_1.markAsRead);
// Admin routes
router.post('/', auth_1.authenticate, notificationController_1.createNotification);
router.post('/broadcast', auth_1.authenticate, auth_1.authorizeAdmin, notificationController_1.broadcastNotification);
exports.default = router;
//# sourceMappingURL=notifications.js.map