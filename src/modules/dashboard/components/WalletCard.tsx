import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { dashboardStyles } from '../../../assets/css/dashboardStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface WalletCardProps {
    balance: string;
    openingBalance?: string;
    onPress?: () => void;
    onRechargePress?: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({ balance, openingBalance, onPress, onRechargePress }) => {
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
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Ionicons
                            name="wallet-outline"
                            size={18}
                            color="#FFFFFF"
                            style={{ marginRight: 6 }}
                        />
                        <Text style={dashboardStyles.walletLabel}>Wallet Balance</Text>
                    </View>
                    <Text style={dashboardStyles.walletBalance}>₹ {balance}</Text>

                    {openingBalance && (
                        <Text style={[dashboardStyles.walletLabel, { marginTop: 8, opacity: 0.9 }]}>
                            Opening Balance: ₹ {openingBalance}
                        </Text>
                    )}
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

export default React.memo(WalletCard);
