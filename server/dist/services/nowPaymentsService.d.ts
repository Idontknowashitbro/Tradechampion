/**
 * NOWPayments service for handling cryptocurrency payments
 */
declare const nowPaymentsService: {
    /**
     * Get available cryptocurrencies for payment
     */
    getAvailableCurrencies: () => Promise<any>;
    /**
     * Estimate price in cryptocurrency for a fiat amount
     * @param amount - Amount in fiat currency
     * @param fromCurrency - From currency (usually fiat like USD)
     * @param toCurrency - To currency (cryptocurrency)
     */
    estimatePrice: (amount: number, fromCurrency: string, toCurrency: string) => Promise<any>;
    /**
     * Create a payment
     * @param paymentData - Payment data
     */
    createPayment: (paymentData: any) => Promise<any>;
    /**
     * Create an invoice (hosted payment page)
     * @param invoiceData - Invoice data
     */
    createInvoice: (invoiceData: any) => Promise<any>;
    /**
     * Get payment status
     * @param paymentId - Payment ID
     */
    getPaymentStatus: (paymentId: string) => Promise<any>;
    /**
     * Verify webhook signature
     * @param payload - Webhook payload
     * @param signature - X-Nowpayments-Sig header
     */
    verifyWebhookSignature: (payload: any, signature: string) => boolean;
};
export default nowPaymentsService;
