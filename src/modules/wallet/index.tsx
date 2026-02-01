import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    InteractionManager,
    TouchableOpacity,
    StatusBar,
    Modal,
    Platform,
    Dimensions,
    ActivityIndicator,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { walletStyles } from '../../assets/css/walletStyles';
import PaymentHistoryCard from './components/PaymentHistoryCard';
import { NavigationProp, useNavigation, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppDispatch, RootState } from '../../../store';
import { connect } from 'react-redux';
import { walletActions_dispatch } from '../../../store/action/mainTypedAction';
import BSModal from '../../components/BSModal';
import { BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { IRechargeHistoryItem } from './type';
import {
    validateRechargeAmount,
    createPaymentParams,
} from '../../services/payumoneyService';
import {
    PAYUMONEY_CONFIG,
    PayUMoneyParams,
    PaymentResponse,
} from '../../config/payumoneyConfig';
import { RazorpayService } from '../../services/RazorpayService';
import { RAZORPAY_CONFIG } from '../../config/razorpayConfig';
import Toast from 'react-native-toast-message';
import PaymentWebView from './components/PaymentWebView';
import CalendarPicker from 'react-native-calendar-picker';
import { RootStackParamList } from '../../navigations/navigation';
import WalletCard from '../dashboard/components/WalletCard';
import { dashboardStyles } from '../../assets/css/dashboardStyles';
import { Comp_State_ID } from '../../services/env';
import RechargeModalContent from './components/RechargeModalContent';

const Wallet = (props: any) => {
    console.log(props, 'Props');

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const isFocused = useIsFocused();
    const rechargeModalRef = React.useRef<BottomSheetModal>(null);
    const [showPaymentWebView, setShowPaymentWebView] = useState(false);
    const [paymentParams, setPaymentParams] = useState<PayUMoneyParams | null>(
        null,
    );
    // State management
    const [walletBalance, setWalletBalance] = useState('');
    const [openingBalance, setOpeningBalance] = useState('');
    const [rechargeHistory, setRechargeHistory] = useState<
        IRechargeHistoryItem[]
    >([]);
    // Filter and sort state
    const [fromDate, setFromDate] = useState<Date>(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30); // Default to 30 days ago
        return date;
    });
    const [toDate, setToDate] = useState<Date>(new Date());
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [minRechargeAmount, setMinRechargeAmount] = useState<string>('');

    const isSameState = useMemo(() => String(props.globalState?.stateId) === String(Comp_State_ID), [props.globalState?.stateId]);

    const renderedHistory = useMemo(() => {
        return rechargeHistory.map((item) => (
            <PaymentHistoryCard
                entryType={item.EntryType}
                key={item.TxnID}
                balance={item.Balance}
                tranDate={item.Date}
                drCr={item.DrCr}
                amount={item.Amount}
                remarks={item.Remarks || 'Transaction'}
                paymentId={item.TxnID}
            />
        ));
    }, [rechargeHistory]);

    useEffect(() => {
        if (isFocused) {
            const task = InteractionManager.runAfterInteractions(() => {
                load();
            });
            return () => {
                task.cancel();
            };
        }
    }, [isFocused]);


    const onDateChange = (date: any) => {
        const selectedDate = new Date(date);
        if (showFromPicker) {
            setFromDate(selectedDate);
            setShowFromPicker(false);
        } else if (showToPicker) {
            setToDate(selectedDate);
            setShowToPicker(false);
        }
    };

    const formatDate = useCallback((date: Date) => {
        if (!date) return '';
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
    }, []);


    const fetchMinRechargeAmount = useCallback(() => {
        props.walletActions('Get_Vendor_Min_Recharge_Amt_Api', {
            callBack: (minAmount: string) => {
                setMinRechargeAmount(minAmount);
            },
        });
    }, [props.walletActions]);

    const load = useCallback(() => {
        setIsLoading(true);
        // Fetch wallet balance
        props.walletActions('Wallet_Balance_Api', {
            callBack: (balance: string) => {
                setWalletBalance(balance);
                props.walletActions('Get_Recharge_History_Api', {
                    fromDate: formatDate(fromDate),
                    toDate: formatDate(toDate),
                    callBack: (data: IRechargeHistoryItem[]) => {
                        console.log('Recharge history:', data);
                        if (data && data.length > 0) {
                            const amount = parseFloat(data[0].Amount || '0').toLocaleString('en-IN', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            });
                            setOpeningBalance(amount + ' (' + data[0].Date + ')');
                        }
                        setRechargeHistory(data);
                        setIsLoading(false);
                    },
                });
            },
        });
    }, [props.walletActions, fromDate, toDate, formatDate]);

    const handleRecharge = useCallback((amountStr: string, gateway: 'payumoney' | 'razorpay') => {
        // Map recharge type to payment gateway
        const mappedGateway = gateway;

        // Validate amount
        const validateService =
            mappedGateway === 'razorpay'
                ? RazorpayService
                : { validateAmount: validateRechargeAmount };
        const validation = validateService.validateAmount(amountStr);

        if (!validation.valid) {
            Toast.show({
                type: 'error',
                text1: validation.error || 'Invalid amount',
                visibilityTime: 2000,
            });
            return;
        }

        const amount = parseFloat(amountStr);
        let minAmount = 0;

        if (mappedGateway === 'payumoney') {
            minAmount = parseFloat(minRechargeAmount || '0');
        } else if (mappedGateway === 'razorpay') {
            minAmount = 5000;
        }

        if (amount < minAmount) {
            Toast.show({
                type: 'error',
                text1: `Minimum recharge amount is ₹${minAmount}`,
                visibilityTime: 2000,
            });
            return;
        }

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
                    handleRazorpaySuccess(response, amountStr);
                } else {
                    handleRazorpayFailure(response);
                }
            });
        } else {
            // Step 1: Generate hash key from backend
            props.walletActions('Generate_Hashkey_Api', {
                amount: amount.toString(),
                name: userName,
                emailid: userEmail,
                userid: userId,
                callBack: (success: boolean, hash: string, txnid: string, PayUKey: string, ProductDetails: string) => {
                    if (success && hash) {
                        // Step 2: Create payment params with generated hash and backend txnid
                        const paymentParams = createPaymentParams(
                            amount,
                            userEmail,
                            userName,
                            userPhone,
                            userId,
                            hash,
                            txnid,
                            PayUKey,
                            ProductDetails
                        );

                        console.log('PayUMoney Payment Params with Backend Hash:', paymentParams);

                        // Step 3: Show WebView
                        setPaymentParams(paymentParams);
                        setShowPaymentWebView(true);
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Payment Failed',
                            text2: 'Could not generate secure payment hash',
                            visibilityTime: 3000,
                        });
                    }
                },
            });
        }
    }, [props.walletActions, props.globalState, RazorpayService, minRechargeAmount]);

    const handleRazorpaySuccess = useCallback((response: any, amount: string) => {
        console.log('Razorpay Success:', response);

        // Process payment response
        // Note: Using the same 'Process_Payment_Response' action if compatible,
        // or we might need a new one for Razorpay
        props.walletActions('Process_Payment_Response', {
            paymentResponse: {
                status: 'success',
                txnid: response.razorpay_payment_id,
                amount: amount,
                productinfo: RAZORPAY_CONFIG.PRODUCT_INFO,
                firstname: props.globalState?.name || 'User',
                email: props.globalState?.email || '',
                phone: props.globalState?.mobile || '',
                mihpayid: response.razorpay_payment_id, // Map razorpay id to mihpayid if needed by backend
            },
            callBack: (success: boolean, message: string) => {
                if (success) {
                    // Dismiss the recharge modal
                    rechargeModalRef.current?.dismiss();
                    
                    Toast.show({
                        type: 'success',
                        text1: 'Payment Successful',
                        text2: message,
                        visibilityTime: 3000,
                    });
                    // Reload wallet balance and history
                    load();
                }
            },
        });
    }, [props.walletActions, props.globalState, load]);

    const handleRazorpayFailure = (response: any) => {
        console.log('Razorpay Failure:', response);

        Toast.show({
            type: 'error',
            text1: 'Payment Failed',
            text2: response.error?.description || 'Unable to process payment',
            visibilityTime: 3000,
        });
    };

    const handlePaymentSuccess = useCallback((response: PaymentResponse) => {
        console.log('Payment Success:', response);
        setShowPaymentWebView(false);

        // Process payment response
        props.walletActions('Process_Payment_Response', {
            paymentResponse: response,
            callBack: (success: boolean, message: string) => {
                if (success) {
                    // Dismiss the recharge modal
                    rechargeModalRef.current?.dismiss();
                    
                    Toast.show({
                        type: 'success',
                        text1: 'Payment Successful',
                        text2: message,
                        visibilityTime: 3000,
                    });
                    // Reload wallet balance and history
                    load();
                }
            },
        });
    }, [props.walletActions, load]);

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
        setShowPaymentWebView(false);

        Toast.show({
            type: 'info',
            text1: 'Payment Cancelled',
            text2: 'You cancelled the payment',
            visibilityTime: 2000,
        });
    };

    const renderEmptyList = useCallback(() => (
        <View style={dashboardStyles.emptyStateContainer}>
            <Image
                source={require('../../assets/img/OnGoingService.png')}
                style={dashboardStyles.emptyStateImage}
            />
            <Text style={dashboardStyles.emptyStateTitle}>
                No Transaction History
            </Text>
            <Text style={dashboardStyles.emptyStateDescription}>
                You don't have any wallet transactions for the selected date
                range. Your recharge and penalty history will appear here.
            </Text>
        </View>
    ), []);

    return (
        <SafeAreaView style={walletStyles.container} edges={['top']}>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} />
            {/* Header */}
            <View style={walletStyles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={walletStyles.headerIcon}>
                    <Ionicons name="chevron-back" size={24} color="#1C1F34" />
                </TouchableOpacity>
                <Text style={walletStyles.headerTitle}>Wallet</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
                <View style={{ paddingHorizontal: 4, marginTop: 10 }}>
                    <WalletCard
                        balance={walletBalance}
                        openingBalance={openingBalance}
                        onRechargePress={useCallback(() => {
                            rechargeModalRef.current?.present();
                            fetchMinRechargeAmount();
                        }, [fetchMinRechargeAmount])}
                    />
                </View>

                {/* Filter Section */}
                <View style={walletStyles.filterSection}>
                    <View style={walletStyles.dateRow}>
                        <TouchableOpacity
                            style={walletStyles.dateInput}
                            onPress={() => setShowFromPicker(true)}>
                            <Ionicons
                                name="calendar-outline"
                                size={18}
                                color="#5F60B9"
                            />
                            <Text style={walletStyles.dateInputText}>
                                {formatDate(fromDate)}
                            </Text>
                            <Ionicons
                                name="chevron-forward"
                                size={16}
                                color="#8F8F8F"
                                style={walletStyles.dateInputIcon}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={walletStyles.dateInput}
                            onPress={() => setShowToPicker(true)}>
                            <Ionicons
                                name="calendar-outline"
                                size={18}
                                color="#5F60B9"
                            />
                            <Text style={walletStyles.dateInputText}>
                                {formatDate(toDate)}
                            </Text>
                            <Ionicons
                                name="chevron-forward"
                                size={16}
                                color="#8F8F8F"
                                style={walletStyles.dateInputIcon}
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={walletStyles.applyFilterButton}
                        onPress={load}
                        disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                            <Text style={walletStyles.applyFilterButtonText}>
                                APPLY FILTER
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Transaction History List */}
                <View style={walletStyles.transactionHistoryContainer}>
                    <Text style={walletStyles.transactionHistoryTitle}>
                        Recharge History
                    </Text>
                </View>
                {rechargeHistory.length > 0
                    ? renderedHistory
                    : renderEmptyList()}
            </ScrollView>

            {/* Date Picker Modal */}
            <Modal
                visible={showFromPicker || showToPicker}
                transparent={true}
                animationType="fade"
                onRequestClose={() => {
                    setShowFromPicker(false);
                    setShowToPicker(false);
                }}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 16,
                            padding: 20,
                            width: Dimensions.get('window').width - 40,
                            maxHeight: Dimensions.get('window').height - 100,
                        }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 20,
                            }}>
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    color: '#1C1F34',
                                }}>
                                Select {showFromPicker ? 'From' : 'To'} Date
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowFromPicker(false);
                                    setShowToPicker(false);
                                }}
                                style={{
                                    padding: 8,
                                    backgroundColor: '#F7F9FC',
                                    borderRadius: 12,
                                }}>
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color="#8F9BB3"
                                />
                            </TouchableOpacity>
                        </View>

                        <CalendarPicker
                            onDateChange={onDateChange}
                            selectedDayColor="#5F60B9"
                            selectedDayTextColor="#FFFFFF"
                            todayBackgroundColor="#E4E9F2"
                            todayTextStyle={{
                                color: '#222B45',
                                fontWeight: 'bold',
                            }}
                            initialDate={showToPicker ? toDate : fromDate}
                            width={Dimensions.get('window').width - 88}
                            textStyle={{
                                fontFamily:
                                    Platform.OS === 'ios' ? 'System' : 'Roboto',
                                color: '#222B45',
                            }}
                            headerWrapperStyle={{
                                paddingHorizontal: 0,
                            }}
                            monthTitleStyle={{
                                fontSize: 16,
                                fontWeight: '700',
                                color: '#222B45',
                            }}
                            yearTitleStyle={{
                                fontSize: 16,
                                fontWeight: '700',
                                color: '#222B45',
                            }}
                            dayLabelsWrapper={{
                                borderTopWidth: 0,
                                borderBottomWidth: 0,
                                paddingTop: 10,
                                paddingBottom: 10,
                            }}
                            nextComponent={
                                <Ionicons
                                    name="chevron-forward"
                                    size={24}
                                    color="#5F60B9"
                                />
                            }
                            previousComponent={
                                <Ionicons
                                    name="chevron-back"
                                    size={24}
                                    color="#5F60B9"
                                />
                            }
                        />
                    </View>
                </View>
            </Modal>

            <BSModal
                bsModalRef={rechargeModalRef}
                headerTitle="Recharge Wallet"
                snapPoints={['65%']}>
                <RechargeModalContent
                    minRechargeAmount={minRechargeAmount}
                    onRecharge={handleRecharge}
                    userStateId={props.globalState?.stateId}
                />
            </BSModal>

            {/* Payment WebView Modal */}
            {
                paymentParams && (
                    <PaymentWebView
                        visible={showPaymentWebView}
                        paymentParams={paymentParams}
                        onSuccess={handlePaymentSuccess}
                        onFailure={handlePaymentFailure}
                        onCancel={handlePaymentCancel}
                    />
                )
            }
        </SafeAreaView >
    );
};

const mapStateToProps = (state: RootState) => ({
    globalState: state.globalState,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    walletActions: walletActions_dispatch(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
