import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    InteractionManager,
    StatusBar,
    Image,
    BackHandler,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dashboardStyles } from '../../assets/css/dashboardStyles';
import WalletCard from './components/WalletCard';
import StatCard from './components/StatCard';
import ServiceCard from './components/ServiceCard';
import ReviewCard from './components/ReviewCard';
import ReportCard from './components/ReportCard';
import {
    NavigationProp,
    useNavigation,
    useIsFocused,
} from '@react-navigation/native';
import { AppDispatch, RootState } from '../../../store';
import { connect } from 'react-redux';
import {
    dashboardActions_dispatch,
    walletActions_dispatch,
    bookingActions_dispatch,
} from '../../../store/action/mainTypedAction';
import BSModal from '../../components/BSModal';
import { BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RazorpayService } from '../../services/RazorpayService';
import {
    RAZORPAY_CONFIG_SECURITY,
    RAZORPAY_CONFIG_WALLET,
} from '../../config/razorpayConfig';
import { Comp_State_ID, APP_VERSION, ENV } from '../../services/env';
import Toast from 'react-native-toast-message';
import { ActivityIndicator, Modal, StyleSheet } from 'react-native';
import { useCallback } from 'react';
import { RootStackParamList } from '../../navigations/navigation';
import ForceUpdateScreen from './components/ForceUpdateScreen';

