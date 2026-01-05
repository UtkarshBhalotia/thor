import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    InteractionManager,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { walletStyles } from '../../assets/css/walletStyles';
import PaymentHistoryCard from './components/PaymentHistoryCard';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppDispatch, RootState } from '../../../store';
import { connect } from 'react-redux';
import { walletActions_dispatch } from '../../../store/action/mainTypedAction';
import BSModal from '../../components/BSModal';
import { BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { validateRechargeAmount, createPaymentParams } from '../../services/payumoneyService';
import { PAYUMONEY_CONFIG, PayUMoneyParams, PaymentResponse } from '../../config/payumoneyConfig';
import { RazorpayService } from '../../services/RazorpayService';
import { RAZORPAY_CONFIG } from '../../config/razorpayConfig';
import Toast from 'react-native-toast-message';
import PaymentWebView from './components/PaymentWebView';

const Wallet = (props: any) => {
    console.log(props, "Props");

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const rechargeModalRef = React.useRef<BottomSheetModal>(null);
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [showPaymentWebView, setShowPaymentWebView] = useState(false);
    const [paymentParams, setPaymentParams] = useState<PayUMoneyParams | null>(null);
    // State management
    const [walletBalance, setWalletBalance] = useState('');
    const [rechargeHistory, setRechargeHistory] = useState<IRechargeHistoryItem[]>([]);
    const [selectedGateway, setSelectedGateway] = useState<'payumoney' | 'razorpay'>('payumoney');

    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            load();
        });
        return () => {
            task.cancel();
        };
    }, []);

    const load = () => {
        // Fetch wallet balance
        props.walletActions('Wallet_Balance_Api', {
            callBack: (balance: string) => {
                setWalletBalance(balance);
                // Fetch recharge history after wallet balance
                props.walletActions('Get_Recharge_History_Api', {
                    callBack: (data: IRechargeHistoryItem[]) => {
                        console.log('Recharge history:', data);
                        setRechargeHistory(data);
                    }
                });
            }
        });
    };

    const handleRecharge = () => {
        // Map recharge type to payment gateway
        const mappedGateway = selectedGateway === 'razorpay' ? 'razorpay' : 'payumoney';

        // Validate amount
        const validateService = mappedGateway === 'razorpay' ? RazorpayService : { validateAmount: validateRechargeAmount };
        const validation = validateService.validateAmount(rechargeAmount);

        if (!validation.valid) {
            Toast.show({
                type: 'error',
                text1: validation.error || 'Invalid amount',
                visibilityTime: 2000,
            });
            return;
        }

        const amount = parseFloat(rechargeAmount);

        // Get user details from global state
        const userEmail = props.globalState.email || 'test@example.com';
        const userName = props.globalState?.name || 'Test User';
        const userPhone = props.globalState?.mobile || '9999999999';
        const userId = props.globalState?.userId || '1';

        // Close the recharge modal
        rechargeModalRef.current?.dismiss();

        if (mappedGateway === 'razorpay') {
            // Open Razorpay Checkout
            RazorpayService.openCheckout({
                amount: amount * 100, // Razorpay expects amount in paise
                email: userEmail,
                contact: userPhone,
                name: userName,
                description: RAZORPAY_CONFIG.PRODUCT_INFO,
            }).then((response) => {
                if (response.status === 'success') {
                    handleRazorpaySuccess(response);
                } else {
                    handleRazorpayFailure(response);
                }
            });
        } else {
            // Create PayUMoney payment parameters
            const paymentParams = createPaymentParams(
                amount,
                userEmail,
                userName,
                userPhone,
                userId
            );

            console.log('PayUMoney Payment Params:', paymentParams);

            // Set payment params and show WebView
            setPaymentParams(paymentParams);
            setShowPaymentWebView(true);
        }
    };

    const handleRazorpaySuccess = (response: any) => {
        console.log('Razorpay Success:', response);

        // Process payment response
        // Note: Using the same 'Process_Payment_Response' action if compatible, 
        // or we might need a new one for Razorpay
        props.walletActions('Process_Payment_Response', {
            paymentResponse: {
                status: 'success',
                txnid: response.razorpay_payment_id,
                amount: rechargeAmount,
                productinfo: RAZORPAY_CONFIG.PRODUCT_INFO,
                firstname: props.globalState?.name || 'User',
                email: props.globalState?.email || '',
                phone: props.globalState?.mobile || '',
                mihpayid: response.razorpay_payment_id, // Map razorpay id to mihpayid if needed by backend
            },
            callBack: (success: boolean, message: string) => {
                if (success) {
                    Toast.show({
                        type: 'success',
                        text1: 'Payment Successful',
                        text2: message,
                        visibilityTime: 3000,
                    });
                    // Clear the recharge amount
                    setRechargeAmount('');
                    // Reload wallet balance and history
                    load();
                }
            }
        });
    };

    const handleRazorpayFailure = (response: any) => {
        console.log('Razorpay Failure:', response);

        Toast.show({
            type: 'error',
            text1: 'Payment Failed',
            text2: response.error?.description || 'Unable to process payment',
            visibilityTime: 3000,
        });
    };

    const handlePaymentSuccess = (response: PaymentResponse) => {
        console.log('Payment Success:', response);
        setShowPaymentWebView(false);

        // Process payment response
        props.walletActions('Process_Payment_Response', {
            paymentResponse: response,
            callBack: (success: boolean, message: string) => {
                if (success) {
                    Toast.show({
                        type: 'success',
                        text1: 'Payment Successful',
                        text2: message,
                        visibilityTime: 3000,
                    });
                    // Clear the recharge amount
                    setRechargeAmount('');
                    // Reload wallet balance and history
                    load();
                }
            }
        });
    };

    const handlePaymentFailure = (response: PaymentResponse) => {
        console.log('Payment Failure:', response);
        setShowPaymentWebView(false);

        Toast.show({
            type: 'error',
            text1: 'Payment Failed',
            text2: response.error_Message || 'Unable to process payment',
            visibilityTime: 3000,
        });
    };

    const handlePaymentCancel = () => {
        console.log('Payment Cancelled');
        setShowPaymentWebView(false);

        Toast.show({
            type: 'info',
            text1: 'Payment Cancelled',
            text2: 'You cancelled the payment',
            visibilityTime: 2000,
        });
    };

    // const handlePaymentPress = (recharge: IRechargeHistoryItem) => {
    //     console.log('Recharge pressed:', recharge.RechargeID);
    //     // Navigate to recharge details screen if needed
    // };

    const renderEmptyList = () => (
        <View style={walletStyles.emptyContainer}>
            <Text style={walletStyles.emptyText}>No recharge history found</Text>
        </View>
    );

    return (
        <SafeAreaView style={walletStyles.container} edges={['top']}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            {/* Header with Back Button */}
            <View style={[walletStyles.header, { flexDirection: 'row', alignItems: 'center' }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        padding: 8,
                        marginRight: 12,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Ionicons name="chevron-back" size={24} color="#1C1F34" />
                </TouchableOpacity>
                <Text style={walletStyles.headerTitle}>Recharge History</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {/* Wallet Balance Card */}
                <View style={walletStyles.balanceCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Text style={walletStyles.balanceLabel}>Wallet Balance</Text>
                            <Text style={walletStyles.balanceAmount}>₹ {walletBalance}</Text>
                        </View>
                        <TouchableOpacity
                            style={walletStyles.walletRechargeButton}
                            onPress={() => {
                                setSelectedGateway('payumoney');
                                rechargeModalRef.current?.present();
                            }}
                        >
                            <Ionicons
                                name="add-circle-outline"
                                size={18}
                                color="#FFFFFF"
                                style={walletStyles.walletRechargeIcon}
                            />
                            <Text style={walletStyles.walletRechargeText}>Recharge Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recharge History Section */}
                <View style={walletStyles.sectionHeader}>
                    <Text style={walletStyles.sectionTitle}>Recharge History</Text>
                </View>

                {/* Recharge History List */}
                {rechargeHistory.length > 0 ? (
                    rechargeHistory.map((item) => (
                        <PaymentHistoryCard
                            key={item.TxnID}
                            tranDate={item.Date}
                            amount={`₹ ${item.Amount}`}
                            remarks={item.Remarks}
                            paymentId={item.TxnID}
                        />
                    ))
                ) : (
                    renderEmptyList()
                )}
            </ScrollView>

            <BSModal
                bsModalRef={rechargeModalRef}
                headerTitle="Recharge Wallet"
                snapPoints={['55%']}
            >
                <View style={walletStyles.bottomSheetContent}>
                    <Text style={walletStyles.inputLabel}>Select Recharge Type</Text>
                    <View style={walletStyles.gatewayContainer}>
                        <TouchableOpacity
                            style={[
                                walletStyles.gatewayOption,
                                selectedGateway === 'payumoney' && walletStyles.gatewayOptionSelected
                            ]}
                            onPress={() => setSelectedGateway('payumoney')}
                        >
                            <Ionicons
                                name="wallet-outline"
                                size={24}
                                color={selectedGateway === 'payumoney' ? '#5F60B9' : '#1C1F34'}
                            />
                            <Text style={[
                                walletStyles.gatewayText,
                                selectedGateway === 'payumoney' && walletStyles.gatewayTextSelected
                            ]}>Wallet Balance</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                walletStyles.gatewayOption,
                                selectedGateway === 'razorpay' && walletStyles.gatewayOptionSelected
                            ]}
                            onPress={() => setSelectedGateway('razorpay')}
                        >
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={24}
                                color={selectedGateway === 'razorpay' ? '#5F60B9' : '#1C1F34'}
                            />
                            <Text style={[
                                walletStyles.gatewayText,
                                selectedGateway === 'razorpay' && walletStyles.gatewayTextSelected
                            ]}>Security Deposit</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={walletStyles.amountInputContainer}>
                        <Text style={walletStyles.inputLabel}>Enter Amount (Min: ₹{RAZORPAY_CONFIG.MIN_AMOUNT})</Text>
                        <BottomSheetTextInput
                            style={walletStyles.amountInput}
                            placeholder="₹ 0.00"
                            keyboardType="numeric"
                            value={rechargeAmount}
                            onChangeText={setRechargeAmount}
                        />
                    </View>

                    <TouchableOpacity
                        style={walletStyles.rechargeActionButton}
                        onPress={handleRecharge}
                    >
                        <Text style={walletStyles.rechargeActionButtonText}>Recharge</Text>
                    </TouchableOpacity>
                </View>
            </BSModal>

            {/* Payment WebView Modal */}
            {paymentParams && (
                <PaymentWebView
                    visible={showPaymentWebView}
                    paymentParams={paymentParams}
                    onSuccess={handlePaymentSuccess}
                    onFailure={handlePaymentFailure}
                    onCancel={handlePaymentCancel}
                />
            )}
        </SafeAreaView>
    );
};

const mapStateToProps = (state: RootState) => ({
    globalState: state.globalState,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    walletActions: walletActions_dispatch(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
