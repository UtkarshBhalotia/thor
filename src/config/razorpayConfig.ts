/**
 * Razorpay Payment Gateway Configuration
 */

export const RAZORPAY_CONFIG = {
    // Razorpay API Key ID (Get this from Razorpay Dashboard)
    // Replace with your actual Key ID
    KEY_ID: 'rzp_test_YOUR_KEY_ID',

    // Environment
    IS_PRODUCTION: false,

    // Default values
    CURRENCY: 'INR',
    APP_NAME: 'Dooda',
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
