/**
 * UPI Payment Service
 * Handles UPI intent generation and app launching
 */

import { Linking, Platform, Alert } from 'react-native';

export interface UpiApp {
    id: string;
    name: string;
    packageName: string; // Android package name
    iosScheme?: string; // iOS URL scheme
    iconName: string; // Ionicon name
    color: string; // Brand color
}

export interface UpiPaymentParams {
    vpa: string; // Virtual Payment Address (UPI ID of merchant)
    name: string; // Merchant name
    amount: string; // Amount in rupees
    transactionId: string; // Unique transaction ID
    transactionNote?: string; // Optional note
    merchantCode?: string; // Optional merchant code
}

export class UpiPaymentService {
    /**
     * Generate UPI intent URL for Android
     */
    static generateUpiIntentUrl(params: UpiPaymentParams): string {
        const { vpa, name, amount, transactionId, transactionNote, merchantCode } =
            params;

        // UPI URI format: upi://pay?pa=<VPA>&pn=<Name>&am=<Amount>&tn=<Note>&tr=<TxnId>&mc=<MerchantCode>
        const upiParams = new URLSearchParams({
            pa: vpa, // Payee address (VPA)
            pn: name, // Payee name
            am: amount, // Amount
            tn: transactionNote || `Payment for ${transactionId}`, // Transaction note
            tr: transactionId, // Transaction reference ID
            cu: 'INR', // Currency
        });

        if (merchantCode) {
            upiParams.append('mc', merchantCode);
        }

        return `upi://pay?${upiParams.toString()}`;
    }

    /**
     * Generate app-specific UPI intent URL for Android
     */
    static generateAppSpecificIntent(
        app: UpiApp,
        params: UpiPaymentParams,
    ): string {
        const upiUrl = this.generateUpiIntentUrl(params);

        if (Platform.OS === 'android') {
            // Android Intent format
            // intent://pay?<params>#Intent;scheme=upi;package=<package_name>;end
            const intentUrl = `intent://pay?${new URLSearchParams({
                pa: params.vpa,
                pn: params.name,
                am: params.amount,
                tn: params.transactionNote || `Payment for ${params.transactionId}`,
                tr: params.transactionId,
                cu: 'INR',
            }).toString()}#Intent;scheme=upi;package=${app.packageName};end`;

            return intentUrl;
        } else {
            // iOS - Use app-specific URL scheme if available
            if (app.iosScheme) {
                // Different apps might have different URL schemes
                // For most UPI apps, we can use: <scheme>://upi/pay?<params>
                return `${app.iosScheme}upi/pay?${new URLSearchParams({
                    pa: params.vpa,
                    pn: params.name,
                    am: params.amount,
                    tn: params.transactionNote || `Payment for ${params.transactionId}`,
                    tr: params.transactionId,
                    cu: 'INR',
                }).toString()}`;
            }
            return upiUrl;
        }
    }

    /**
     * Launch UPI app with payment parameters
     */
    static async launchUpiApp(
        app: UpiApp,
        params: UpiPaymentParams,
    ): Promise<{ success: boolean; error?: string }> {
        try {
            const intentUrl = this.generateAppSpecificIntent(app, params);
            console.log(`Launching ${app.name} with URL:`, intentUrl);

            // Check if the app can be opened
            const canOpen = await Linking.canOpenURL(intentUrl);

            if (canOpen) {
                await Linking.openURL(intentUrl);
                return { success: true };
            } else {
                // App not installed
                return {
                    success: false,
                    error: `${app.name} is not installed on your device`,
                };
            }
        } catch (error) {
            console.error(`Error launching ${app.name}:`, error);
            return {
                success: false,
                error: `Failed to open ${app.name}. Please try another payment method.`,
            };
        }
    }

    /**
     * Launch generic UPI intent (shows all available UPI apps)
     */
    static async launchGenericUpiIntent(
        params: UpiPaymentParams,
    ): Promise<{ success: boolean; error?: string }> {
        try {
            const upiUrl = this.generateUpiIntentUrl(params);
            console.log('Launching generic UPI intent:', upiUrl);

            const canOpen = await Linking.canOpenURL(upiUrl);

            if (canOpen) {
                await Linking.openURL(upiUrl);
                return { success: true };
            } else {
                return {
                    success: false,
                    error: 'No UPI apps found on your device',
                };
            }
        } catch (error) {
            console.error('Error launching UPI intent:', error);
            return {
                success: false,
                error: 'Failed to open UPI payment. Please try another method.',
            };
        }
    }

    /**
     * Check if a specific UPI app is installed
     */
    static async isAppInstalled(app: UpiApp): Promise<boolean> {
        try {
            const scheme =
                Platform.OS === 'android'
                    ? `intent://pay#Intent;scheme=upi;package=${app.packageName};end`
                    : app.iosScheme || 'upi://';

            return await Linking.canOpenURL(scheme);
        } catch (error) {
            console.error(`Error checking if ${app.name} is installed:`, error);
            return false;
        }
    }

    /**
     * Show alert when app is not installed
     */
    static showAppNotInstalledAlert(appName: string) {
        Alert.alert(
            'App Not Installed',
            `${appName} is not installed on your device. Please install it or choose another payment method.`,
            [{ text: 'OK' }],
        );
    }
}
