"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// NOWPayments configuration
const nowPaymentsConfig = {
    apiUrl: process.env.NOWPAYMENTS_API_URL || 'https://api.nowpayments.io/v1',
    apiKey: process.env.NOWPAYMENTS_API_KEY || '',
    ipnSecretKey: process.env.NOWPAYMENTS_IPN_SECRET_KEY || '',
    ipnCallbackUrl: `${process.env.BASE_URL || 'http://localhost:5002'}/api/crypto/webhook`,
    successUrl: `${process.env.BASE_URL || 'http://localhost:5002'}/payment/success`,
    cancelUrl: `${process.env.BASE_URL || 'http://localhost:5002'}/payment/cancel`,
};
// Validate configuration
if (!nowPaymentsConfig.apiKey) {
    console.warn('WARNING: NOWPAYMENTS_API_KEY is not set. Crypto payments will not work correctly.');
}
if (!nowPaymentsConfig.ipnSecretKey) {
    console.warn('WARNING: NOWPAYMENTS_IPN_SECRET_KEY is not set. Webhook verification will not work.');
}
exports.default = nowPaymentsConfig;
//# sourceMappingURL=nowPayments.js.map