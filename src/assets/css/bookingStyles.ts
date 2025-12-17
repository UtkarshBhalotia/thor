import { StyleSheet } from 'react-native';

export const bookingStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
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

    // Tab Filter Section
    tabContainer: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    tabScrollView: {
        paddingHorizontal: 20,
    },
    tabScrollContent: {
        gap: 10,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F7F7FB',
        marginRight: 10,
    },
    tabActive: {
        backgroundColor: '#5F60B9',
    },
    tabText: {
        fontSize: 14,
        color: '#8F8F8F',
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#FFFFFF',
        fontWeight: '600',
    },

    // Booking List
    listContainer: {
        paddingTop: 10,
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

    // Booking Card
    bookingCard: {
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
    bookingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    bookingId: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1C1F34',
        marginBottom: 6,
    },
    bookingName: {
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
    bookingPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5F60B9',
    },
    discountText: {
        fontSize: 12,
        color: '#107C10',
    },

    // Booking Details Grid
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
    statusPending: {
        backgroundColor: '#FFF4E6',
    },
    statusAccepted: {
        backgroundColor: '#E3F2FD',
    },
    statusOngoing: {
        backgroundColor: '#E8F5E9',
    },
    statusCompleted: {
        backgroundColor: '#F1FAF1',
    },
    statusCancelled: {
        backgroundColor: '#FFEBEE',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statusTextPending: {
        color: '#FF9800',
    },
    statusTextAccepted: {
        color: '#2196F3',
    },
    statusTextOngoing: {
        color: '#4CAF50',
    },
    statusTextCompleted: {
        color: '#107C10',
    },
    statusTextCancelled: {
        color: '#C50F1F',
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

    // Filter Badge
    filterBadge: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: '#C50F1F',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    filterBadgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});
