import React from 'react';
import { View, Text } from 'react-native';
import { walletStyles } from '../../../assets/css/walletStyles';

interface PaymentHistoryCardProps {
    tranDate: string;
    amount: string;
    remarks: string;
    paymentId: string;
    entryType: string;
    balance: string;
    drCr: string;
}

const PaymentHistoryCard: React.FC<PaymentHistoryCardProps> = ({
    tranDate,
    amount,
    entryType,
    balance,
    drCr,
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
        drCr !== 'Opening' && (
            <View style={walletStyles.paymentCard}>
                <View style={walletStyles.paymentHeader}>
                    <Text style={walletStyles.transactionType}>
                        {entryType || 'Transaction'}
                    </Text>
                    <Text
                        style={[
                            walletStyles.transactionAmount,
                            drCr === 'Credit'
                                ? walletStyles.transactionAmountCredit
                                : walletStyles.transactionAmountDebit,
                        ]}>
                        {formatAmount(amount, drCr === 'Credit')}
                    </Text>
                </View>

                <View style={walletStyles.dateTimeBalanceRow}>
                    <Text style={walletStyles.transactionDateTime}>
                        {tranDate}
                    </Text>
                    <Text style={walletStyles.currentBalance}>
                        Balance: ₹{balance}
                    </Text>
                </View>
            </View>
        )
    );
};

export default PaymentHistoryCard;
