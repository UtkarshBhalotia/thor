/**
 * PayUMoney Payment Gateway Service
 * Handles payment initialization, hash generation, and payment response processing
 */

import { PAYUMONEY_CONFIG, PayUMoneyParams, PaymentResponse, PaymentStatus } from '../config/payumoneyConfig';
import CryptoJS from 'crypto-js';

/**
 * Generate unique transaction ID
 */
export const generateTransactionId = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    return `TXN${timestamp}${random}`;
};

/**
 * Generate SHA512 hash for PayUMoney
 * Format: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
 * 
 * NOTE: In production, this MUST be done on the server for security
 * This is a mock implementation for frontend testing only
 */
export const generatePaymentHash = (params: {
    key: string;
    txnid: string;
    amount: string;
    productinfo: string;
    firstname: string;
    email: string;
    udf1?: string;
    udf2?: string;
    udf3?: string;
    udf4?: string;
    udf5?: string;
}): string => {
    const {
        key,
        txnid,
        amount,
        productinfo,
        firstname,
        email,
        udf1 = '',
        udf2 = '',
        udf3 = '',
        udf4 = '',
        udf5 = '',
    } = params;

    const salt = PAYUMONEY_CONFIG.MERCHANT_SALT;

    // Build hash string
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${salt}`;

    // Generate SHA512 hash
    const hash = CryptoJS.SHA512(hashString).toString(CryptoJS.enc.Hex);

    return hash;
};

/**
 * Create payment parameters for PayUMoney
 */
export const createPaymentParams = (
    amount: number,
    userEmail: string,
    userName: string,
    userPhone: string,
    userId: string
): PayUMoneyParams => {
    const txnid = generateTransactionId();
    const amountStr = amount.toFixed(2);

    const params: PayUMoneyParams = {
        key: PAYUMONEY_CONFIG.MERCHANT_KEY,
        txnid: txnid,
        amount: amountStr,
        productinfo: PAYUMONEY_CONFIG.PRODUCT_INFO,
        firstname: userName,
        email: userEmail,
        phone: userPhone,
        surl: PAYUMONEY_CONFIG.SUCCESS_URL,
        furl: PAYUMONEY_CONFIG.FAILURE_URL,
        hash: '', // Will be generated next
        udf1: userId, // Store user ID for reference
    };

    // Generate hash
    params.hash = generatePaymentHash(params);

    return params;
};

/**
 * Validate recharge amount
 */
export const validateRechargeAmount = (amount: string): { valid: boolean; error?: string } => {
    const numAmount = parseFloat(amount);

    if (!amount || amount.trim() === '') {
        return { valid: false, error: 'Please enter an amount' };
    }

    if (isNaN(numAmount)) {
        return { valid: false, error: 'Please enter a valid amount' };
    }

    if (numAmount < PAYUMONEY_CONFIG.MIN_AMOUNT) {
        return { valid: false, error: `Minimum recharge amount is ₹${PAYUMONEY_CONFIG.MIN_AMOUNT}` };
    }

    if (numAmount > PAYUMONEY_CONFIG.MAX_AMOUNT) {
        return { valid: false, error: `Maximum recharge amount is ₹${PAYUMONEY_CONFIG.MAX_AMOUNT}` };
    }

    return { valid: true };
};

/**
 * Process payment response from PayUMoney
 * This is a mock implementation - in production, always verify with backend
 */
export const processPaymentResponse = (response: any): PaymentResponse => {
    // Mock implementation - in production, verify hash and validate with backend
    const status: PaymentStatus = response.status || 'failure';

    return {
        status,
        txnid: response.txnid || '',
        amount: response.amount || '',
        productinfo: response.productinfo || '',
        firstname: response.firstname || '',
        email: response.email || '',
        phone: response.phone || '',
        mihpayid: response.mihpayid,
        error_Message: response.error_Message,
        bankcode: response.bankcode,
        cardnum: response.cardnum,
    };
};

/**
 * Mock payment success response for testing
 * In production, this would come from actual PayUMoney gateway
 */
export const mockSuccessResponse = (txnid: string, amount: string): PaymentResponse => {
    return {
        status: 'success',
        txnid,
        amount,
        productinfo: PAYUMONEY_CONFIG.PRODUCT_INFO,
        firstname: 'Test User',
        email: 'test@example.com',
        phone: '9999999999',
        mihpayid: `MOJO${Date.now()}`,
    };
};

/**
 * Mock payment failure response for testing
 */
export const mockFailureResponse = (txnid: string, amount: string): PaymentResponse => {
    return {
        status: 'failure',
        txnid,
        amount,
        productinfo: PAYUMONEY_CONFIG.PRODUCT_INFO,
        firstname: 'Test User',
        email: 'test@example.com',
        phone: '9999999999',
        error_Message: 'Payment failed due to insufficient funds',
    };
};
