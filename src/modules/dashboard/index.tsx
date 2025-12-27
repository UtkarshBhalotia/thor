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
    const [totalSecurityDeposit, setTotalSecurityDeposit] = useState({ DepositeAmt: '', MaintenanceAmt: '' });
    const [reportStats, setReportStats] = useState({ ongoing: 0, new: 0, revenue: 0 });
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
            CustomerName: ''
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
            reviewText: 'I just love their service & the staff nature for work, I\'d like to hire them again',
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
                        props.dashboardActions('Get_OnGoing_Services_List_Api', {
                            callBack: (data: any) => {
                                setAssignedServices(data);
                            }
                        });
                    }
                });
            }
        });
    };

    const fetchReportData = () => {
        // Fetch ongoing count
        props.dashboardActions('Get_OnGoing_Services_List_Api', {
            callBack: (data: any[]) => {
                const ongoingCount = data.length;
                // Fetch new leads count
                props.dashboardActions('Get_New_Leads_List_Api', {
                    callBack: (newData: any[]) => {
                        const newCount = newData.length;
                        // Fetch completed leads for revenue (Today's revenue)
                        props.dashboardActions('Get_Completed_Services_List_Api', {
                            callBack: (compData: any[]) => {
                                // Simple revenue calculation (sum of LeadAmount or similar)
                                // Filter for today if possible, or just sum the list if it's already filtered by API
                                const revenue = compData.reduce((acc, lead) => acc + (parseFloat(lead.CustomerAmount) || 0), 0);
                                setReportStats({
                                    ongoing: ongoingCount,
                                    new: newCount,
                                    revenue: revenue
                                });
                            }
                        });
                    }
                });
            }
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

    const handleRecharge = () => {
        console.log('Recharge amount:', rechargeAmount);
        // Add your recharge logic here
        rechargeModalRef.current?.dismiss();
    };

    return (
        <SafeAreaView style={dashboardStyles.container} edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={dashboardStyles.scrollContent}
            >
                {/* Header Section */}
                <View style={dashboardStyles.headerSection}>
                    <Text style={dashboardStyles.greetingText}>Hello, there !!</Text>
                    <View style={dashboardStyles.providerContainer}>
                        <Text style={dashboardStyles.providerName}>{props.globalState.name}</Text>
                    </View>
                </View>

                {/* Wallet Card */}
                <WalletCard
                    balance={walletBalance}
                    onPress={() => navigation.navigate('Wallet')}
                    onRechargePress={() => rechargeModalRef.current?.present()}
                />

                {/* Today's Report */}
                <View style={dashboardStyles.sectionHeader}>
                    <Text style={dashboardStyles.sectionTitle}>Today's Report</Text>
                </View>
                <ReportCard
                    ongoing={reportStats.ongoing}
                    newLeads={reportStats.new}
                    revenue={reportStats.revenue}
                />

                {/* Quick Stats */}
                <View style={dashboardStyles.statsContainer}>
                    {stats.map((stat, index) => (
                        <StatCard
                            key={index}
                            label={stat.label}
                            value={stat.value}
                            onPress={() => {
                                // Navigate to respective screens
                                // if (stat.label === 'Total Bookings') {
                                //     navigation.navigate('Booking');
                                // } else if (stat.label === 'Total Earnings') {
                                //     navigation.navigate('Wallet');
                                // } else {
                                //     console.log('Stat pressed:', stat.label);
                                // }
                            }}
                        />
                    ))}
                </View>

                {/* Assigned Service List */}
                <View style={dashboardStyles.sectionHeader}>
                    <Text style={dashboardStyles.sectionTitle}>Ongoing Services List</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Booking')}>
                        <Text style={dashboardStyles.viewAllLink}>View all</Text>
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
                        onAccept={() => handleAcceptService(service.LeadID)}
                        onRefuse={() => handleRefuseService(service.LeadID)}
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
                snapPoints={['40%']}
            >
                <View style={dashboardStyles.bottomSheetContent}>
                    <View style={dashboardStyles.amountInputContainer}>
                        <Text style={dashboardStyles.inputLabel}>Enter Amount</Text>
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
                        onPress={handleRecharge}
                    >
                        <Text style={dashboardStyles.rechargeButtonText}>Recharge</Text>
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
