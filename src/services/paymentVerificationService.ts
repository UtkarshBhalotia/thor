/**
 * Payment Verification Service
 * Handles payment status verification and polling for UPI payments
 */

import { AppState, AppStateStatus } from 'react-native';

export interface PaymentVerificationParams {
    txnid: string;
    amount: string;
    onSuccess: (response: any) => void;
    onFailure: (response: any) => void;
    onPending: () => void;
}

export class PaymentVerificationService {
    private static pollingInterval: NodeJS.Timeout | null = null;
    private static appStateSubscription: any = null;
    private static currentTxnId: string | null = null;
    private static verificationCallback: ((txnid: string) => void) | null = null;

    /**
     * Start monitoring for payment completion
     * This will poll the backend and monitor app state changes
     */
    static startPaymentMonitoring(
        txnid: string,
        verifyPaymentCallback: (txnid: string) => void,
        maxAttempts: number = 20, // Poll for ~2 minutes (20 attempts * 6 seconds)
    ) {
        console.log('Starting payment monitoring for txnid:', txnid);
        
        this.currentTxnId = txnid;
        this.verificationCallback = verifyPaymentCallback;

        // Monitor app state changes (when user returns from UPI app)
        this.startAppStateMonitoring();

        // Start polling for payment status
        this.startPolling(txnid, verifyPaymentCallback, maxAttempts);
    }

    /**
     * Stop all monitoring and polling
     */
    static stopPaymentMonitoring() {
        console.log('Stopping payment monitoring');
        
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }

        if (this.appStateSubscription) {
            this.appStateSubscription.remove();
            this.appStateSubscription = null;
        }

        this.currentTxnId = null;
        this.verificationCallback = null;
    }

    /**
     * Monitor app state changes
     * When app comes to foreground, verify payment immediately
     */
    private static startAppStateMonitoring() {
        this.appStateSubscription = AppState.addEventListener(
            'change',
            this.handleAppStateChange.bind(this),
        );
    }

    /**
     * Handle app state changes
     */
    private static handleAppStateChange(nextAppState: AppStateStatus) {
        console.log('App state changed to:', nextAppState);

        if (nextAppState === 'active' && this.currentTxnId && this.verificationCallback) {
            console.log('App came to foreground, verifying payment immediately');
            // User returned to app, verify payment immediately
            this.verificationCallback(this.currentTxnId);
        }
    }

    /**
     * Start polling for payment status
     */
    private static startPolling(
        txnid: string,
        verifyCallback: (txnid: string) => void,
        maxAttempts: number,
    ) {
        let attempts = 0;

        // Poll every 6 seconds
        this.pollingInterval = setInterval(() => {
            attempts++;
            console.log(`Polling attempt ${attempts}/${maxAttempts} for txnid:`, txnid);

            if (attempts >= maxAttempts) {
                console.log('Max polling attempts reached, stopping');
                this.stopPaymentMonitoring();
                return;
            }

            // Call verification callback
            verifyCallback(txnid);
        }, 6000); // Poll every 6 seconds
    }

    /**
     * Verify a single payment transaction
     * This should be called by your Redux action
     */
    static verifyPayment(
        txnid: string,
        verifyApiCallback: (
            txnid: string,
            onComplete: (success: boolean, response: any) => void,
        ) => void,
        onSuccess: (response: any) => void,
        onFailure: (response: any) => void,
        onPending: () => void,
    ) {
        console.log('Verifying payment for txnid:', txnid);

        verifyApiCallback(txnid, (success: boolean, response: any) => {
            if (success) {
                console.log('Payment verification successful:', response);
                this.stopPaymentMonitoring();
                onSuccess(response);
            } else if (response?.status === 'pending') {
                console.log('Payment still pending');
                onPending();
                // Continue polling
            } else {
                console.log('Payment verification failed:', response);
                this.stopPaymentMonitoring();
                onFailure(response);
            }
        });
    }

    /**
     * Handle deep link return from UPI app
     * Call this when app is opened via deep link
     */
    static handleDeepLinkReturn(url: string) {
        console.log('Deep link received:', url);

        // Extract transaction ID from deep link if present
        const txnidMatch = url.match(/txnid=([^&]+)/);
        const statusMatch = url.match(/status=([^&]+)/);

        if (txnidMatch && this.verificationCallback) {
            const txnid = txnidMatch[1];
            const status = statusMatch ? statusMatch[1] : 'unknown';

            console.log('Deep link contains txnid:', txnid, 'status:', status);

            // Verify payment immediately
            this.verificationCallback(txnid);
        }
    }
}
