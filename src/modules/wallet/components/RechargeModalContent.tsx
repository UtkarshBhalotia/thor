import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { walletStyles } from '../../../assets/css/walletStyles';
import { dashboardStyles } from '../../../assets/css/dashboardStyles';
import { Comp_State_ID } from '../../../services/env';

interface RechargeModalContentProps {
    minRechargeAmount: string;
    onRecharge: (amount: string, gateway: 'payumoney' | 'razorpay') => void;
    userStateId?: string;
}

const RechargeModalContent: React.FC<RechargeModalContentProps> = ({
    minRechargeAmount,
    onRecharge,
    userStateId,
}) => {
    const [rechargeAmount, setRechargeAmount] = useState(minRechargeAmount || '');
    const [selectedGateway, setSelectedGateway] = useState<'payumoney' | 'razorpay'>('payumoney');

    const { amountAsFloat, baseAmount, gstPart } = useMemo(() => {
        const amount = parseFloat(rechargeAmount) || 0;
        const base = amount / 1.18;
        const totalGst = amount - base;
        const gst = totalGst / 2;
        return { amountAsFloat: amount, baseAmount: base, gstPart: gst };
    }, [rechargeAmount]);

    const isSameState = useMemo(() => String(userStateId) === String(Comp_State_ID), [userStateId]);

    const handleRechargePress = useCallback(() => {
        onRecharge(rechargeAmount, selectedGateway);
    }, [onRecharge, rechargeAmount, selectedGateway]);

    return (
        <View style={walletStyles.bottomSheetContent}>
            <Text style={walletStyles.inputLabel}>Select Recharge Type</Text>
            <View style={walletStyles.gatewayContainer}>
                <TouchableOpacity
                    style={[
                        walletStyles.gatewayOption,
                        selectedGateway === 'payumoney' && walletStyles.gatewayOptionSelected,
                    ]}
                    onPress={() => setSelectedGateway('payumoney')}>
                    <Ionicons
                        name="wallet-outline"
                        size={24}
                        color={selectedGateway === 'payumoney' ? '#5F60B9' : '#1C1F34'}
                    />
                    <Text
                        style={[
                            walletStyles.gatewayText,
                            selectedGateway === 'payumoney' && walletStyles.gatewayTextSelected,
                        ]}>
                        Wallet Balance
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        walletStyles.gatewayOption,
                        selectedGateway === 'razorpay' && walletStyles.gatewayOptionSelected,
                    ]}
                    onPress={() => {
                        setSelectedGateway('razorpay');
                        setRechargeAmount('5000');
                    }}>
                    <Ionicons
                        name="shield-checkmark-outline"
                        size={24}
                        color={selectedGateway === 'razorpay' ? '#5F60B9' : '#1C1F34'}
                    />
                    <Text
                        style={[
                            walletStyles.gatewayText,
                            selectedGateway === 'razorpay' && walletStyles.gatewayTextSelected,
                        ]}>
                        Security Deposit
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={walletStyles.amountInputContainer}>
                <Text style={walletStyles.inputLabel}>
                    Enter Amount
                    {selectedGateway === 'payumoney' &&
                        parseFloat(minRechargeAmount) > 0 && (
                            <Text style={{ fontSize: 14, color: '#5F60B9', fontWeight: '500' }}>
                                {' '}
                                (Minimum: ₹ {minRechargeAmount})
                            </Text>
                        )}
                    {selectedGateway === 'razorpay' && (
                        <Text style={{ fontSize: 14, color: '#5F60B9', fontWeight: '500' }}>
                            {' '}
                            (Minimum: ₹ 5000)
                        </Text>
                    )}
                </Text>
                <BottomSheetTextInput
                    style={walletStyles.amountInput}
                    placeholder="₹ 0.00"
                    keyboardType="numeric"
                    value={rechargeAmount}
                    onChangeText={setRechargeAmount}
                />
            </View>

            {selectedGateway === 'payumoney' && amountAsFloat > 0 && (
                <View style={dashboardStyles.gstContainer}>
                    {isSameState ? (
                        <>
                            <View style={dashboardStyles.gstRow}>
                                <Text style={dashboardStyles.gstLabel}>CGST :</Text>
                                <Text style={dashboardStyles.gstValue}>₹ {gstPart.toFixed(2)}</Text>
                            </View>
                            <View style={dashboardStyles.gstRow}>
                                <Text style={dashboardStyles.gstLabel}>SGST :</Text>
                                <Text style={dashboardStyles.gstValue}>₹ {gstPart.toFixed(2)}</Text>
                            </View>
                        </>
                    ) : (
                        <View style={dashboardStyles.gstRow}>
                            <Text style={dashboardStyles.gstLabel}>IGST :</Text>
                            <Text style={dashboardStyles.gstValue}>₹ {gstPart.toFixed(2)}</Text>
                        </View>
                    )}
                    <View style={dashboardStyles.gstRow}>
                        <Text style={dashboardStyles.gstLabel}>Amount after GST :</Text>
                        <Text style={dashboardStyles.gstValue}>₹ {baseAmount.toFixed(2)}</Text>
                    </View>
                </View>
            )}

            <TouchableOpacity style={walletStyles.rechargeActionButton} onPress={handleRechargePress}>
                <Text style={walletStyles.rechargeActionButtonText}>Recharge</Text>
            </TouchableOpacity>
        </View>
    );
};

export default React.memo(RechargeModalContent);
