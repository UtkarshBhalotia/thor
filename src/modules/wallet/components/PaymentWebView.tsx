/**
 * PayUMoney Payment WebView Component
 * Handles payment gateway redirect using WebView
 */

import React, { useRef, useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    Modal,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PAYUMONEY_CONFIG, PayUMoneyParams, PaymentResponse } from '../../../config/payumoneyConfig';

interface PaymentWebViewProps {
    visible: boolean;
    paymentParams: PayUMoneyParams;
    onSuccess: (response: PaymentResponse) => void;
    onFailure: (response: PaymentResponse) => void;
    onCancel: () => void;
}

const PaymentWebView: React.FC<PaymentWebViewProps> = ({
    visible,
    paymentParams,
    onSuccess,
    onFailure,
    onCancel,
}) => {
    const webViewRef = useRef<WebView>(null);
    const [loading, setLoading] = useState(true);
    const paymentProcessedRef = useRef(false);

    // Reset payment processed flag when modal becomes visible
    useEffect(() => {
        if (visible) {
            paymentProcessedRef.current = false;
        }
    }, [visible]);

    // Generate HTML form for PayUMoney
    const getPaymentHTML = () => {
        const formFields = Object.entries(paymentParams)
            .map(([key, value]) => {
                return `<input type="hidden" name="${key}" value="${value}" />`;
            })
            .join('\n');

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        margin: 0;
                        font-family: Arial, sans-serif;
                        background-color: #f5f5f5;
                    }
                    .loader {
                        text-align: center;
                    }
                    .spinner {
                        border: 4px solid #f3f3f3;
                        border-top: 4px solid #4A90E2;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 20px;
                    }
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            </head>
            <body>
                <div class="loader">
                    <div class="spinner"></div>
                    <p>Redirecting to payment gateway...</p>
                </div>
                <form id="payuForm" action="${PAYUMONEY_CONFIG.BASE_URL}/_payment" method="POST">
                    ${formFields}
                </form>
                <script>
                    document.getElementById('payuForm').submit();
                </script>
            </body>
            </html>
        `;
    };

    const handleNavigationChange = (navState: any) => {
        const { url } = navState;
        console.log('Navigation URL State Change:', url);
        handleResponseUrl(url);
    };

    const getQueryParam = (url: string, param: string): string => {
        const query = url.split('?')[1];
        if (!query) return '';
        const pairs = query.split('&');
        for (const pair of pairs) {
            const [key, value] = pair.split('=');
            if (decodeURIComponent(key) === param) {
                return decodeURIComponent(value || '');
            }
        }
        return '';
    };

    const handleResponseUrl = (url: string) => {
        // Prevent duplicate processing
        if (paymentProcessedRef.current) {
            console.log('Payment already processed, ignoring duplicate call');
            return false;
        }

        // Check for success URL
        if (url.includes('payumoney://payu/success') || url.includes('/success')) {
            console.log('Detected Success URL:', url);
            paymentProcessedRef.current = true;
            
            // Parse the URL parameters
            const response: PaymentResponse = {
                status: 'success',
                txnid: getQueryParam(url, 'txnid') || paymentParams.txnid,
                amount: getQueryParam(url, 'amount') || paymentParams.amount,
                productinfo: paymentParams.productinfo,
                firstname: paymentParams.firstname,
                email: paymentParams.email,
                phone: paymentParams.phone,
                mihpayid: getQueryParam(url, 'mihpayid') || `MOJO${Date.now()}`,
            };
            onSuccess(response);
            return false; // Stop loading
        }

        // Check for failure URL
        if (url.includes('payumoney://payu/failure') || url.includes('/failure')) {
            console.log('Detected Failure URL:', url);
            paymentProcessedRef.current = true;
            
            const response: PaymentResponse = {
                status: 'failure',
                txnid: getQueryParam(url, 'txnid') || paymentParams.txnid,
                amount: paymentParams.amount,
                productinfo: paymentParams.productinfo,
                firstname: paymentParams.firstname,
                email: paymentParams.email,
                phone: paymentParams.phone,
                error_Message: getQueryParam(url, 'error_Message') || 'Payment failed',
            };
            onFailure(response);
            return false; // Stop loading
        }

        // Check for cancel URL
        if (url.includes('payumoney://payu/cancel') || url.includes('/cancel')) {
            console.log('Detected Cancel URL:', url);
            paymentProcessedRef.current = true;
            onCancel();
            return false; // Stop loading
        }

        return true; // Continue loading
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onCancel}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Payment</Text>
                    <View style={styles.placeholder} />
                </View>

                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#4A90E2" />
                    </View>
                )}

                <WebView
                    ref={webViewRef}
                    source={{ html: getPaymentHTML() }}
                    onLoad={() => setLoading(false)}
                    onNavigationStateChange={handleNavigationChange}
                    onShouldStartLoadWithRequest={(request) => {
                        console.log('Should start load with request:', request.url);
                        return handleResponseUrl(request.url);
                    }}
                    style={styles.webview}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                    originWhitelist={['*']}
                />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
        backgroundColor: '#fff',
    },
    closeButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
    },
    placeholder: {
        width: 40,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        zIndex: 10,
    },
    webview: {
        flex: 1,
    },
});

export default PaymentWebView;
