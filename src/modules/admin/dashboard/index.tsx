import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Image, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ErrorBoundary from '../../../components/ErrorBoundary';
import LogoutModal from '../../../components/LogoutModal';
import SODTextInput from '../../../components/SODTextInput';
import BSModal from '../../../components/BSModal';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigations/navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { clearAll } from '../../../utils/storage';
import { RootState } from '../../../../store';

const AdminDashboard = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const globalState = useSelector((state: RootState) => state.globalState);
    
    // Bottom sheet refs
    const actionModalRef = useRef<BottomSheetModal>(null);
    
    // State
    const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
    const [quickMessage, setQuickMessage] = useState('');

    const handleLogout = async () => {
        setLogoutModalVisible(false);
        await clearAll();
        dispatch({ type: 'GLOBAL_RESET' });
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    const adminStats = [
        { label: 'Total Partners', value: '1,248', icon: 'people', color: '#4CAF50', route: 'AdminPartnerList' },
        { label: 'Active Leads', value: '342', icon: 'document-text', color: '#FF9800', route: 'AdminLeadList' },
        { label: 'Completed Today', value: '89', icon: 'checkmark-circle', color: '#2196F3', route: 'AdminLeadHistory' },
        { label: 'System Alerts', value: '3', icon: 'alert-circle', color: '#F44336', route: 'AdminMore' },
    ];

    return (
        <ErrorBoundary>
            <SafeAreaView style={styles.container} edges={['top']}>
                <StatusBar backgroundColor="#086364" barStyle="light-content" />
                
                {/* Dashboard Header */}
                <View style={styles.header}>
                    <View style={styles.headerInfo}>
                        <View style={styles.avatarContainer}>
                            <Ionicons name="person-circle" size={50} color="#FFFFFF" />
                        </View>
                        <View style={styles.welcomeTextContainer}>
                            <Text style={styles.greetingText}>Admin Portal 👋</Text>
                            <Text style={styles.adminName}>{globalState?.name || 'Administrator'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => setLogoutModalVisible(true)} style={styles.logoutButton}>
                        <Ionicons name="log-out-outline" size={26} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContent}>
                    
                    {/* Main Interaction Cards */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Overview Metrics</Text>
                    </View>
                    
                    <View style={styles.statsGrid}>
                        {adminStats.map((stat, index) => (
                            <TouchableOpacity 
                                key={index} 
                                style={styles.statCard}
                                onPress={() => navigation.navigate('AdminTabs', { screen: stat.route as any })}
                            >
                                <View style={[styles.iconWrapper, { backgroundColor: stat.color + '20' }]}>
                                    <Ionicons name={stat.icon} size={28} color={stat.color} />
                                </View>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Quick Administrative Actions */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                    </View>
                    
                    <View style={styles.actionContainer}>
                        <TouchableOpacity 
                            style={styles.actionBlock}
                            onPress={() => actionModalRef.current?.present()}
                        >
                            <Ionicons name="megaphone-outline" size={32} color="#0A8485" />
                            <Text style={styles.actionBlockText}>Broadcast Alert</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.actionBlock}
                            onPress={() => navigation.navigate('AdminTabs', { screen: 'AdminLeadList' })}
                        >
                            <Ionicons name="add-circle-outline" size={32} color="#0A8485" />
                            <Text style={styles.actionBlockText}>Manual Lead</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Recent Interaction Log Feed */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recent Activity</Text>
                    </View>
                    <View style={styles.activityCard}>
                        <View style={styles.activityRow}>
                            <Ionicons name="person-add" size={20} color="#4CAF50" />
                            <View style={styles.activityDetails}>
                                <Text style={styles.activityTitle}>New Partner Registered</Text>
                                <Text style={styles.activityTime}>Just Now • "Arka Systems"</Text>
                            </View>
                        </View>
                        <View style={[styles.activityRow, styles.activityRowNoBorder]}>
                            <Ionicons name="card" size={20} color="#2196F3" />
                            <View style={styles.activityDetails}>
                                <Text style={styles.activityTitle}>Wallet Recharge Initiated</Text>
                                <Text style={styles.activityTime}>15 mins ago • Rs. 5,000</Text>
                            </View>
                        </View>
                    </View>

                </ScrollView>
                
                {/* Broadcast Action Modal */}
                <BSModal
                    bsModalRef={actionModalRef}
                    headerTitle="Broadcast to Partners"
                    snapPoints={['50%']}>
                    <View style={styles.bottomSheetContent}>
                        <Text style={styles.modalSub}>Send a push notification to all active partners.</Text>
                        <SODTextInput
                            title="Message content"
                            placeholder="Enter alert message..."
                            value={quickMessage}
                            onChangeText={setQuickMessage}
                            maxlength={120}
                            isEditable={true}
                        />
                        <TouchableOpacity style={styles.submitButton} onPress={() => { Keyboard.dismiss(); actionModalRef.current?.dismiss(); setQuickMessage(''); }}>
                            <Text style={styles.submitButtonText}>Send Broadcast</Text>
                        </TouchableOpacity>
                    </View>
                </BSModal>

                <LogoutModal
                    visible={isLogoutModalVisible}
                    onClose={() => setLogoutModalVisible(false)}
                    onLogout={handleLogout}
                />
            </SafeAreaView>
        </ErrorBoundary>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
    },
    header: {
        backgroundColor: '#0A8485',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 25,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 12,
    },
    welcomeTextContainer: {
        justifyContent: 'center',
    },
    greetingText: {
        color: '#E0F2F1',
        fontSize: 14,
        fontWeight: '500',
    },
    adminName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 2,
    },
    logoutButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 12,
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        marginTop: 24,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: '#FFFFFF',
        width: '48%',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: '#8E8E93',
        fontWeight: '500',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionBlock: {
        backgroundColor: '#FFFFFF',
        width: '48%',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
    },
    actionBlockText: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    activityCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 30,
    },
    activityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingVertical: 12,
    },
    activityRowNoBorder: {
        borderBottomWidth: 0,
        paddingBottom: 0,
    },
    activityDetails: {
        marginLeft: 12,
    },
    activityTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    activityTime: {
        fontSize: 12,
        color: '#8E8E93',
        marginTop: 2,
    },
    bottomSheetContent: {
        padding: 20,
    },
    modalSub: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    submitButton: {
        backgroundColor: '#0A8485',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 25,
    },
    submitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AdminDashboard;
