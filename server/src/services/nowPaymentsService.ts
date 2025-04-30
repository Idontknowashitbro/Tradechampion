import axios from 'axios';
import crypto from 'crypto';
import nowPaymentsConfig from '../config/nowPayments';

// Configure axios instance for NOWPayments API
const apiClient = axios.create({
  baseURL: nowPaymentsConfig.apiUrl,
  headers: {
    'x-api-key': nowPaymentsConfig.apiKey,
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
      return response.data.currencies.map((currency: string) => ({
        currency,
        name: getCryptoCurrencyName(currency),
        image: `https://nowpayments.io/images/coins/${currency}.png`
      }));
    } catch (error) {
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
  estimatePrice: async (amount: number, fromCurrency: string, toCurrency: string) => {
    try {
      const response = await apiClient.get('/estimate', {
        params: {
          amount,
          currency_from: fromCurrency,
          currency_to: toCurrency
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error estimating price:', error);
      throw error;
    }
  },

  /**
   * Create a payment
   * @param paymentData - Payment data
   */
  createPayment: async (paymentData: any) => {
    try {
      const response = await apiClient.post('/payment', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  /**
   * Create an invoice (hosted payment page)
   * @param invoiceData - Invoice data
   */
  createInvoice: async (invoiceData: any) => {
    try {
      const response = await apiClient.post('/invoice', invoiceData);
      return response.data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  },

  /**
   * Get payment status
   * @param paymentId - Payment ID
   */
  getPaymentStatus: async (paymentId: string) => {
    try {
      const response = await apiClient.get(`/payment/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching payment status for ID ${paymentId}:`, error);
      throw error;
    }
  },

  /**
   * Verify webhook signature
   * @param payload - Webhook payload
   * @param signature - X-Nowpayments-Sig header
   */
  verifyWebhookSignature: (payload: any, signature: string): boolean => {
    try {
      // Create a HMAC using SHA-512 and the IPN secret key
      const hmac = crypto.createHmac('sha512', nowPaymentsConfig.ipnSecretKey);
      
      // Add the payload to the HMAC
      hmac.update(JSON.stringify(payload));
      
      // Get the digest as a hex string
      const digest = hmac.digest('hex');
      
      // Compare the calculated signature with the provided one
      return digest === signature;
    } catch (error) {
      console.error('Error verifying webhook signature:', error);
      return false;
    }
  }
};

/**
 * Get cryptocurrency name from symbol
 * @param currency - Currency symbol
 */
function getCryptoCurrencyName(currency: string): string {
  const currencyMap: Record<string, string> = {
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

export default nowPaymentsService; 