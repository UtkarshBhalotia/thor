/**
 * PayUMoney Payment Gateway Configuration
 * Test Mode Configuration
 */

export const PAYUMONEY_CONFIG = {
    // Merchant Credentials (Test Mode)
    // Valid Test UPI IDs: success@payu (for success), failure@payu (for failure)
    MERCHANT_KEY: 'I89qgr',
    MERCHANT_SALT: 'BiauCp5XvBooGy3c8dZqbyE1n3eX4n3p',

    // Environment
    IS_PRODUCTION: false,

    // PayU URLs
    BASE_URL: 'https://test.payu.in', // Test environment
    // PRODUCTION_URL: 'https://secure.payu.in', // Production environment

    // Payment Options
    PAYMENT_OPTIONS: {
        // Enable all payment methods
        netBanking: true,
        creditCard: true,
        debitCard: true,
        upi: true,
        wallets: true,
    },

    // Default values
    PRODUCT_INFO: 'Wallet Recharge',
    SUCCESS_URL: 'payumoney://payu/success',
    FAILURE_URL: 'payumoney://payu/failure',
    CANCEL_URL: 'payumoney://payu/cancel',

    // Minimum and maximum recharge amounts
    MIN_AMOUNT: 1,
    MAX_AMOUNT: 50000,
};

export type PaymentStatus = 'pending' | 'success' | 'failure' | 'cancelled';

export interface PayUMoneyParams {
    key: string;
    txnid: string;
    amount: string;
    productinfo: string;
    firstname: string;
    email: string;
    phone: string;
    surl: string;
    furl: string;
    hash: string;
    udf1?: string;
    udf2?: string;
    udf3?: string;
    udf4?: string;
    udf5?: string;
}

export interface PaymentResponse {
    status: PaymentStatus;
    txnid: string;
    amount: string;
    productinfo: string;
    firstname: string;
    email: string;
    phone: string;
    mihpayid?: string;
    error_Message?: string;
    bankcode?: string;
    cardnum?: string;
}
