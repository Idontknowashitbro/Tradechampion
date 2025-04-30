"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationController_1 = __importDefault(require("../controllers/notificationController"));
const auth_1 = require("../middleware/auth");
const notificationController_2 = require("../controllers/notificationController");
const router = (0, express_1.Router)();
// Get all notifications for the authenticated user
router.get('/', auth_1.authenticate, notificationController_1.default.getUserNotifications);
// Get count of unread notifications
router.get('/unread/count', auth_1.authenticate, notificationController_1.default.getUnreadCount);
// Mark specific notifications as read
router.put('/read', auth_1.authenticate, notificationController_2.markAsRead);
// Mark all notifications as read
router.put('/read/all', auth_1.authenticate, notificationController_1.default.markAllAsRead);
// Delete a notification
router.delete('/:id', auth_1.authenticate, notificationController_2.deleteNotification);
// Admin route to create a notification for a user
router.post('/admin/create', auth_1.authenticate, notificationController_1.default.createNotification);
exports.default = router;
//# sourceMappingURL=notificationRoutes.js.map