import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    InteractionManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dashboardStyles } from '../../assets/css/dashboardStyles';
import WalletCard from './components/WalletCard';
import StatCard from './components/StatCard';
import ServiceCard from './components/ServiceCard';
import ReviewCard from './components/ReviewCard';
import ReportCard from './components/ReportCard';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppDispatch, RootState } from '../../../store';
import { connect } from 'react-redux';
import { dashboardActions_dispatch } from '../../../store/action/mainTypedAction';
import BSModal from '../../components/BSModal';
import { BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';

const Dashboard = (props: any) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const rechargeModalRef = React.useRef<BottomSheetModal>(null);
    const [rechargeAmount, setRechargeAmount] = useState('');

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
        const task = InteractionManager.runAfterInteractions(() => {
            load();
        });
        return () => {
            task.cancel();
        };
    }, []);

    const load = () => {
        props.dashboardActions('Wallet_Balance_Api', {
            callBack: (wB: any) => {
                setWalletBalance(wB);
                props.dashboardActions('Total_Security_Deposit_Api', {
                    callBack: (data: any) => {
                        setTotalSecurityDeposit(data);
                        fetchReportData();
                        props.dashboardActions(
                            'Get_OnGoing_Services_List_Api',
                            {
                                callBack: (data: any) => {
                                    setAssignedServices(data);
                                },
                            },
                        );
                    },
                });
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

        props.dashboardActions('Get_Work_Report_For_Vendor_Api', {
            fromDate: todayFormatted,
            toDate: todayFormatted,
            callBack: (data: {
                ongoing: number;
                new: number;
                revenue: number;
            }) => {
                setReportStats({
                    ongoing: data.ongoing,
                    new: data.new,
                    revenue: data.revenue,
                });
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

    const handleFollowUp = (serviceId: string) => {
        console.log('Follow up service:', serviceId);
        // Add your follow up logic here
    };

    const handleDenied = (serviceId: string) => {
        console.log('Denied service:', serviceId);
        // Add your denied logic here
    };

    const handleCompleted = (serviceId: string) => {
        console.log('Completed service:', serviceId);
        // Add your completed logic here
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

    const handleRecharge = () => {
        console.log('Recharge amount:', rechargeAmount);
        // Add your recharge logic here
        rechargeModalRef.current?.dismiss();
    };

    return (
        <SafeAreaView style={dashboardStyles.container} edges={['top']}>
            {/* Header Section - Fixed at top */}
            <View style={dashboardStyles.headerSection}>
                <View style={dashboardStyles.headerContent}>
                    <View style={dashboardStyles.avatarContainer}>
                        <Text style={dashboardStyles.avatarText}>
                            {props.globalState.name
                                ? props.globalState.name.charAt(0).toUpperCase()
                                : 'U'}
                        </Text>
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
                contentContainerStyle={dashboardStyles.scrollContent}>
                {/* Wallet Card */}
                <WalletCard
                    balance={walletBalance}
                    onPress={() => navigation.navigate('Wallet')}
                    onRechargePress={() => rechargeModalRef.current?.present()}
                />

                {/* Quick Stats Row - Security Deposit & System Charges */}
                <View style={dashboardStyles.statsContainer}>
                    {stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            label={stat.label}
                            value={stat.value}
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
                />

                {/* Assigned Service List */}
                <View style={dashboardStyles.sectionHeader}>
                    <Text style={dashboardStyles.sectionTitle}>
                        Ongoing Services
                    </Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Booking')}>
                        <Text style={dashboardStyles.viewAllLink}>
                            View all
                        </Text>
                    </TouchableOpacity>
                </View>

                {assignedServices.map((service, index) => (
                    <ServiceCard
                        key={index}
                        leadId={service.LeadID}
                        leadNo={service.LeadNo}
                        leadType={service.ServiceTypeName}
                        leadAmt={service.LeadAmount}
                        leadStatus={service.LeadStatus as 'Ongoing'}
                        leadDate={service.LeadDate}
                        leadCity={service.CityName + ', ' + service.StateName}
                        leadDescription={service.Desc}
                        leadBrand={`${service.BrandName} (${service.ModelName})`}
                        customerName={service.CustomerName}
                        customerMobile={service.MobileNo}
                        customerAddress={service.Address}
                        acceptLeadDate={service.AcceptDate}
                        onAccept={() => handleAcceptService(service.LeadID)}
                        onRefuse={() => handleRefuseService(service.LeadID)}
                        onFollowUp={() => handleFollowUp(service.LeadID)}
                        onDenied={() => handleDenied(service.LeadID)}
                        onCompleted={() => handleCompleted(service.LeadID)}
                        onCustomerDetailsClick={handleCustomerDetailsClick}
                    />
                ))}

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
                snapPoints={['40%']}>
                <View style={dashboardStyles.bottomSheetContent}>
                    <View style={dashboardStyles.amountInputContainer}>
                        <Text style={dashboardStyles.inputLabel}>
                            Enter Amount
                        </Text>
                        <BottomSheetTextInput
                            style={dashboardStyles.amountInput}
                            placeholder="₹ 0.00"
                            keyboardType="numeric"
                            value={rechargeAmount}
                            onChangeText={setRechargeAmount}
                        />
                    </View>
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
    // loginActions_dispatch: loginActions_dispatch(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
