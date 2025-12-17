import React, { useEffect } from 'react';
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
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AppDispatch, RootState } from '../../../store';
import { connect } from 'react-redux';

const Dashboard = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    // Sample data - replace with actual data from API/Redux
    const providerName = 'John Williams';
    const walletBalance = '$2,562.23';

    const stats = [
        { label: "Today's service", value: 5 },
        { label: 'Total Bookings', value: 50 },
        { label: 'Total Earnings', value: '$350.60' },
    ];

    const assignedServices = [
        {
            serviceId: '#58961',
            serviceName: 'Curtain Cleaning',
            price: '$22.00',
            discount: '(10% off)',
            status: 'Pending' as const,
            dateTime: '6 Aug, 2024 - 5:20 pm',
            location: 'California - USA',
            receivableAmount: '$30.23',
            customerName: 'Stella Milevski',
            isPackage: true,
        },
        {
            serviceId: '#58962',
            serviceName: 'House Hold Cook',
            price: '$20.00',
            discount: '(10% off)',
            status: 'Pending' as const,
            dateTime: '7 Aug, 2024 - 11:00 am',
            location: 'California - USA',
            receivableAmount: '$30.23',
            customerName: 'Kate Tanner',
            isPackage: false,
        },
        {
            serviceId: '#58964',
            serviceName: 'Hair Cutting & Spa',
            price: '$30.00',
            discount: '(10% off)',
            status: 'Pending' as const,
            dateTime: '7 Aug, 2024 - 2:00 pm',
            location: 'California - USA',
            receivableAmount: '$30.23',
            customerName: 'Willie Tanner',
            isPackage: false,
        },
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
        console.log('Loading dashboard data...');

    };

    const handleAcceptService = (serviceId: string) => {
        console.log('Accept service:', serviceId);
        // Add your accept logic here
    };

    const handleRefuseService = (serviceId: string) => {
        console.log('Refuse service:', serviceId);
        // Add your refuse logic here
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
                        <Text style={dashboardStyles.providerName}>{providerName}</Text>
                        <TouchableOpacity>
                            <Text style={dashboardStyles.providerDetailsLink}>
                                Your provider details
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Wallet Card */}
                <WalletCard
                    balance={walletBalance}
                    onPress={() => navigation.navigate('Wallet')}
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
                                if (stat.label === 'Total Bookings') {
                                    navigation.navigate('Booking');
                                } else if (stat.label === 'Total Earnings') {
                                    navigation.navigate('Wallet');
                                } else {
                                    console.log('Stat pressed:', stat.label);
                                }
                            }}
                        />
                    ))}
                </View>

                {/* Assigned Service List */}
                <View style={dashboardStyles.sectionHeader}>
                    <Text style={dashboardStyles.sectionTitle}>Assigned service list</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Booking')}>
                        <Text style={dashboardStyles.viewAllLink}>View all</Text>
                    </TouchableOpacity>
                </View>

                {assignedServices.map((service, index) => (
                    <ServiceCard
                        key={index}
                        serviceId={service.serviceId}
                        serviceName={service.serviceName}
                        price={service.price}
                        discount={service.discount}
                        status={service.status}
                        dateTime={service.dateTime}
                        location={service.location}
                        receivableAmount={service.receivableAmount}
                        customerName={service.customerName}
                        isPackage={service.isPackage}
                        onAccept={() => handleAcceptService(service.serviceId)}
                        onRefuse={() => handleRefuseService(service.serviceId)}
                    />
                ))}

                {/* Reviews Section */}
                <View style={dashboardStyles.sectionHeader}>
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
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

const mapStateToProps = (state: RootState) => ({
    globalState: state.globalState,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    // loginActions_dispatch: loginActions_dispatch(dispatch),
});

export default connect(mapStateToProps)(Dashboard);
