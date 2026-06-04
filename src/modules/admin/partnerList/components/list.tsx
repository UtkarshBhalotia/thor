import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface PartnerListProps {
    data: any[];
    loading: boolean;
    hasSearched: boolean;
}

const PartnerList = ({ data, loading, hasSearched }: PartnerListProps) => {
    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0A8485" />
                <Text style={styles.loadingText}>Fetching Partners...</Text>
            </View>
        );
    }

    if (!hasSearched) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="search-outline" size={60} color="#CCCCCC" />
                <Text style={styles.emptyText}>Select filters and search for partners</Text>
            </View>
        );
    }

    if (data.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="people-outline" size={60} color="#CCCCCC" />
                <Text style={styles.emptyText}>No partners found for selected criteria</Text>
            </View>
        );
    }

    const renderPartner = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={24} color="#0A8485" />
                </View>
                <View style={styles.headerInfo}>
                    <Text style={styles.name}>{item.Name || 'N/A'}</Text>
                    <Text style={styles.company}>{item.CompanyName || 'No Company'}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: item.IsActive === 'Active' ? '#E8F5E9' : '#FFEBEE' }]}>
                    <Text style={[styles.statusText, { color: item.IsActive === 'Active' ? '#2E7D32' : '#C62828' }]}>
                        {item.IsActive === 'Active' ? 'Active' : 'Inactive'}
                    </Text>
                </View>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <Ionicons name="call-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>{item.MobileNo || 'N/A'}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Ionicons name="mail-outline" size={16} color="#666" />
                    <Text style={styles.infoText}>{item.EmailID || item.Email || 'N/A'}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.footerRow}>
                    <View style={styles.footerItem}>
                        <Ionicons name="cash-outline" size={16} color="#0A8485" />
                        <Text style={styles.footerLabel}>Balance:</Text>
                        <Text style={styles.footerValue}>₹{item.WalletBalance || item.TotalBalance || '0.00'}</Text>
                    </View>
                    <View style={styles.footerItem}>
                        <Ionicons name="key-outline" size={16} color="#666" />
                        <Text style={styles.footerLabel}>Pass:</Text>
                        <Text style={styles.footerValue}>{item.Password || '******'}</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <FlatList
            data={data}
            renderItem={renderPartner}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
        />
    );
};

const styles = StyleSheet.create({
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 12,
        color: '#666',
        fontSize: 16,
    },
    emptyText: {
        marginTop: 12,
        color: '#999',
        fontSize: 16,
        textAlign: 'center',
    },
    listContent: {
        padding: 16,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E0F2F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    name: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1C1F34',
    },
    company: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    cardBody: {
        gap: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        fontSize: 14,
        color: '#444',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 12,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    footerLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    footerValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default PartnerList;
