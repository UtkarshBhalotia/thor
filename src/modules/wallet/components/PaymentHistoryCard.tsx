import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { walletStyles } from '../../../assets/css/walletStyles';


interface PaymentHistoryCardProps {
    tranDate: string;
    amount: string;
    remarks: string;
    paymentId: string;
}

const PaymentHistoryCard: React.FC<PaymentHistoryCardProps> = ({
    tranDate,
    amount,
    remarks,
    paymentId,

}) => {


    return (
        <View
            style={walletStyles.paymentCard}

        >
            {/* Payment Header */}
            <View style={walletStyles.paymentHeader}>
                <View style={walletStyles.paymentLeft}>
                    <Text style={walletStyles.serviceName}>{tranDate}</Text>
                    {/* <Text style={walletStyles.bookingId}>{remarks}</Text> */}
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

            </View>
        </View>
    );
};

export default PaymentHistoryCard;
