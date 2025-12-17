import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { walletStyles } from '../../../assets/css/walletStyles';

export type PaymentStatus = 'Paid' | 'Advance Paid' | 'Pending';

interface PaymentHistoryCardProps {
    serviceName: string;
    amount: string;
    bookingId: string;
    paymentId: string;
    methodType: string;
    status: PaymentStatus;
    customerName: string;
    onPress?: () => void;
}

const PaymentHistoryCard: React.FC<PaymentHistoryCardProps> = ({
    serviceName,
    amount,
    bookingId,
    paymentId,
    methodType,
    status,
    customerName,
    onPress,
}) => {
    // Get initials from customer name
    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Get status badge styles
    const getStatusStyles = () => {
        switch (status) {
            case 'Paid':
                return {
                    badge: walletStyles.statusPaid,
                    text: walletStyles.statusTextPaid,
                };
            case 'Advance Paid':
                return {
                    badge: walletStyles.statusAdvancePaid,
                    text: walletStyles.statusTextAdvancePaid,
                };
            case 'Pending':
                return {
                    badge: walletStyles.statusPending,
                    text: walletStyles.statusTextPending,
                };
            default:
                return {
                    badge: walletStyles.statusPending,
                    text: walletStyles.statusTextPending,
                };
        }
    };

    const statusStyles = getStatusStyles();

    const CardWrapper = onPress ? TouchableOpacity : View;

    return (
        <CardWrapper
            style={walletStyles.paymentCard}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            {/* Payment Header */}
            <View style={walletStyles.paymentHeader}>
                <View style={walletStyles.paymentLeft}>
                    <Text style={walletStyles.serviceName}>{serviceName}</Text>
                    <Text style={walletStyles.bookingId}>{bookingId}</Text>
                </View>
                <Text style={walletStyles.paymentAmount}>{amount}</Text>
            </View>

            {/* Payment Details */}
            <View style={walletStyles.detailsGrid}>
                {/* Payment ID */}
                <View style={walletStyles.detailRow}>
                    <View style={walletStyles.detailItem}>
                        <Text style={walletStyles.detailLabel}>Payment ID</Text>
                        <Text style={walletStyles.detailValue}>{paymentId}</Text>
                    </View>
                </View>

                {/* Method Type */}
                <View style={walletStyles.detailRow}>
                    <View style={walletStyles.detailItem}>
                        <Text style={walletStyles.detailLabel}>Method type</Text>
                        <Text style={walletStyles.detailValue}>{methodType}</Text>
                    </View>
                </View>

                {/* Status */}
                <View style={walletStyles.detailRow}>
                    <View style={walletStyles.detailItem}>
                        <Text style={walletStyles.detailLabel}>Status</Text>
                        <View style={[walletStyles.statusBadge, statusStyles.badge]}>
                            <Text style={[walletStyles.statusText, statusStyles.text]}>
                                {status}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Customer Info */}
            <View style={walletStyles.customerContainer}>
                <View style={walletStyles.customerAvatar}>
                    <Text style={walletStyles.customerAvatarText}>
                        {getInitials(customerName)}
                    </Text>
                </View>
                <View style={walletStyles.customerInfo}>
                    <Text style={walletStyles.customerLabel}>Customer</Text>
                    <Text style={walletStyles.customerName}>{customerName}</Text>
                </View>
            </View>
        </CardWrapper>
    );
};

export default PaymentHistoryCard;
