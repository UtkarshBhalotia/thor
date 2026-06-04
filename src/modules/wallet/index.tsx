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
import { RazorpayService } from '../../services/RazorpayService';
import { RAZORPAY_CONFIG_SECURITY, RAZORPAY_CONFIG_WALLET } from '../../config/razorpayConfig';
import Toast from 'react-native-toast-message';
import CalendarPicker from 'react-native-calendar-picker';
import { RootStackParamList } from '../../navigations/navigation';
import WalletCard from '../dashboard/components/WalletCard';
import { dashboardStyles } from '../../assets/css/dashboardStyles';
import { Comp_State_ID, ENV } from '../../services/env';
import RechargeModalContent from './components/RechargeModalContent';

const Wallet = (props: any) => {
    console.log(props, 'Props');

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const isFocused = useIsFocused();
    const rechargeModalRef = React.useRef<BottomSheetModal>(null);
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
                key={item.TxnID + Math.random()}
                tranDate={item.SDate}
                amount={item.Amount}
                remarks={item.Remarks || 'Wallet Recharge'}
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
                        // if (data && data.length > 0) {
                        //     const amount = parseFloat(data[0].Amount || '0').toLocaleString('en-IN', {
                        //         minimumFractionDigits: 2,
                        //         maximumFractionDigits: 2,
                        //     });
                        //     setOpeningBalance(amount + ' (' + data[0].Date + ')');
                        // }
                        setRechargeHistory(data);
                        setIsLoading(false);
                    },
                });
            },
        });
    }, [props.walletActions, fromDate, toDate, formatDate]);

    const handleRecharge = useCallback((amountStr: string, type: 'wallet' | 'security') => {
        // Validate amount
        const validation = RazorpayService.validateAmount(amountStr, type);

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

        if (type === 'wallet') {
            minAmount = parseFloat(minRechargeAmount || '0');
        } else if (type === 'security') {
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
        const config = type === 'wallet' ? RAZORPAY_CONFIG_WALLET : RAZORPAY_CONFIG_SECURITY;
        const description = type === 'wallet' ? 'Wallet Recharge' : config.PRODUCT_INFO;
        const razorpayKey = ENV === 'dev' ? config.TEST_KEY_ID : config.KEY_ID;

        // Close the recharge modal
        rechargeModalRef.current?.dismiss();

        const userId = String(props.globalState?.vendorId || props.globalState?.userId || '');
        const paymentType = type === 'security' ? 'D' : 'R';

        props.walletActions('Create_Razorpay_Order_Id_Api', {
            userId,
            amount: amountStr,
            payment_type: paymentType,
            callBack: (success: boolean, orderId: string, error: any) => {
                if (success && orderId) {
                    RazorpayService.openCheckout({
                        key: razorpayKey,
                        amount: amount * 100, // Razorpay expects amount in paise
                        email: userEmail,
                        contact: userPhone,
                        name: userName,
                        description: description,
                        order_id: orderId,
                        paymentType: type,
                    })
                    
                    .then((response) => {        
                        if (response.status === 'success') {
                            handleRazorpaySuccess(response, amountStr, description, paymentType);
                        } else {
                        
                            handleRazorpayFailure(response);
                        }
                    })
                    .catch((err) => {
                        Toast.show({
                            type: 'error',
                            text1: 'Checkout failed',
                            text2: err?.message || 'Unable to open checkout',
                            visibilityTime: 3000,
                        });
                    });
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Order creation failed',
                        text2: error || 'Unable to create payment order',
                        visibilityTime: 3000,
                    });
                }
            }
        });
    }, [props.globalState, RazorpayService, minRechargeAmount, props.walletActions]);

    const handleRazorpaySuccess = useCallback((response: any, amount: string, description: string, paymentType: 'D' | 'R') => {
        console.log('Razorpay Success:', response);

        props.walletActions('Verify_Razorpay_Signature', {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            payment_type: paymentType,
            callBack: (verified: boolean, verifyError?: string) => {
                if (!verified) {
                    Toast.show({
                        type: 'error',
                        text1: 'Payment Verification Failed',
                        text2: verifyError || 'Signature mismatch',
                        visibilityTime: 3000,
                    });
                    return;
                }

                if (paymentType === 'D') {
                    props.walletActions('Insert_Security_Deposit_Api', {
                        amount: amount,
                        txnId: response.razorpay_payment_id,
                        callBack: (success: boolean, message: string) => {
                            if (success) {
                                Toast.show({
                                    type: 'success',
                                    text1: 'Payment Successful',
                                    text2: message,
                                    visibilityTime: 3000,
                                });
                                rechargeModalRef.current?.dismiss();
                                load();
                            } else {
                                Toast.show({
                                    type: 'error',
                                    text1: 'Payment Successful but Update Failed',
                                    text2: message,
                                    visibilityTime: 3000,
                                });
                            }
                        },
                    });
                } else {
                    props.walletActions('Process_Payment_Response', {
                        paymentResponse: {
                            status: 'success',
                            txnid: response.razorpay_payment_id,
                            amount: amount,
                            productinfo: description,
                            firstname: props.globalState?.name || 'User',
                            email: props.globalState?.email || '',
                            phone: props.globalState?.mobile || '',
                            mihpayid: response.razorpay_payment_id,
                        },
                        callBack: (success: boolean, message: string) => {
                            if (success) {
                                rechargeModalRef.current?.dismiss();
                                Toast.show({
                                    type: 'success',
                                    text1: 'Payment Successful',
                                    text2: message,
                                    visibilityTime: 3000,
                                });
                                load();
                            }
                        },
                    });
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
                range. Your recharge history will appear here.
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
