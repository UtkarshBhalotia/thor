import { StyleSheet, Platform } from 'react-native';

export const reportStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F8F9FA',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1F34',
        marginLeft: 8,
    },
    backButton: {
        padding: 4,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    // Date Selection
    dateCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    dateLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1F34',
    },
    dateValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateValue: {
        fontSize: 16,
        color: '#5F60B9',
        marginRight: 8,
    },
    // Button
    generateButton: {
        backgroundColor: '#5F60B9',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 24,
    },
    generateButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    // Report Details Card
    detailsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    detailsHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    detailsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1F34',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#F0F0FF',
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    tableHeaderText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5F60B9',
        flex: 1,
    },
    tableHeaderTextRight: {
        textAlign: 'right',
    },
    // Row
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F8F9FA',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    rowLabel: {
        fontSize: 15,
        fontWeight: '500',
        color: '#1C1F34',
        flex: 1,
    },
    rowValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#495057',
        width: 40,
        textAlign: 'right',
    },
    // Revenue Row
    revenueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#5F60B9',
        margin: 12,
        padding: 14,
        borderRadius: 12,
    },
    revenueLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        flex: 1,
    },
    revenueValue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
    },
});
