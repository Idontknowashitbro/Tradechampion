"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const crypto_1 = __importDefault(require("crypto"));
const nowPayments_1 = __importDefault(require("../config/nowPayments"));
// Configure axios instance for NOWPayments API
const apiClient = axios_1.default.create({
    baseURL: nowPayments_1.default.apiUrl,
    headers: {
        'x-api-key': nowPayments_1.default.apiKey,
        'Content-Type': 'application/json',
    },
});
/**
 * NOWPayments service for handling cryptocurrency payments
 */
const nowPaymentsService = {
    /**
     * Get available cryptocurrencies for payment
     */
    getAvailableCurrencies: async () => {
        try {
            const response = await apiClient.get('/currencies');
            return response.data.currencies.map((currency) => ({
                currency,
                name: getCryptoCurrencyName(currency),
                image: `https://nowpayments.io/images/coins/${currency}.png`
            }));
        }
        catch (error) {
            console.error('Error fetching available currencies:', error);
            throw error;
        }
    },
    /**
     * Estimate price in cryptocurrency for a fiat amount
     * @param amount - Amount in fiat currency
     * @param fromCurrency - From currency (usually fiat like USD)
     * @param toCurrency - To currency (cryptocurrency)
     */
    estimatePrice: async (amount, fromCurrency, toCurrency) => {
        try {
            const response = await apiClient.get('/estimate', {
                params: {
                    amount,
                    currency_from: fromCurrency,
                    currency_to: toCurrency
                }
            });
            return response.data;
        }
        catch (error) {
            console.error('Error estimating price:', error);
            throw error;
        }
    },
    /**
     * Create a payment
     * @param paymentData - Payment data
     */
    createPayment: async (paymentData) => {
        try {
            const response = await apiClient.post('/payment', paymentData);
            return response.data;
        }
        catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    },
    /**
     * Create an invoice (hosted payment page)
     * @param invoiceData - Invoice data
     */
    createInvoice: async (invoiceData) => {
        try {
            const response = await apiClient.post('/invoice', invoiceData);
            return response.data;
        }
        catch (error) {
            console.error('Error creating invoice:', error);
            throw error;
        }
    },
    /**
     * Get payment status
     * @param paymentId - Payment ID
     */
    getPaymentStatus: async (paymentId) => {
        try {
            const response = await apiClient.get(`/payment/${paymentId}`);
            return response.data;
        }
        catch (error) {
            console.error(`Error fetching payment status for ID ${paymentId}:`, error);
            throw error;
        }
    },
    /**
     * Verify webhook signature
     * @param payload - Webhook payload
     * @param signature - X-Nowpayments-Sig header
     */
    verifyWebhookSignature: (payload, signature) => {
        try {
            // Create a HMAC using SHA-512 and the IPN secret key
            const hmac = crypto_1.default.createHmac('sha512', nowPayments_1.default.ipnSecretKey);
            // Add the payload to the HMAC
            hmac.update(JSON.stringify(payload));
            // Get the digest as a hex string
            const digest = hmac.digest('hex');
            // Compare the calculated signature with the provided one
            return digest === signature;
        }
        catch (error) {
            console.error('Error verifying webhook signature:', error);
            return false;
        }
    }
};
/**
 * Get cryptocurrency name from symbol
 * @param currency - Currency symbol
 */
function getCryptoCurrencyName(currency) {
    const currencyMap = {
        btc: 'Bitcoin',
        eth: 'Ethereum',
        usdt: 'Tether',
        usdc: 'USD Coin',
        xrp: 'Ripple',
        ltc: 'Litecoin',
        bnb: 'Binance Coin',
        sol: 'Solana',
        ada: 'Cardano',
        doge: 'Dogecoin',
        dot: 'Polkadot',
        matic: 'Polygon',
        shib: 'Shiba Inu',
        trx: 'TRON',
        // Add more currencies as needed
    };
    return currencyMap[currency.toLowerCase()] || currency.toUpperCase();
}
exports.default = nowPaymentsService;
//# sourceMappingURL=nowPaymentsService.js.map