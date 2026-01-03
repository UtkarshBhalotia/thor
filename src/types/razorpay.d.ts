declare module 'react-native-razorpay' {
    export interface CheckoutOptions {
        description: string;
        image: string;
        currency: string;
        key: string;
        amount: number;
        name: string;
        order_id?: string;
        prefill: {
            email: string;
            contact: string;
            name: string;
        };
        theme: {
            color: string;
        };
    }

    export default class RazorpayCheckout {
        static open(options: CheckoutOptions): Promise<any>;
    }
}
