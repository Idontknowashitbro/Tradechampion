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
const cryptoPaymentController = __importStar(require("../controllers/cryptoPaymentController"));
const cryptoWalletController = __importStar(require("../controllers/cryptoWalletController"));
const router = express_1.default.Router();
// Crypto payment routes
router.get('/currencies', auth_1.authenticate, cryptoPaymentController.getAvailableCurrencies);
router.get('/estimate', auth_1.authenticate, cryptoPaymentController.getEstimatedPrice);
router.post('/payment', auth_1.authenticate, cryptoPaymentController.createPayment);
router.get('/payment/:id', auth_1.authenticate, cryptoPaymentController.getPaymentStatus);
router.get('/payments', auth_1.authenticate, cryptoPaymentController.getPaymentHistory);
router.post('/webhook', cryptoPaymentController.handleWebhook); // No auth required for webhooks
// Crypto wallet routes
router.get('/wallets', auth_1.authenticate, cryptoWalletController.getUserWallets);
router.post('/wallets', auth_1.authenticate, cryptoWalletController.addWallet);
router.put('/wallets/:id', auth_1.authenticate, cryptoWalletController.updateWallet);
router.delete('/wallets/:id', auth_1.authenticate, cryptoWalletController.deleteWallet);
router.put('/wallets/:id/default', auth_1.authenticate, cryptoWalletController.setDefaultWallet);
exports.default = router;
//# sourceMappingURL=cryptoRoutes.js.map