const Dashboard = (props: any) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const isFocused = useIsFocused();
    const rechargeModalRef = React.useRef<BottomSheetModal>(null);
    const [rechargeAmount, setRechargeAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const isInitialLoadRef = React.useRef(true);
    const lastRefreshTimeRef = React.useRef<number>(0);
    // Guards against load() running concurrently (e.g. focus effect firing
    // twice), which otherwise fires every dashboard API — including the work
    // report — more than once per load.
    const isLoadInFlightRef = React.useRef(false);
    const [selectedType, setSelectedType] = useState<'wallet' | 'security'>(
        'wallet',
    );
    const [minRechargeAmount, setMinRechargeAmount] = useState<string>('');
    const [needsUpdate, setNeedsUpdate] = useState(false);
    const amountAsFloat = parseFloat(rechargeAmount) || 0;
    const baseAmount = amountAsFloat / 1.18;
    const totalGst = amountAsFloat - baseAmount;
    const gstPart = totalGst / 2;
    const isSameState =
        String(props.globalState?.stateId) === String(Comp_State_ID);

    // Sample data - replace with actual data from API/Redux

    const [walletBalance, setWalletBalance] = useState('');
    const [totalSecurityDeposit, setTotalSecurityDeposit] = useState({
        DepositeAmt: '',
        MaintenanceAmt: '',
    });
    const [reportStats, setReportStats] = useState({
        ongoing: 0,
        new: 0,
        revenue: 0,
    });
    const [assignedServices, setAssignedServices] = useState([
        {
            LeadID: '',
            LeadNo: '',
            ServiceTypeName: '',
            LeadStatus: '',
            LeadDate: '',
            BrandName: '',
            ModelName: '',
            Desc: '',
            LeadAmount: '',
            StateName: '',
            CityName: '',
            CustomerName: '',
            MobileNo: '',
            Address: '',
            AcceptDate: '',
        },
    ]);

    const stats = [
        // { label: "Wallet Balance", value: 5 },
        { label: 'Security Deposit', value: totalSecurityDeposit.DepositeAmt },
        { label: 'System Charges', value: totalSecurityDeposit.MaintenanceAmt },
    ];

    const reviews = [
        {
            customerName: 'Devon Lane',
            timeAgo: '12 min ago',
            rating: 3.0,
            reviewText: 'This is amazing service i have ever get',
            serviceName: 'Chimney sweeping',
        },
        {
            customerName: 'Guy Hawkins',
            timeAgo: '12 min ago',
            rating: 3.0,
            reviewText:
                "I just love their service & the staff nature for work, I'd like to hire them again",
            serviceName: 'House cleaning',
        },
        {
            customerName: 'Jane Cooper',
            timeAgo: '12 min ago',
            rating: 3.0,
            reviewText: 'I love their work with ease, Thank you !',
            serviceName: 'Kitchen cleaning',
        },
    ];

    useEffect(() => {
        const handleBackPress = () => {
            if (isFocused) {
                Alert.alert(
                    'Exit Application',
                    'Are you sure you want to exit?',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => null,
                            style: 'cancel',
                        },
                        {
                            text: 'OK',
                            onPress: () => BackHandler.exitApp(),
                        },
                    ],
                    { cancelable: false },
                );
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            handleBackPress,
        );

        return () => backHandler.remove();
    }, [isFocused]);

    useEffect(() => {
        if (isFocused) {
            const task = InteractionManager.runAfterInteractions(() => {
                const now = Date.now();
                const timeSinceLastRefresh = now - lastRefreshTimeRef.current;
                const REFRESH_THROTTLE = 30000; // 30 seconds

                // Always load on initial mount
                if (isInitialLoadRef.current) {
                    load(true);
                    isInitialLoadRef.current = false;
                    lastRefreshTimeRef.current = now;
                }
                // Only refresh if more than 30 seconds have passed
                else if (timeSinceLastRefresh > REFRESH_THROTTLE) {
                    load(false);
                    lastRefreshTimeRef.current = now;
                }
                // Otherwise, just silently refresh ongoing services without loader
                else {
                    refreshOngoingServices();
                }
            });
            return () => {
                task.cancel();
            };
        }
    }, [isFocused]);

    const load = (showLoader: boolean = true) => {
        // Prevent overlapping loads from firing the API chain twice.
        if (isLoadInFlightRef.current) {
            return;
        }
        isLoadInFlightRef.current = true;

        if (showLoader) {
            setIsLoading(true);
        }
        // ------checkVendorCompatibilityVersionHere ----------
        props.dashboardActions('Check_Vendor_Compatibility_Version_Api', {
            callBack: (versionInfo: string) => {
                const serverVersion = versionInfo;
                console.log('Version Check:', {
                    serverVersion,
                    localVersion: APP_VERSION,
                });

                // Empty version = verification failed (endpoint/blank body).
                // Stop here and release the guard so a later focus can retry.
                if (!serverVersion) {
                    if (showLoader) {
                        setIsLoading(false);
                    }
                    isLoadInFlightRef.current = false;
                    return;
                }

                if (serverVersion && serverVersion !== APP_VERSION) {
                    console.log(
                        '[DASH] version mismatch -> STOPPING chain. server:',
                        JSON.stringify(serverVersion),
                        'local:',
                        JSON.stringify(APP_VERSION),
                    );
                    setNeedsUpdate(true);
                    if (showLoader) {
                        setIsLoading(false);
                    }
                    isLoadInFlightRef.current = false;
                    return;
                }

                console.log('[DASH] version ok -> calling balance api');
                // Proceed with regular dashboard loading if version matches
                props.dashboardActions('Get_All_Type_Vendor_Balance_Api', {
                    callBack: (data: {
                        walletBalance: string;
                        securityDeposit: string;
                        systemCharges: string;
                        totalNewLead: number;
                        totalOngoingLead: number;
                    }) => {
                        console.log(
                            '[DASH] balance callback fired -> calling ongoing services api',
                        );
                        setWalletBalance(data.walletBalance);
                        setTotalSecurityDeposit({
                            DepositeAmt: data.securityDeposit,
                            MaintenanceAmt: data.systemCharges,
                        });
                        setReportStats((prev) => ({
                            ...prev,
                            new: data.totalNewLead,
                            ongoing: data.totalOngoingLead,
                        }));
                        fetchReportData();
                        props.dashboardActions(
                            'Get_OnGoing_Services_List_Api',
                            {
                                callBack: (data: any) => {
                                    setAssignedServices(data);
                                    if (showLoader) {
                                        setIsLoading(false);
                                    }
                                    isLoadInFlightRef.current = false;
                                },
                            },
                        );
                    },
                });
            },
        });
    };

    const refreshOngoingServices = () => {
        props.dashboardActions('Get_OnGoing_Services_List_Api', {
            callBack: (data: any) => {
                setAssignedServices(data);
            },
        });
    };

    const fetchMinRechargeAmount = () => {
        props.walletActions('Get_Vendor_Min_Recharge_Amt_Api', {
            callBack: (minAmount: string) => {
                setMinRechargeAmount(minAmount);
                setRechargeAmount(minAmount);
            },
        });
    };

    const formatDateForApi = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const fetchReportData = () => {
        // Get today's date for FromDate and ToDate
        const today = new Date();
        const todayFormatted = formatDateForApi(today);

        // Calculate date 30 days ago
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        const thirtyDaysAgoFormatted = formatDateForApi(thirtyDaysAgo);

        props.dashboardActions('Get_Work_Report_For_Vendor_Api', {
            fromDate: thirtyDaysAgoFormatted,
            toDate: todayFormatted,
            callBack: (data: {
                ongoing: number;
                new: number;
                revenue: number;
            }) => {
                setReportStats((prev) => ({
                    ...prev,
                    revenue: data.revenue,
                }));
            },
        });
    };

    const handleAcceptService = (serviceId: string) => {
        console.log('Accept service:', serviceId);
        // Add your accept logic here
    };

    const handleRefuseService = (serviceId: string) => {
        console.log('Refuse service:', serviceId);
        // Add your refuse logic here
    };

    const handleFollowUp = (
        leadId: string,
        data: {
            nextFollowUpDate: Date;
            followUpDetails: string;
        },
    ) => {
        const formatDateForApi = (date: Date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        };

        props.bookingActions('FollowUp_Lead_By_Vendor_Api', {
            leadId: leadId,
            desc: data.followUpDetails,
            nextDate: formatDateForApi(data.nextFollowUpDate),
            callBack: (success: boolean, message: string) => {
                if (success) {
                    refreshOngoingServices();
                    load();
                    Toast.show({
                        type: 'success',
                        text1: message || 'Follow up added successfully',
                        visibilityTime: 2000,
                    });
                } else {
                    Toast.show({
                        type: 'error',
                        text1: message || 'Failed to add follow up',
                        visibilityTime: 3000,
                    });
                }
            },
        });
    };

    const handleDenied = (leadId: string, reason: string) => {
        const lead = assignedServices.find((item) => item.LeadID === leadId);
        if (lead) {
            props.bookingActions('Deny_Lead_By_Vendor_Api', {
                leadId: leadId,
                reason: reason,
                amount: lead.LeadAmount || '',
                callBack: (success: boolean, message: string) => {
                    if (success) {
                        refreshOngoingServices();
                        load();
                        Toast.show({
                            type: 'success',
                            text1: message || 'Lead denied successfully',
                            visibilityTime: 2000,
                        });
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: message || 'Failed to deny lead',
                            visibilityTime: 3000,
                        });
                    }
                },
            });
        }
    };

    const handleCompleted = (
        leadId: string,
        data: {
            totalBillAmount: string;
            serviceDetails: string;
            otherRemarks: string;
        },
    ) => {
        const lead = assignedServices.find((item) => item.LeadID === leadId);
        if (lead) {
            props.bookingActions('Complete_Lead_By_Vendor_Api', {
                leadId: leadId,
                partsDesc: data.serviceDetails,
                remarks: data.otherRemarks || '',
                customerAmount: data.totalBillAmount,
                callBack: (success: boolean, message: string) => {
                    if (success) {
                        refreshOngoingServices();
                        load();
                        Toast.show({
                            type: 'success',
                            text1: message || 'Lead completed successfully',
                            visibilityTime: 2000,
                        });
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: message || 'Failed to complete lead',
                            visibilityTime: 3000,
                        });
                    }
                },
            });
        }
    };

    const handleCustomerDetailsClick = (
        leadId: string,
        callBack: (data: any) => void,
    ) => {
        props.dashboardActions('Get_Lead_Detail_By_LeadId_Api', {
            leadId: leadId,
            callBack: callBack,
        });
    };

    const handleFetchDeniedReasons = (callBack: (data: any[]) => void) => {
        console.log('handleFetchDeniedReasons called in Dashboard');
        props.bookingActions('Get_Denied_Reason_List_Api', {
            callBack: callBack,
        });
    };

    const handleFetchFollowUpReasons = (callBack: (data: any[]) => void) => {
        props.bookingActions('Get_FollowUp_Reason_List_Api', {
            callBack: callBack,
        });
    };

    const handleRecharge = () => {
        // Validate amount
        const validation = RazorpayService.validateAmount(
            rechargeAmount,
            selectedType,
        );

        if (!validation.valid) {
            Toast.show({
                type: 'error',
                text1: validation.error || 'Invalid amount',
                visibilityTime: 2000,
            });
            return;
        }

        const amount = parseFloat(rechargeAmount);
        let minAmount = 0;

        if (selectedType === 'wallet') {
            minAmount = parseFloat(minRechargeAmount || '0');
        } else if (selectedType === 'security') {
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

        const userEmail = props.globalState?.email || 'test@example.com';
        const userName = props.globalState?.name || 'Test User';
        const userPhone = props.globalState?.mobile || '9999999999';
        const config =
            selectedType === 'wallet'
                ? RAZORPAY_CONFIG_WALLET
                : RAZORPAY_CONFIG_SECURITY;
        const description =
            selectedType === 'wallet'
                ? config.PRODUCT_INFO
                : config.PRODUCT_INFO;
        const razorpayKey =
            ENV === 'dev' ? config.TEST_KEY_ID : config.TEST_KEY_ID;

        rechargeModalRef.current?.dismiss();

        const userId = String(
            props.globalState?.vendorId || props.globalState?.userId || '',
        );
        const paymentType = selectedType === 'security' ? 'D' : 'R';

        props.walletActions('Create_Razorpay_Order_Id_Api', {
            userId,
            amount: rechargeAmount,
            payment_type: paymentType,
            callBack: (success: boolean, orderId: string, error: any) => {
                if (success && orderId) {
                    RazorpayService.openCheckout({
                        key: razorpayKey,
                        amount: amount * 100,
                        email: userEmail,
                        contact: userPhone,
                        name: userName,
                        description: description,
                        order_id: orderId,
                        paymentType: selectedType,
                    }).then((response) => {
                        if (response.status === 'success') {
                            handleRazorpaySuccess(response, description);
                        } else {
                            handleRazorpayFailure(response);
                        }
                    });
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Order creation failed',
                        text2: error || 'Unable to create payment order',
                        visibilityTime: 3000,
                    });
                }
            },
        });
    };

    const handleRazorpaySuccess = (response: any, description: string) => {
        console.log('Razorpay Success:', response);

        const paymentType = selectedType === 'security' ? 'D' : 'R';

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

                if (selectedType === 'security') {
                    props.walletActions('Insert_Security_Deposit_Api', {
                        amount: rechargeAmount,
                        txnId: response.razorpay_payment_id,
                        callBack: (success: boolean, message: string) => {
                            if (success) {
                                Toast.show({
                                    type: 'success',
                                    text1: 'Payment Successful',
                                    text2: message,
                                    visibilityTime: 3000,
                                });
                                setRechargeAmount('');
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
                            amount: rechargeAmount,
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
                                setRechargeAmount('');
                                load();
                            }
                        },
                    });
                }
            },
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

    return (
        <SafeAreaView style={dashboardStyles.container} edges={['top']}>
            {needsUpdate && <ForceUpdateScreen />}
            <StatusBar
                backgroundColor="transparent"
                barStyle="dark-content"
                translucent={true}
            />

            {/* Full Screen Loader */}
            <Modal
                transparent={true}
                animationType="none"
                visible={isLoading}
                onRequestClose={() => {}}>
                <View style={dashboardStyles.loaderOverlay}>
                    <ActivityIndicator size="large" color="#5F60B9" />
                </View>
            </Modal>
            {/* Header Section - Fixed at top */}
            <View style={dashboardStyles.headerSection}>
                <View style={dashboardStyles.headerContent}>
                    <View style={dashboardStyles.avatarContainer}>
                        <Image
                            source={require('../../assets/img/avatar_profile.png')}
                            style={dashboardStyles.avatarImage}
                        />
                    </View>
                    <View style={dashboardStyles.headerTextContainer}>
                        <Text style={dashboardStyles.greetingText}>
                            Welcome back 👋
                        </Text>
                        <Text style={dashboardStyles.providerName}>
                            {props.globalState.name || 'User'}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                style={dashboardStyles.mainContent}
                contentContainerStyle={dashboardStyles.scrollContent}>
                {/* Wallet Card */}
                <WalletCard
                    balance={walletBalance}
                    onPress={() => navigation.navigate('Wallet')}
                    onRechargePress={() => {
                        setSelectedType('wallet');
                        rechargeModalRef.current?.present();
                        fetchMinRechargeAmount();
                    }}
                />

                {/* Quick Stats Row - Security Deposit & System Charges */}
                <View style={dashboardStyles.statsContainer}>
                    {stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            label={stat.label}
                            value={stat.value}
                            onPress={
                                stat.label === 'Security Deposit'
                                    ? () => {
                                          setSelectedType('security');
                                          setRechargeAmount('5000');
                                          rechargeModalRef.current?.present();
                                      }
                                    : undefined
                            }
                        />
                    ))}
                </View>

                {/* Today's Report Section */}
                <View style={dashboardStyles.sectionHeader}>
                    <Text style={dashboardStyles.sectionTitle}>
                        Today's Report
                    </Text>
                </View>
                <ReportCard
                    ongoing={reportStats.ongoing}
                    newLeads={reportStats.new}
                    revenue={reportStats.revenue}
                    onNewLeadsPress={() =>
                        navigation.navigate('HomeTabs', {
                            screen: 'Bookings',
                            params: { initialTab: 'New' },
                        })
                    }
                    onOngoingLeadsPress={() =>
                        navigation.navigate('HomeTabs', {
                            screen: 'Bookings',
                            params: { initialTab: 'Ongoing' },
                        })
                    }
                    onRevenuePress={() => navigation.navigate('Report')}
                />

                {/* Assigned Service List */}
                <View style={dashboardStyles.sectionHeader}>
                    <Text style={dashboardStyles.sectionTitle}>
                        Ongoing Services
                    </Text>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('HomeTabs', {
                                screen: 'Bookings',
                                params: { initialTab: 'Ongoing' },
                            })
                        }>
                        <Text style={dashboardStyles.viewAllLink}>
                            View all
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Check if there are no services or all services are empty */}
                {assignedServices.length === 0 ||
                !assignedServices[0]?.LeadID ? (
                    <View style={dashboardStyles.emptyStateContainer}>
                        <Image
                            source={require('../../assets/img/OnGoingService.png')}
                            style={dashboardStyles.emptyStateImage}
                        />
                        <Text style={dashboardStyles.emptyStateTitle}>
                            No Ongoing Services
                        </Text>
                        <Text style={dashboardStyles.emptyStateDescription}>
                            You don't have any active services right now. New
                            service requests will appear here once assigned.
                        </Text>
                        <TouchableOpacity
                            style={dashboardStyles.emptyStateButton}
                            onPress={() =>
                                navigation.navigate('HomeTabs', {
                                    screen: 'Bookings',
                                    params: { initialTab: 'New' },
                                })
                            }>
                            <Text style={dashboardStyles.emptyStateButtonText}>
                                View New Leads
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    assignedServices.map((service, index) => (
                        <ServiceCard
                            key={index}
                            leadId={service.LeadID}
                            leadNo={service.LeadNo}
                            leadType={service.ServiceTypeName}
                            leadAmt={service.LeadAmount}
                            leadStatus={service.LeadStatus as 'Ongoing'}
                            leadDate={service.LeadDate}
                            leadCity={
                                service.CityName + ', ' + service.StateName
                            }
                            leadDescription={service.Desc}
                            leadBrand={`${service.BrandName} (${service.ModelName})`}
                            customerName={service.CustomerName}
                            customerMobile={service.MobileNo}
                            customerAddress={service.Address}
                            acceptLeadDate={service.AcceptDate}
                            onAccept={() => handleAcceptService(service.LeadID)}
                            onFollowUp={(data: {
                                nextFollowUpDate: Date;
                                followUpDetails: string;
                            }) => handleFollowUp(service.LeadID, data)}
                            onDenied={(leadId: string, reason: string) =>
                                handleDenied(leadId, reason)
                            }
                            onCompleted={(data: {
                                totalBillAmount: string;
                                serviceDetails: string;
                                otherRemarks: string;
                            }) => handleCompleted(service.LeadID, data)}
                            onCustomerDetailsClick={handleCustomerDetailsClick}
                            onFetchDeniedReasons={handleFetchDeniedReasons}
                            onFetchFollowUpReasons={handleFetchFollowUpReasons}
                        />
                    ))
                )}

                {/* Reviews Section */}
                {/* <View style={dashboardStyles.sectionHeader}>
                    <Text style={dashboardStyles.sectionTitle}>Reviews</Text>
                    <TouchableOpacity>
                        <Text style={dashboardStyles.viewAllLink}>View all</Text>
                    </TouchableOpacity>
                </View>

                {reviews.map((review, index) => (
                    <ReviewCard
                        key={index}
                        customerName={review.customerName}
                        timeAgo={review.timeAgo}
                        rating={review.rating}
                        reviewText={review.reviewText}
                        serviceName={review.serviceName}
                    />
                ))} */}
            </ScrollView>

            <BSModal
                bsModalRef={rechargeModalRef}
                headerTitle="Recharge Wallet"
                snapPoints={['65%']}
                customOnDismiss={() => {
                    setRechargeAmount('');
                    setMinRechargeAmount('');
                }}
                customHandleChangePosition={(index: number) => {}}>
                <View style={dashboardStyles.bottomSheetContent}>
                    <Text style={dashboardStyles.inputLabel}>
                        Select Recharge Type
                    </Text>
                    <View style={dashboardStyles.gatewayContainer}>
                        <TouchableOpacity
                            style={[
                                dashboardStyles.gatewayOption,
                                selectedType === 'wallet' &&
                                    dashboardStyles.gatewayOptionSelected,
                            ]}
                            onPress={() => {
                                setSelectedType('wallet');
                                fetchMinRechargeAmount();
                            }}>
                            <Ionicons
                                name="wallet-outline"
                                size={24}
                                color={
                                    selectedType === 'wallet'
                                        ? '#5F60B9'
                                        : '#1C1F34'
                                }
                            />
                            <Text
                                style={[
                                    dashboardStyles.gatewayText,
                                    selectedType === 'wallet' &&
                                        dashboardStyles.gatewayTextSelected,
                                ]}>
                                Wallet Balance
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                dashboardStyles.gatewayOption,
                                selectedType === 'security' &&
                                    dashboardStyles.gatewayOptionSelected,
                            ]}
                            onPress={() => {
                                setSelectedType('security');
                                setRechargeAmount('5000');
                            }}>
                            <Ionicons
                                name="shield-checkmark-outline"
                                size={24}
                                color={
                                    selectedType === 'security'
                                        ? '#5F60B9'
                                        : '#1C1F34'
                                }
                            />
                            <Text
                                style={[
                                    dashboardStyles.gatewayText,
                                    selectedType === 'security' &&
                                        dashboardStyles.gatewayTextSelected,
                                ]}>
                                Security Deposit
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={dashboardStyles.amountInputContainer}>
                        <Text style={dashboardStyles.inputLabel}>
                            Enter Amount
                            {selectedType === 'wallet' &&
                                minRechargeAmount &&
                                parseFloat(minRechargeAmount) > 0 && (
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            color: '#5F60B9',
                                            fontWeight: '500',
                                        }}>
                                        {' '}
                                        (Minimum: ₹ {minRechargeAmount})
                                    </Text>
                                )}
                            {selectedType === 'security' && (
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: '#5F60B9',
                                        fontWeight: '500',
                                    }}>
                                    {' '}
                                    (Minimum: ₹ 5000)
                                </Text>
                            )}
                        </Text>
                        <BottomSheetTextInput
                            style={dashboardStyles.amountInput}
                            placeholder="₹ 0.00"
                            keyboardType="numeric"
                            value={rechargeAmount}
                            onChangeText={setRechargeAmount}
                        />
                    </View>

                    {selectedType === 'wallet' && amountAsFloat > 0 && (
                        <View style={dashboardStyles.gstContainer}>
                            {isSameState ? (
                                <>
                                    <View style={dashboardStyles.gstRow}>
                                        <Text style={dashboardStyles.gstLabel}>
                                            CGST :
                                        </Text>
                                        <Text style={dashboardStyles.gstValue}>
                                            ₹ {gstPart.toFixed(2)}
                                        </Text>
                                    </View>
                                    <View style={dashboardStyles.gstRow}>
                                        <Text style={dashboardStyles.gstLabel}>
                                            SGST :
                                        </Text>
                                        <Text style={dashboardStyles.gstValue}>
                                            ₹ {gstPart.toFixed(2)}
                                        </Text>
                                    </View>
                                </>
                            ) : (
                                <View style={dashboardStyles.gstRow}>
                                    <Text style={dashboardStyles.gstLabel}>
                                        IGST :
                                    </Text>
                                    <Text style={dashboardStyles.gstValue}>
                                        ₹ {gstPart.toFixed(2)}
                                    </Text>
                                </View>
                            )}
                            <View style={dashboardStyles.gstRow}>
                                <Text style={dashboardStyles.gstLabel}>
                                    Amount after GST :
                                </Text>
                                <Text style={dashboardStyles.gstValue}>
                                    ₹ {baseAmount.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    )}

                    <TouchableOpacity
                        style={dashboardStyles.rechargeButton}
                        onPress={handleRecharge}>
                        <Text style={dashboardStyles.rechargeButtonText}>
                            Recharge
                        </Text>
                    </TouchableOpacity>
                </View>
            </BSModal>
        </SafeAreaView>
    );
};

const mapStateToProps = (state: RootState) => ({
    globalState: state.globalState,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    dashboardActions: dashboardActions_dispatch(dispatch),
    walletActions: walletActions_dispatch(dispatch),
    bookingActions: bookingActions_dispatch(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
