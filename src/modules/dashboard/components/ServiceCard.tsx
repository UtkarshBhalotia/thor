import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface ServiceCardProps {
    leadId: string;
    leadNo: string;
    leadType: string;
    leadAmt: string;
    leadStatus: string;
    leadDate: string;
    leadCity: string;
    leadDescription: string;
    leadBrand: string;
    deniedReason?: string;
    deniedDateStatus?: string;
    completedDate?: string;
    completedAmout?: string;
    onAccept?: () => void;
    onRefuse?: () => void;
    onCardPress?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
    leadId,
    leadNo,
    leadType,
    leadAmt,
    leadStatus,
    leadDate,
    leadCity,
    leadDescription,
    leadBrand,
    deniedReason,
    deniedDateStatus,
    completedDate,
    completedAmout,
    onAccept,
    onRefuse,
    onCardPress,
}) => {
    // Get status styles including accent color
    const getStatusConfig = () => {
        const status = leadStatus?.trim();
        switch (status) {
            case 'NEW':
            case 'New':
                return {
                    badge: { backgroundColor: '#E3F2FD' },
                    text: { color: '#1976D2' },
                    accent: '#1976D2',
                    icon: '🆕',
                };
            case 'Ongoing':
                return {
                    badge: { backgroundColor: '#FFF3E0' },
                    text: { color: '#F57C00' },
                    accent: '#F57C00',
                    icon: '⏳',
                };
            case 'Complaint':
                return {
                    badge: { backgroundColor: '#FFEBEE' },
                    text: { color: '#D32F2F' },
                    accent: '#D32F2F',
                    icon: '⚠️',
                };
            case 'Completed':
                return {
                    badge: { backgroundColor: '#E8F5E9' },
                    text: { color: '#388E3C' },
                    accent: '#388E3C',
                    icon: '✅',
                };
            case 'Denied':
                return {
                    badge: { backgroundColor: '#F5F5F5' },
                    text: { color: '#616161' },
                    accent: '#616161',
                    icon: '❌',
                };
            case 'FollowUp':
            case 'Follow Up':
            case 'Follow-Up':
                return {
                    badge: { backgroundColor: '#F3E5F5' },
                    text: { color: '#7B1FA2' },
                    accent: '#7B1FA2',
                    icon: '📞',
                };
            default:
                return {
                    badge: { backgroundColor: '#F7F7FB' },
                    text: { color: '#1C1F34' },
                    accent: '#5F60B9',
                    icon: '📋',
                };
        }
    };

    const statusConfig = getStatusConfig();

    const DetailRow = ({
        label,
        value,
        highlight = false,
        fullText = false,
    }: {
        label: string;
        value: string;
        highlight?: boolean;
        fullText?: boolean;
    }) => (
        <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text
                style={[
                    styles.detailValue,
                    highlight && {
                        color: statusConfig.accent,
                        fontWeight: '700',
                    },
                ]}
                numberOfLines={fullText ? undefined : 2}>
                {value}
            </Text>
        </View>
    );

    return (
        <TouchableOpacity
            activeOpacity={0.92}
            onPress={onCardPress}
            style={styles.cardWrapper}>
            <View style={styles.card}>
                {/* Left accent strip */}
                <View
                    style={[
                        styles.accentStrip,
                        { backgroundColor: statusConfig.accent },
                    ]}
                />

                <View style={styles.cardContent}>
                    {/* Header Section */}
                    <View style={styles.headerSection}>
                        <View style={styles.headerLeft}>
                            <View
                                style={[
                                    styles.statusBadge,
                                    statusConfig.badge,
                                ]}>
                                <Text style={styles.statusIcon}>
                                    {statusConfig.icon}
                                </Text>
                                <Text
                                    style={[
                                        styles.statusText,
                                        statusConfig.text,
                                    ]}>
                                    {leadStatus}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.headerRight}>
                            <Text style={styles.leadNoLabel}>Lead #</Text>
                            <Text style={styles.leadNoValue}>{leadNo}</Text>
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Main Details Grid */}
                    <View style={styles.detailsGrid}>
                        <View style={styles.detailsRow}>
                            <DetailRow label="Service Type" value={leadType} />
                            <DetailRow
                                label="Lead Amount"
                                value={`₹ ${leadAmt}`}
                                highlight
                            />
                        </View>

                        <View style={styles.detailsRow}>
                            <DetailRow label="Brand" value={leadBrand} />
                            <DetailRow label="Lead Date" value={leadDate} />
                        </View>

                        {/* Denied Info */}
                        {leadStatus === 'Denied' && (
                            <View style={styles.detailsRow}>
                                <DetailRow
                                    label="Denied Reason"
                                    value={deniedReason || '-'}
                                />
                                <DetailRow
                                    label="Denied Date"
                                    value={deniedDateStatus || '-'}
                                />
                            </View>
                        )}

                        {/* Completed Info */}
                        {leadStatus === 'Completed' && (
                            <View style={styles.detailsRow}>
                                <DetailRow
                                    label="Completed Date"
                                    value={completedDate || '-'}
                                />
                                <DetailRow
                                    label="Completed Amount"
                                    value={
                                        completedAmout
                                            ? `₹ ${completedAmout}`
                                            : '-'
                                    }
                                    highlight
                                />
                            </View>
                        )}

                        <View style={styles.detailsRow}>
                            <DetailRow label="City" value={leadCity} />
                            <DetailRow
                                label="Description"
                                value={leadDescription}
                                fullText
                            />
                        </View>
                    </View>

                    {/* Action Button - Only shown for New status */}
                    {leadStatus === 'New' && (
                        <>
                            <View style={styles.divider} />
                            <View style={styles.actionSection}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={onAccept}
                                    style={styles.acceptButtonWrapper}>
                                    <LinearGradient
                                        colors={['#6366F1', '#5F60B9']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.acceptButton}>
                                        <Text style={styles.acceptButtonText}>
                                            ✓ Accept Lead
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        flexDirection: 'row',
        overflow: 'hidden',
        shadowColor: '#1C1F34',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
    },
    accentStrip: {
        width: 5,
        backgroundColor: '#5F60B9',
    },
    cardContent: {
        flex: 1,
        padding: 16,
    },
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    statusIcon: {
        fontSize: 12,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    leadNoLabel: {
        fontSize: 11,
        color: '#8F8F8F',
        marginBottom: 2,
    },
    leadNoValue: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1C1F34',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F5',
        marginVertical: 12,
    },
    detailsGrid: {
        gap: 12,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    detailItem: {
        flex: 1,
        backgroundColor: '#F9F9FB',
        borderRadius: 10,
        padding: 10,
    },
    detailLabel: {
        fontSize: 11,
        color: '#8F8F8F',
        marginBottom: 4,
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 13,
        color: '#1C1F34',
        fontWeight: '600',
    },
    actionSection: {
        marginTop: 4,
    },
    acceptButtonWrapper: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    acceptButton: {
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    acceptButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});

export default ServiceCard;
