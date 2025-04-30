"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const adminController = __importStar(require("../controllers/adminController"));
const cryptoPaymentAdminController = __importStar(require("../controllers/cryptoPaymentAdminController"));
const router = express_1.default.Router();
// Require admin authentication for all routes
router.use(auth_1.authenticate, auth_1.isAdmin);
// Admin dashboard routes
router.get('/dashboard', adminController.getDashboardStats);
// User management routes
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
// Challenge management routes
router.get('/challenges', adminController.getChallenges);
router.get('/challenges/:id', adminController.getChallenge);
router.post('/challenges', adminController.createChallenge);
router.put('/challenges/:id', adminController.updateChallenge);
router.delete('/challenges/:id', adminController.deleteChallenge);
// Crypto payment management routes
router.get('/crypto/payments', cryptoPaymentAdminController.getAllPayments);
router.get('/crypto/payments/:id', cryptoPaymentAdminController.getPaymentById);
router.post('/crypto/payments/:id/refresh', cryptoPaymentAdminController.refreshPaymentStatus);
router.post('/crypto/payments/:id/refund', cryptoPaymentAdminController.refundPayment);
exports.default = router;
//# sourceMappingURL=admin.js.map