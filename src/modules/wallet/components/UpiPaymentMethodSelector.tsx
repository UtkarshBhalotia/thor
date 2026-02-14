/**
 * UPI Payment Method Selector Component
 * Allows users to select their preferred UPI payment app
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export interface UpiApp {
    id: string;
    name: string;
    packageName: string; // Android package name
    iosScheme?: string; // iOS URL scheme
    iconName: string; // Ionicon name
    color: string; // Brand color
}

interface UpiPaymentMethodSelectorProps {
    visible: boolean;
    amount: string;
    vpa?: string; // Virtual Payment Address (UPI ID)
    transactionId: string;
    merchantName: string;
    onSelectUpiApp: (app: UpiApp) => void;
    onSelectOthers: () => void;
    onCancel: () => void;
}

const UpiPaymentMethodSelector: React.FC<UpiPaymentMethodSelectorProps> = ({
    visible,
    amount,
    vpa,
    transactionId,
    merchantName,
    onSelectUpiApp,
    onSelectOthers,
    onCancel,
}) => {
    // Define available UPI apps
    const upiApps: UpiApp[] = [
        {
            id: 'gpay',
            name: 'Google Pay',
            packageName: 'com.google.android.apps.nbu.paisa.user',
            iosScheme: 'gpay://',
            iconName: 'logo-google',
            color: '#4285F4',
        },
        {
            id: 'phonepe',
            name: 'PhonePe',
            packageName: 'com.phonepe.app',
            iosScheme: 'phonepe://',
            iconName: 'phone-portrait',
            color: '#5F259F',
        },
        {
            id: 'paytm',
            name: 'Paytm',
            packageName: 'net.one97.paytm',
            iosScheme: 'paytmmp://',
            iconName: 'wallet',
            color: '#00BAF2',
        },
        {
            id: 'cred',
            name: 'CRED',
            packageName: 'com.dreamplug.androidapp',
            iosScheme: 'cred://',
            iconName: 'card',
            color: '#000000',
        },
        {
            id: 'bhim',
            name: 'BHIM',
            packageName: 'in.org.npci.upiapp',
            iosScheme: 'bhim://',
            iconName: 'flash',
            color: '#FF6B00',
        },
    ];

    const handleUpiAppSelect = (app: UpiApp) => {
        onSelectUpiApp(app);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onCancel}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Select Payment Method</Text>
                        <TouchableOpacity
                            onPress={onCancel}
                            style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#1C1F34" />
                        </TouchableOpacity>
                    </View>

                    {/* Amount Display */}
                    <View style={styles.amountContainer}>
                        <Text style={styles.amountLabel}>Amount to Pay</Text>
                        <Text style={styles.amountValue}>₹ {amount}</Text>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}>
                        {/* UPI Apps Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>UPI Apps</Text>
                            <View style={styles.appsGrid}>
                                {upiApps.map((app) => (
                                    <TouchableOpacity
                                        key={app.id}
                                        style={styles.appCard}
                                        onPress={() => handleUpiAppSelect(app)}
                                        activeOpacity={0.7}>
                                        <View
                                            style={[
                                                styles.appIconContainer,
                                                { backgroundColor: app.color },
                                            ]}>
                                            <Ionicons
                                                name={app.iconName}
                                                size={36}
                                                color="#FFFFFF"
                                            />
                                        </View>
                                        <Text style={styles.appName}>{app.name}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Others Option */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Other Payment Methods</Text>
                            <TouchableOpacity
                                style={styles.othersCard}
                                onPress={onSelectOthers}
                                activeOpacity={0.7}>
                                <View style={styles.othersIconContainer}>
                                    <Ionicons
                                        name="card-outline"
                                        size={32}
                                        color="#5F60B9"
                                    />
                                </View>
                                <View style={styles.othersTextContainer}>
                                    <Text style={styles.othersTitle}>
                                        Other Payment Options
                                    </Text>
                                    <Text style={styles.othersSubtitle}>
                                        Cards, Net Banking, Wallets & More
                                    </Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={24}
                                    color="#8F9BB3"
                                />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '85%',
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1F34',
    },
    closeButton: {
        padding: 4,
    },
    amountContainer: {
        backgroundColor: '#F7F9FC',
        paddingVertical: 20,
        paddingHorizontal: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    amountLabel: {
        fontSize: 14,
        color: '#8F9BB3',
        marginBottom: 4,
    },
    amountValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1C1F34',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1F34',
        marginBottom: 16,
    },
    appsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    appCard: {
        width: '33.33%',
        paddingHorizontal: 8,
        marginBottom: 16,
        alignItems: 'center',
    },
    appIconContainer: {
        width: 70,
        height: 70,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    appName: {
        fontSize: 13,
        fontWeight: '500',
        color: '#1C1F34',
        textAlign: 'center',
    },
    othersCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F9FC',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
    othersIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    othersTextContainer: {
        flex: 1,
    },
    othersTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1F34',
        marginBottom: 4,
    },
    othersSubtitle: {
        fontSize: 13,
        color: '#8F9BB3',
    },
});

export default UpiPaymentMethodSelector;
