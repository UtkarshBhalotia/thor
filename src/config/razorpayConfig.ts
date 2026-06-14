/**
 * Razorpay Payment Gateway Configuration
 */

export const RAZORPAY_CONFIG_SECURITY = {
    TEST_KEY_ID: 'rzp_test_Sqp5q71RTVvQUT', // Test key for Security Deposit
    // KEY_ID: 'rzp_live_dVzNBAJLOhp088', // Live Key for Security Deposit
    KEY_ID: 'rzp_live_T1VBpEc5nY1ofz', // Live Key for Security Deposit generated on 14th June, 2026

    // Environment
    IS_PRODUCTION: false, // false for Test, true for Production

    // Default values
    CURRENCY: 'INR',
    APP_NAME: 'SOD Partner App',
    PRODUCT_INFO: 'Security Deposit',

    // Minimum and maximum recharge amounts
    MIN_AMOUNT: 1,
    MAX_AMOUNT: 50000,

    // Design
    THEME_COLOR: '#1C1F34',
};

export const RAZORPAY_CONFIG_WALLET = {
    TEST_KEY_ID: 'rzp_test_SnIUrpxQjWHIE2', // Test Key for Wallet Recharge
    KEY_ID: 'rzp_live_SxSoEcOT9OjWoF', // Live Key for wallet Deposit

    // Environment
    IS_PRODUCTION: false, // false for Test, true for Production

    // Default values
    CURRENCY: 'INR',
    APP_NAME: 'SOD Partner App',
    PRODUCT_INFO: 'Wallet Recharge',

    // Minimum and maximum recharge amounts
    MIN_AMOUNT: 1,
    MAX_AMOUNT: 50000,

    // Design
    THEME_COLOR: '#1C1F34',
};

export type RazorpayStatus = 'success' | 'error';

export interface RazorpayResponse {
    status: RazorpayStatus;
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
    error?: {
        code: string;
        description: string;
        source: string;
        step: string;
        reason: string;
        metadata: any;
    };
}
