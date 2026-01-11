import { StyleSheet } from 'react-native';

export const walletStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    // Header
    header: {
        paddingHorizontal: 20,
        paddingTop: 15,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1C1F34',
        flex: 1,
        marginLeft: 12,
    },
    headerIcon: {
        padding: 8,
    },

    // Wallet Balance Card
    balanceCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 15,
        padding: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    balanceLabel: {
        fontSize: 14,
        color: '#8F8F8F',
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5F60B9',
        marginBottom: 8,
    },
    openingBalance: {
        fontSize: 14,
        color: '#8F8F8F',
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
        marginBottom: 12,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    paymentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
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
    // Recharge Button in Card
    rechargeButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: -10,
    },
    walletRechargeButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    walletRechargeText: {
        fontSize: 13,
        color: '#FFFFFF',
        fontWeight: '600',
        marginLeft: 4,
    },
    walletRechargeIcon: {
        marginRight: 2,
    },
    // Bottom Sheet Styles
    bottomSheetContent: {
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    amountInputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        color: '#8F8F8F',
        marginBottom: 8,
        fontWeight: '500',
    },
    amountInput: {
        backgroundColor: '#F7F7FB',
        borderRadius: 12,
        padding: 15,
        fontSize: 18,
        color: '#1C1F34',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    rechargeActionButton: {
        backgroundColor: '#5F60B9',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    rechargeActionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Gateway Selection
    gatewayContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    gatewayOption: {
        flex: 1,
        backgroundColor: '#F7F7FB',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginHorizontal: 5,
    },
    gatewayOptionSelected: {
        borderColor: '#5F60B9',
        backgroundColor: '#F0F0FF',
    },
    gatewayText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#1C1F34',
    },
    gatewayTextSelected: {
        color: '#5F60B9',
    },
    // Filter Section
    filterSection: {
        marginHorizontal: 20,
        marginBottom: 15,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    filterLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterIcon: {
        marginRight: 8,
    },
    filterLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1F34',
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sortLabel: {
        fontSize: 14,
        color: '#1C1F34',
        marginRight: 4,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
        gap: 10,
    },
    dateInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: '#F7F7FB',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    dateInputText: {
        paddingLeft: 8,
        fontSize: 14,
        color: '#1C1F34',
        flex: 1,
    },
    dateInputIcon: {
        marginLeft: 8,
    },
    applyFilterButton: {
        backgroundColor: '#5F60B9',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    applyFilterButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    // Updated Payment Card Styles
    transactionType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1F34',
        marginBottom: 4,
    },
    dateTimeBalanceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    dateTimeBalanceDivider: {
        fontSize: 13,
        color: '#8F8F8F',
        marginHorizontal: 8,
    },
    transactionDateTime: {
        fontSize: 13,
        color: '#8F8F8F',
    },
    transactionAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    transactionAmountCredit: {
        color: '#107C10',
    },
    transactionAmountDebit: {
        color: '#C50F1F',
    },
    currentBalance: {
        fontSize: 13,
        color: '#8F8F8F',
    },
});
