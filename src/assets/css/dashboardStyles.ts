import { StyleSheet } from 'react-native';

export const dashboardStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        paddingBottom: 30,
    },

    // Header Section
    headerSection: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 15,
        backgroundColor: '#FFFFFF',
    },
    greetingText: {
        fontSize: 16,
        color: '#8F8F8F',
        marginBottom: 5,
    },
    providerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    providerName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1C1F34',
    },
    providerDetailsLink: {
        fontSize: 14,
        color: '#5F60B9',
        textDecorationLine: 'underline',
    },

    // Wallet Card
    walletCard: {
        backgroundColor: '#5F60B9',
        marginHorizontal: 20,
        marginVertical: 15,
        padding: 20,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    walletLabel: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
        marginBottom: 8,
    },
    walletBalance: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },

    // Stats Section
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#F7F7FB',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 90,
    },
    statLabel: {
        fontSize: 12,
        color: '#8F8F8F',
        textAlign: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1C1F34',
    },

    // Section Headers
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: 10,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1C1F34',
    },
    viewAllLink: {
        fontSize: 14,
        color: '#5F60B9',
        fontWeight: '600',
    },

    // Service Card
    serviceCard: {
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
    serviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    serviceIdContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    serviceId: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1C1F34',
    },
    packageBadge: {
        backgroundColor: '#F0F5FF',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
    },
    packageText: {
        fontSize: 11,
        color: '#5F60B9',
        fontWeight: '600',
    },
    serviceName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1F34',
        marginBottom: 8,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    servicePrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5F60B9',
    },
    discountText: {
        fontSize: 12,
        color: '#107C10',
    },
    serviceDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    serviceDetailItem: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 11,
        color: '#8F8F8F',
        marginBottom: 3,
    },
    detailValue: {
        fontSize: 13,
        color: '#1C1F34',
        fontWeight: '500',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    statusPending: {
        backgroundColor: '#FFF4E6',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusTextPending: {
        color: '#FF9800',
    },
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
    actionButtons: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 12,
    },
    refuseButton: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#C50F1F',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    refuseButtonText: {
        color: '#C50F1F',
        fontSize: 14,
        fontWeight: '600',
    },
    acceptButton: {
        flex: 1,
        backgroundColor: '#5F60B9',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    acceptButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },

    // Review Card
    reviewCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginBottom: 12,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    reviewerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    reviewerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F7F7FB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    reviewerAvatarText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#5F60B9',
    },
    reviewerDetails: {
        flex: 1,
    },
    reviewerName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1C1F34',
        marginBottom: 2,
    },
    reviewTime: {
        fontSize: 12,
        color: '#8F8F8F',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF4E6',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    ratingText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FF9800',
        marginLeft: 4,
    },
    reviewText: {
        fontSize: 14,
        color: '#1C1F34',
        lineHeight: 20,
        marginBottom: 10,
        fontStyle: 'italic',
    },
    reviewServiceName: {
        fontSize: 12,
        color: '#8F8F8F',
    },
    reviewServiceValue: {
        fontSize: 12,
        color: '#1C1F34',
        fontWeight: '500',
    },

    followUpButton: {
        flex: 1,
        backgroundColor: '#5F60B9',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    followUpButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
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
    rechargeButton: {
        backgroundColor: '#5F60B9',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    rechargeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Wallet Recharge Button
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
    // Reports Section Styles
    reportsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
        gap: 10,
    },
    reportCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 12,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    reportIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    reportValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1C1F34',
        marginBottom: 2,
    },
    reportLabel: {
        fontSize: 10,
        color: '#8F8F8F',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
});
