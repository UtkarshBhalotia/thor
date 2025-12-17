import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { dashboardStyles } from '../../../assets/css/dashboardStyles';

interface WalletCardProps {
    balance: string;
    onPress?: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({ balance, onPress }) => {
    const CardWrapper = onPress ? TouchableOpacity : View;

    return (
        <CardWrapper
            style={dashboardStyles.walletCard}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <Text style={dashboardStyles.walletLabel}>Today's wallet bal.</Text>
            <Text style={dashboardStyles.walletBalance}>{balance}</Text>
        </CardWrapper>
    );
};

export default WalletCard;
