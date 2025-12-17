import { StyleSheet } from 'react-native';

export const walletStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    // Header
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1C1F34',
    },

    // Wallet Balance Card
    balanceCard: {
        backgroundColor: '#5F60B9',
        marginHorizontal: 20,
        marginVertical: 20,
        padding: 24,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 6,
    },
    balanceLabel: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    // Section Header
    sectionHeader: {
        paddingHorizontal: 20,
        marginBottom: 15,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1C1F34',
    },

    // Payment History List
    listContainer: {
        paddingBottom: 20,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#8F8F8F',
        marginTop: 10,
    },

    // Payment Card
    paymentCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginBottom: 15,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    paymentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    paymentLeft: {
        flex: 1,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1F34',
        marginBottom: 4,
    },
    bookingId: {
        fontSize: 13,
        color: '#8F8F8F',
    },
    paymentAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5F60B9',
    },

    // Payment Details Grid
    detailsGrid: {
        gap: 10,
        marginBottom: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailItem: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 11,
        color: '#8F8F8F',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 13,
        color: '#1C1F34',
        fontWeight: '500',
    },

    // Status Badges
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    statusPaid: {
        backgroundColor: '#F1FAF1',
    },
    statusAdvancePaid: {
        backgroundColor: '#E3F2FD',
    },
    statusPending: {
        backgroundColor: '#FFF4E6',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusTextPaid: {
        color: '#107C10',
    },
    statusTextAdvancePaid: {
        color: '#2196F3',
    },
    statusTextPending: {
        color: '#FF9800',
    },

    // Customer Section
    customerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    customerAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#5F60B9',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    customerAvatarText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    customerInfo: {
        flex: 1,
    },
    customerLabel: {
        fontSize: 11,
        color: '#8F8F8F',
        marginBottom: 2,
    },
    customerName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1C1F34',
    },
});
