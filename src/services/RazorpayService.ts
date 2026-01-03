import RazorpayCheckout from 'react-native-razorpay';
import { RAZORPAY_CONFIG, RazorpayResponse } from '../config/razorpayConfig';

/**
 * Razorpay Payment Gateway Service
 */
export const RazorpayService = {
    /**
     * Open Razorpay Checkout
     */
    openCheckout: (options: {
        amount: number; // in paise
        email: string;
        contact: string;
        name: string;
        description: string;
        order_id?: string; // Optional if using basic integration
    }): Promise<RazorpayResponse> => {
        return new Promise((resolve) => {
            const checkoutOptions = {
                description: options.description,
                image: 'https://i.imgur.com/3g7nmJC.png', // Replace with your logo URL
                currency: RAZORPAY_CONFIG.CURRENCY,
                key: RAZORPAY_CONFIG.KEY_ID,
                amount: options.amount,
                name: RAZORPAY_CONFIG.APP_NAME,
                order_id: options.order_id, // If you have order_id from backend
                prefill: {
                    email: options.email,
                    contact: options.contact,
                    name: options.name
                },
                theme: {
                    color: RAZORPAY_CONFIG.THEME_COLOR
                }
            };

            RazorpayCheckout.open(checkoutOptions)
                .then((data: any) => {
                    // Success
                    resolve({
                        status: 'success',
                        razorpay_payment_id: data.razorpay_payment_id,
                        razorpay_order_id: data.razorpay_order_id,
                        razorpay_signature: data.razorpay_signature
                    });
                })
                .catch((error: any) => {
                    // Error
                    console.error('Razorpay Error:', error);
                    resolve({
                        status: 'error',
                        error: error
                    });
                });
        });
    },

    /**
     * Validate recharge amount
     */
    validateAmount: (amount: string): { valid: boolean; error?: string } => {
        const numAmount = parseFloat(amount);

        if (!amount || amount.trim() === '') {
            return { valid: false, error: 'Please enter an amount' };
        }

        if (isNaN(numAmount)) {
            return { valid: false, error: 'Please enter a valid amount' };
        }

        if (numAmount < RAZORPAY_CONFIG.MIN_AMOUNT) {
            return { valid: false, error: `Minimum recharge amount is ₹${RAZORPAY_CONFIG.MIN_AMOUNT}` };
        }

        if (numAmount > RAZORPAY_CONFIG.MAX_AMOUNT) {
            return { valid: false, error: `Maximum recharge amount is ₹${RAZORPAY_CONFIG.MAX_AMOUNT}` };
        }

        return { valid: true };
    }
};
