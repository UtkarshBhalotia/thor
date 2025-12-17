import React from 'react';
import {
    View,
    Text,
    ScrollView,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { walletStyles } from '../../assets/css/walletStyles';
import PaymentHistoryCard, { PaymentStatus } from './components/PaymentHistoryCard';
import { NavigationProp, useNavigation } from '@react-navigation/native';

interface PaymentHistory {
    id: string;
    serviceName: string;
    amount: string;
    bookingId: string;
    paymentId: string;
    methodType: string;
    status: PaymentStatus;
    customerName: string;
}

const Wallet = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    // Sample data - replace with actual data from API/Redux
    const walletBalance = '$2,562.23';

    const paymentHistory: PaymentHistory[] = [
        {
            id: '1',
            serviceName: 'Furnishing & carpentry',
            amount: '$25.30',
            bookingId: '#032',
            paymentId: '#1520',
            methodType: 'Wallet',
            status: 'Paid',
            customerName: 'Stella Milevski',
        },
        {
            id: '2',
            serviceName: 'Wall painting',
            amount: '$10.45',
            bookingId: '#032',
            paymentId: '#1548',
            methodType: 'Wallet',
            status: 'Advance Paid',
            customerName: 'Lynn Tanner',
        },
        {
            id: '3',
            serviceName: 'Chimney Sweeping',
            amount: '$20.10',
            bookingId: '#035',
            paymentId: '#1560',
            methodType: 'Wallet',
            status: 'Paid',
            customerName: 'Michael Knight',
        },
    ];

    const handlePaymentPress = (payment: PaymentHistory) => {
        console.log('Payment pressed:', payment.paymentId);
        // Navigate to payment details screen
        // navigation.navigate('PaymentDetails', { paymentId: payment.id });
    };

    const renderPaymentCard = ({ item }: { item: PaymentHistory }) => (
        <PaymentHistoryCard
            serviceName={item.serviceName}
            amount={item.amount}
            bookingId={item.bookingId}
            paymentId={item.paymentId}
            methodType={item.methodType}
            status={item.status}
            customerName={item.customerName}
            onPress={() => handlePaymentPress(item)}
        />
    );

    const renderEmptyList = () => (
        <View style={walletStyles.emptyContainer}>
            <Text style={walletStyles.emptyText}>No payment history found</Text>
        </View>
    );

    return (
        <SafeAreaView style={walletStyles.container} edges={['top']}>
            {/* Header */}
            <View style={walletStyles.header}>
                <Text style={walletStyles.headerTitle}>Wallet Balance</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {/* Wallet Balance Card */}
                <View style={walletStyles.balanceCard}>
                    <Text style={walletStyles.balanceLabel}>Today's wallet bal.</Text>
                    <Text style={walletStyles.balanceAmount}>{walletBalance}</Text>
                </View>

                {/* Payment History Section */}
                <View style={walletStyles.sectionHeader}>
                    <Text style={walletStyles.sectionTitle}>Payment History</Text>
                </View>

                {/* Payment History List */}
                {paymentHistory.length > 0 ? (
                    paymentHistory.map((item) => (
                        <PaymentHistoryCard
                            key={item.id}
                            serviceName={item.serviceName}
                            amount={item.amount}
                            bookingId={item.bookingId}
                            paymentId={item.paymentId}
                            methodType={item.methodType}
                            status={item.status}
                            customerName={item.customerName}
                            onPress={() => handlePaymentPress(item)}
                        />
                    ))
                ) : (
                    renderEmptyList()
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default Wallet;
