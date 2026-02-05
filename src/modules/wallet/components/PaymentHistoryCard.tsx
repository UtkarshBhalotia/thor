import React from 'react';
import { View, Text } from 'react-native';
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

    // Format amount with CR/DR suffix
    const formatAmount = (amt: string | number, credit: boolean) => {
        const sign = credit ? '+' : '-';
        const suffix = credit ? ' CR' : ' DR';
        const safeAmt = (amt ?? '0').toString();
        const numericAmount = parseFloat(safeAmt.replace(/[₹,\s]/g, '') || '0');
        const formattedAmount = numericAmount.toLocaleString('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return `${sign}₹${formattedAmount}${suffix}`;
    };

    return (
       
            <View style={walletStyles.paymentCard}>
                <View style={walletStyles.paymentHeader}>
                    <Text style={walletStyles.transactionType}>
                        {tranDate}
                    </Text>
                    <Text
                        style={[
                            walletStyles.transactionAmount,
                            walletStyles.transactionAmountCredit
                        ]}>
                         ₹{amount}
                    </Text>
                </View>

                <View style={walletStyles.dateTimeBalanceRow}>
                    <Text style={walletStyles.transactionDateTime}>
                        {'Wallet Recharge'}
                    </Text>
                </View>

                 <View style={walletStyles.dateTimeBalanceRow}>
                    <Text style={walletStyles.currentBalance}>
                        {paymentId}
                    </Text>
                </View>
            </View>
        
    )
};

export default React.memo(PaymentHistoryCard);
