import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { dashboardStyles } from '../../../assets/css/dashboardStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface WalletCardProps {
    balance: string;
    onPress?: () => void;
    onRechargePress?: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({ balance, onPress, onRechargePress }) => {
    console.log('WalletCard', balance);
    const CardWrapper = onPress ? TouchableOpacity : View;

    return (
        <CardWrapper
            style={dashboardStyles.walletCard}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}>

            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <View>
                    <Text style={dashboardStyles.walletLabel}>Wallet Balance</Text>
                    <Text style={dashboardStyles.walletBalance}>₹ {balance}</Text>
                </View>
                <TouchableOpacity
                    style={dashboardStyles.walletRechargeButton}
                    onPress={onRechargePress}
                >
                    <Ionicons
                        name="add-circle-outline"
                        size={18}
                        color="#FFFFFF"
                        style={dashboardStyles.walletRechargeIcon}
                    />
                    <Text style={dashboardStyles.walletRechargeText}>Recharge Now</Text>
                </TouchableOpacity>
            </View>
        </CardWrapper>
    );
};

export default WalletCard;
