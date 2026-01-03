import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    InteractionManager,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { walletStyles } from '../../assets/css/walletStyles';
import PaymentHistoryCard from './components/PaymentHistoryCard';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppDispatch, RootState } from '../../../store';
import { connect } from 'react-redux';
import { walletActions_dispatch } from '../../../store/action/mainTypedAction';
import BSModal from '../../components/BSModal';
import { BottomSheetModal, BottomSheetTextInput } from '@gorhom/bottom-sheet';

const Wallet = (props: any) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const rechargeModalRef = React.useRef<BottomSheetModal>(null);
    const [rechargeAmount, setRechargeAmount] = useState('');

    // State management
    const [walletBalance, setWalletBalance] = useState('');
    const [rechargeHistory, setRechargeHistory] = useState<IRechargeHistoryItem[]>([]);

    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            load();
        });
        return () => {
            task.cancel();
        };
    }, []);

    const load = () => {
        // Fetch wallet balance
        props.walletActions('Wallet_Balance_Api', {
            callBack: (balance: string) => {
                setWalletBalance(balance);
                // Fetch recharge history after wallet balance
                props.walletActions('Get_Recharge_History_Api', {
                    callBack: (data: IRechargeHistoryItem[]) => {
                        console.log('Recharge history:', data);
                        setRechargeHistory(data);
                    }
                });
            }
        });
    };

    const handleRecharge = () => {
        console.log('Recharge amount:', rechargeAmount);
        // Add your recharge logic here
        rechargeModalRef.current?.dismiss();
    };

    // const handlePaymentPress = (recharge: IRechargeHistoryItem) => {
    //     console.log('Recharge pressed:', recharge.RechargeID);
    //     // Navigate to recharge details screen if needed
    // };

    const renderEmptyList = () => (
        <View style={walletStyles.emptyContainer}>
            <Text style={walletStyles.emptyText}>No recharge history found</Text>
        </View>
    );

    return (
        <SafeAreaView style={walletStyles.container} edges={['top']}>
            {/* Header with Back Button */}
            <View style={[walletStyles.header, { flexDirection: 'row', alignItems: 'center' }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        padding: 8,
                        marginRight: 12,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <Ionicons name="chevron-back" size={24} color="#1C1F34" />
                </TouchableOpacity>
                <Text style={walletStyles.headerTitle}>Recharge History</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1 }}
            >
                {/* Wallet Balance Card */}
                <View style={walletStyles.balanceCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Text style={walletStyles.balanceLabel}>Wallet Balance</Text>
                            <Text style={walletStyles.balanceAmount}>₹ {walletBalance}</Text>
                        </View>
                        <TouchableOpacity
                            style={walletStyles.walletRechargeButton}
                            onPress={() => rechargeModalRef.current?.present()}
                        >
                            <Ionicons
                                name="add-circle-outline"
                                size={18}
                                color="#FFFFFF"
                                style={walletStyles.walletRechargeIcon}
                            />
                            <Text style={walletStyles.walletRechargeText}>Recharge Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recharge History Section */}
                <View style={walletStyles.sectionHeader}>
                    <Text style={walletStyles.sectionTitle}>Recharge History</Text>
                </View>

                {/* Recharge History List */}
                {rechargeHistory.length > 0 ? (
                    rechargeHistory.map((item) => (
                        <PaymentHistoryCard
                            key={item.TxnID}
                            tranDate={item.Date}
                            amount={`₹ ${item.Amount}`}
                            remarks={item.Remarks}
                            paymentId={item.TxnID}
                        />
                    ))
                ) : (
                    renderEmptyList()
                )}
            </ScrollView>

            <BSModal
                bsModalRef={rechargeModalRef}
                headerTitle="Recharge Wallet"
                snapPoints={['40%']}
            >
                <View style={walletStyles.bottomSheetContent}>
                    <View style={walletStyles.amountInputContainer}>
                        <Text style={walletStyles.inputLabel}>Enter Amount</Text>
                        <BottomSheetTextInput
                            style={walletStyles.amountInput}
                            placeholder="₹ 0.00"
                            keyboardType="numeric"
                            value={rechargeAmount}
                            onChangeText={setRechargeAmount}
                        />
                    </View>
                    <TouchableOpacity
                        style={walletStyles.rechargeActionButton}
                        onPress={handleRecharge}
                    >
                        <Text style={walletStyles.rechargeActionButtonText}>Recharge</Text>
                    </TouchableOpacity>
                </View>
            </BSModal>
        </SafeAreaView>
    );
};

const mapStateToProps = (state: RootState) => ({
    globalState: state.globalState,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    walletActions: walletActions_dispatch(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
