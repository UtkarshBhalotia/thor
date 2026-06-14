import RazorpayCheckout from 'react-native-razorpay';
import {
    RAZORPAY_CONFIG_SECURITY,
    RAZORPAY_CONFIG_WALLET,
    RazorpayResponse,
} from '../config/razorpayConfig';
import { Image } from 'react-native';
import { ENV } from './env';

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
        key?: string; // Optional custom key for different environments
        order_id?: string; // Optional if using basic integration
        paymentType?: 'security' | 'wallet'; // Optional, defaults to 'wallet'
    }): Promise<RazorpayResponse> => {
        return new Promise((resolve) => {
            const logoUri = Image.resolveAssetSource(
                require('../assets/img/launcher.png'),
            ).uri;
            const paymentType = options.paymentType || 'wallet';
            const config =
                paymentType === 'security'
                    ? RAZORPAY_CONFIG_SECURITY
                    : RAZORPAY_CONFIG_WALLET;
            const defaultKey =
                ENV === 'dev' ? config.TEST_KEY_ID : config.KEY_ID;

            const checkoutOptions: any = {
                description: options.description,
                image: logoUri,
                currency: config.CURRENCY,
                key: defaultKey,
                amount: options.amount,
                name: config.APP_NAME,
                prefill: {
                    email: options.email,
                    contact: options.contact,
                    name: options.name,
                },
                method: {
                    upi: true, // Show UPI as a payment option on checkout
                },
                theme: {
                    color: config.THEME_COLOR,
                },
            };

            if (options.order_id) {
                checkoutOptions.order_id = options.order_id;
            }
            RazorpayCheckout.open(checkoutOptions)
                .then((data: any) => {
                    console.log('Razorpay Success:', data);
                    resolve({
                        status: 'success',
                        razorpay_payment_id: data.razorpay_payment_id,
                        razorpay_order_id: data.razorpay_order_id,
                        razorpay_signature: data.razorpay_signature,
                    });
                })
                .catch((error: any) => {
                    // Error
                    console.error('Razorpay Error:', error);
                    resolve({
                        status: 'error',
                        error: error,
                    });
                });
        });
    },

    /**
     * Validate recharge amount
     */
    validateAmount: (
        amount: string,
        paymentType: 'security' | 'wallet' = 'wallet',
    ): { valid: boolean; error?: string } => {
        const numAmount = parseFloat(amount);
        const config =
            paymentType === 'security'
                ? RAZORPAY_CONFIG_SECURITY
                : RAZORPAY_CONFIG_WALLET;

        if (!amount || amount.trim() === '') {
            return { valid: false, error: 'Please enter an amount' };
        }

        if (isNaN(numAmount)) {
            return { valid: false, error: 'Please enter a valid amount' };
        }

        if (numAmount < config.MIN_AMOUNT) {
            return {
                valid: false,
                error: `Minimum recharge amount is ₹${config.MIN_AMOUNT}`,
            };
        }

        if (numAmount > config.MAX_AMOUNT) {
            return {
                valid: false,
                error: `Maximum recharge amount is ₹${config.MAX_AMOUNT}`,
            };
        }

        return { valid: true };
    },
};
