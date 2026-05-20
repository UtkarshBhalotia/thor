import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    LayoutAnimation,
    Platform,
    UIManager,
    Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import DeniedLeadFormModal from '../../../components/DeniedLeadFormModal';
import CompletedLeadFormModal from '../../../components/CompletedLeadFormModal';
import FollowUpLeadFormModal from '../../../components/FollowUpLeadFormModal';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Enable LayoutAnimation for Android
if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
    deniedDate?: string;
    deniedStatus?: string;
    completedDate?: string;
    completedAmout?: string;
    reComplaintId?: string;
    // Customer details
    customerName?: string;
    customerMobile?: string;
    customerAddress?: string;
    acceptLeadDate?: string;
    partnerName?: string;
    partnerMobile?: string;
    isAdminView?: boolean;
    isHistoryView?: boolean;
    // Action handlers
    onAccept?: () => void;
    //  onRefuse?: () => void;
    onCardPress?: () => void;
    onFollowUp?: (data: {
        nextFollowUpDate: Date;
        followUpDetails: string;
    }) => void;
    onDenied?: (leadId: string, reason: string) => void;
    onCompleted?: (data: {
        totalBillAmount: string;
        serviceDetails: string;
        otherRemarks: string;
    }) => void;
    onCustomerDetailsClick?: (
        leadId: string,
        callBack: (data: any) => void,
    ) => void;
    onFetchDeniedReasons?: (
        callBack: (data: any[]) => void,
    ) => void;
    onFetchFollowUpReasons?: (
        callBack: (data: any[]) => void,
    ) => void;
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
    deniedDate,
    deniedStatus,
    completedDate,
    completedAmout,
    reComplaintId,
    customerName,
    customerMobile,
    customerAddress,
    acceptLeadDate,
    partnerName,
    partnerMobile,
    isAdminView,
    isHistoryView,
    onAccept,
    onCardPress,
    onFollowUp,
    onDenied,
    onCompleted,
    onCustomerDetailsClick,
    onFetchDeniedReasons,
    onFetchFollowUpReasons,
}) => {
    const [isCustomerDetailsExpanded, setIsCustomerDetailsExpanded] =
        useState(false);
    const [customerDetails, setCustomerDetails] = useState<{
        customerName?: string;
        customerMobile?: string;
        customerAddress?: string;
        acceptLeadDate?: string;
    }>({
        customerName,
        customerMobile,
        customerAddress,
        acceptLeadDate,
    });
    const deniedModalRef = useRef<BottomSheetModal>(null);
    const completedModalRef = useRef<BottomSheetModal>(null);
    const followUpModalRef = useRef<BottomSheetModal>(null);
    const [deniedReasons, setDeniedReasons] = useState<{ id: string | number; reason: string }[]>([]);
    const [isLoadingDeniedReasons, setIsLoadingDeniedReasons] = useState(false);
    const [followUpReasons, setFollowUpReasons] = useState<{ id: string | number; reason: string }[]>([]);
    const [isLoadingFollowUpReasons, setIsLoadingFollowUpReasons] = useState(false);

    const handleFollowUpPress = () => {
        if (onFetchFollowUpReasons) {
            setIsLoadingFollowUpReasons(true);
            followUpModalRef.current?.present();
            onFetchFollowUpReasons((data: any[]) => {
                const reasons = data?.map((item: any, index: number) => {
                    if (typeof item === 'string') {
                        return { id: index, reason: item };
                    }
                    return {
                        id: item.ID || item.id || index,
                        reason: item.ResionName || item.Reason || item.reason || item.name || '',
                    };
                }) || [];
                setFollowUpReasons(reasons);
                setIsLoadingFollowUpReasons(false);
            });
        } else {
            followUpModalRef.current?.present();
        }
    };

    const handleFollowUpSubmit = (data: {
        nextFollowUpDate: Date;
        followUpDetails: string;
    }) => {
        if (onFollowUp) {
            onFollowUp(data);
        }
    };

    const handleDeniedPress = () => {
        console.log('handleDeniedPress called', { hasFetch: !!onFetchDeniedReasons });
        if (onFetchDeniedReasons) {
            setIsLoadingDeniedReasons(true);
            deniedModalRef.current?.present();
            onFetchDeniedReasons((data: any[]) => {
                const reasons = data?.map((item: any, index: number) => {
                    if (typeof item === 'string') {
                        return { id: index, reason: item };
                    }
                    return {
                        id: item.ID || item.id || index,
                        reason: item.ResionName || item.Reason || item.reason || item.name || '',
                    };
                }) || [];
                setDeniedReasons(reasons);
                setIsLoadingDeniedReasons(false);
            });
        } else {
            deniedModalRef.current?.present();
        }
    };

    const handleDeniedSubmit = (reason: string) => {
        if (onDenied) {
            onDenied(leadId, reason);
        }
    };

    const handleCompletedPress = () => {
        if (isReComplaint) {
            handleCompletedSubmit({
                totalBillAmount: '0',
                serviceDetails: 'Re-Complaint Completed',
                otherRemarks: '',
                reComplaintId: reComplaintId,
            });
        } else {
            completedModalRef.current?.present();
        }
    };

    const handleCompletedSubmit = (data: {
        totalBillAmount: string;
        serviceDetails: string;
        otherRemarks: string;
        reComplaintId?: string;
    }) => {
        if (onCompleted) {
            onCompleted(data);
        }
    };

    const handleCallPress = (mobile?: string) => {
        if (mobile) {
            Linking.openURL(`tel:${mobile}`);
        }
    };

    const toggleCustomerDetails = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (!isCustomerDetailsExpanded && onCustomerDetailsClick) {
            onCustomerDetailsClick(leadId, (data: any) => {
                if (data && data.length > 0) {
                    const detail = data[0];
                    setCustomerDetails({
                        customerName: detail.CustomerName,
                        customerMobile: detail.MobileNo,
                        customerAddress: detail.Address,
                        acceptLeadDate: detail.AcceptDate,
                    });
                }
            });
        }
        setIsCustomerDetailsExpanded(!isCustomerDetailsExpanded);
    };
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
            case 're-Complaint':
            case 're-complaint':
                return {
                    badge: { backgroundColor: '#E0F2F1' },
                    text: { color: '#004D40' },
                    accent: '#004D40',
                    icon: '⚠️',
                };
            case 'Completed':
            case 'Re-Completed':
            case 're-completed':
                return {
                    badge: { backgroundColor: '#E8F5E9' },
                    text: { color: '#388E3C' },
                    accent: '#388E3C',
                    icon: '✅',
                };
            case 'Denied': {
                const isRefunded = deniedStatus?.trim().toLowerCase() === 'amount refunded';
                return {
                    badge: { backgroundColor: isRefunded ? '#E3F2FD' : '#FFEBEE' },
                    text: { color: isRefunded ? '#1976D2' : '#D32F2F' },
                    accent: isRefunded ? '#1976D2' : '#D32F2F',
                    icon: 'close',
                    isVector: true,
                };
            }
            case 'FollowUp':
            case 'Follow Up':
            case 'Follow-Up':
                return {
                    badge: { backgroundColor: '#F3E5F5' },
                    text: { color: '#7B1FA2' },
                    accent: '#7B1FA2',
                    icon: 'call',
                    isVector: true,
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
    const statusLower = leadStatus?.trim().toLowerCase();
    const isReStatus =
        statusLower === 're-completed' || statusLower === 're-complaint';
    const isReComplaint = statusLower === 're-complaint';

    const DetailRow = ({
        label,
        value,
        highlight = false,
        fullText = false,
        highlightColor,
    }: {
        label: string;
        value: string;
        highlight?: boolean;
        fullText?: boolean;
        highlightColor?: string;
    }) => (
        <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text
                style={[
                    styles.detailValue,
                    highlight && {
                        color: highlightColor || statusConfig.accent,
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
                        isAdminView ? { backgroundColor: '#0A8485' } : { backgroundColor: statusConfig.accent },
                    ]}
                />

                <View style={styles.cardContent}>
                    {/* Header Section */}
                    <View style={styles.headerSection}>
                        <View style={styles.headerLeft}>
                            <View>
                                <View
                                    style={[
                                        styles.statusBadge,
                                        statusConfig.badge,
                                    ]}>
                                    {statusConfig.isVector ? (
                                        <View style={[styles.styledIconBox, { backgroundColor: statusConfig.accent }]}>
                                            <Ionicons
                                                name={statusConfig.icon as any}
                                                size={10}
                                                color="#FFFFFF"
                                            />
                                        </View>
                                    ) : (
                                        <Text style={styles.statusIcon}>
                                            {statusConfig.icon}
                                        </Text>
                                    )}
                                    <Text
                                        style={[
                                            styles.statusText,
                                            statusConfig.text,
                                        ]}>
                                        {leadStatus}
                                    </Text>
                                </View>
                                {leadStatus === 'Denied' && deniedStatus && (
                                    <Text style={[styles.deniedSubStatus, { color: statusConfig.accent }]}>
                                        {deniedStatus}
                                    </Text>
                                )}
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
                                label={
                                    isReStatus
                                        ? 'Completed Amount'
                                        : 'Lead Amount'
                                }
                                value={
                                    isReStatus
                                        ? `₹ ${completedAmout || leadAmt}`
                                        : `₹ ${leadAmt}`
                                }
                                highlight={true}
                                highlightColor={
                                    isReStatus ? '#388E3C' : undefined
                                }
                            />
                        </View>

                        <View style={styles.detailsRow}>
                            <DetailRow label="Brand" value={leadBrand} />
                            <DetailRow label="Lead Date" value={leadDate} />
                        </View>

                        {/* Denied Info */}
                        {leadStatus === 'Denied' && (
                            <>
                                <View style={styles.detailsRow}>
                                    <DetailRow
                                        label="Denied Reason"
                                        value={deniedReason || '-'}
                                    />
                                    <DetailRow
                                        label="Denied Date"
                                        value={deniedDate || '-'}
                                    />
                                </View>
                            </>
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

                        {isReStatus && (
                            <View style={styles.detailsRow}>
                                <DetailRow
                                    label="Completed Date"
                                    value={completedDate || '-'}
                                />
                                <DetailRow
                                    label="Re-Complaint Date"
                                    value={leadDate || '-'}
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
                    {leadStatus === 'New' && !isAdminView && (
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

                    {/* Ongoing or Follow Up Status - Customer Details & Action Buttons */}
                    {(isAdminView ||
                        leadStatus?.trim().toLowerCase() === 'ongoing' ||
                        leadStatus?.trim().toLowerCase() === 'follow up' ||
                        leadStatus?.trim().toLowerCase() === 'followup' ||
                        leadStatus?.trim().toLowerCase() === 'follow-up' ||
                        leadStatus?.trim().toLowerCase() === 're-complaint') && (
                            <>
                                <View style={styles.divider} />

                                {isHistoryView && (
                                    <View style={[styles.customerDetailsContainer, { paddingBottom: 8 }]}>
                                        <View style={styles.customerDetailRow}>
                                            <Text style={styles.customerDetailLabel}>Partner Name</Text>
                                            <Text style={styles.customerDetailValue}>{partnerName || '-'}</Text>
                                        </View>
                                        <View style={styles.customerDetailRow}>
                                            <Text style={styles.customerDetailLabel}>Partner Mobile</Text>
                                            <View style={styles.customerMobileValueContainer}>
                                                {partnerMobile && (
                                                    <TouchableOpacity
                                                        onPress={() => handleCallPress(partnerMobile)}
                                                        style={[
                                                            styles.callIconButton,
                                                            { backgroundColor: '#0A8485' }
                                                        ]}>
                                                        <Ionicons name="call" size={14} color="#FFFFFF" />
                                                    </TouchableOpacity>
                                                )}
                                                <Text style={styles.customerMobileValue}>{partnerMobile || '-'}</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.divider, { marginBottom: 0, marginTop: 8 }]} />
                                    </View>
                                )}

                                {/* Expandable Customer Details */}
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={toggleCustomerDetails}
                                    style={styles.customerDetailsToggle}>
                                    <Text style={[styles.customerDetailsToggleText, isAdminView && { color: '#0A8485' }]}>
                                        {isCustomerDetailsExpanded ? 'Hide Customer Details' : 'View Customer Details'}
                                    </Text>
                                    <Ionicons
                                        name={isCustomerDetailsExpanded ? 'chevron-up' : 'chevron-down'}
                                        size={14}
                                        style={[styles.customerDetailsArrow, isAdminView && { color: '#0A8485' }]}
                                    />
                                </TouchableOpacity>

                                {isCustomerDetailsExpanded && (
                                    <>
                                        <View
                                            style={styles.customerDetailsContainer}>
                                            <View style={styles.customerDetailRow}>
                                                <Text
                                                    style={
                                                        styles.customerDetailLabel
                                                    }>
                                                    Customer Name
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.customerDetailValue
                                                    }>
                                                    {customerDetails.customerName ||
                                                        '-'}
                                                </Text>
                                            </View>
                                            <View style={styles.customerDetailRow}>
                                                <Text
                                                    style={
                                                        styles.customerDetailLabel
                                                    }>
                                                    Customer Mobile
                                                </Text>
                                                <View style={styles.customerMobileValueContainer}>
                                                    {customerDetails.customerMobile && (
                                                        <TouchableOpacity
                                                            onPress={() =>
                                                                handleCallPress(
                                                                    customerDetails.customerMobile,
                                                                )
                                                            }
                                                            style={[
                                                                styles.callIconButton,
                                                                isAdminView && { backgroundColor: '#0A8485' }
                                                            ]}>
                                                            <Ionicons
                                                                name="call"
                                                                size={14}
                                                                color="#FFFFFF"
                                                            />
                                                        </TouchableOpacity>
                                                    )}
                                                    <Text
                                                        style={
                                                            styles.customerMobileValue
                                                        }>
                                                        {customerDetails.customerMobile ||
                                                            '-'}
                                                    </Text>
                                                </View>
                                            </View>
                                            <View style={styles.customerDetailRow}>
                                                <Text
                                                    style={
                                                        styles.customerDetailLabel
                                                    }>
                                                    Customer Address
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.customerDetailValue
                                                    }>
                                                    {customerDetails.customerAddress ||
                                                        '-'}
                                                </Text>
                                            </View>


                                            <View style={styles.customerDetailRow}>
                                                <Text
                                                    style={
                                                        styles.customerDetailLabel
                                                    }>
                                                    Accept Lead Date
                                                </Text>
                                                <Text
                                                    style={
                                                        styles.customerDetailValue
                                                    }>
                                                    {customerDetails.acceptLeadDate ||
                                                        '-'}
                                                </Text>
                                            </View>
                                        </View>

                                        {/* Three Action Buttons - Shown after customer details expanded */}
                                        {!isAdminView && (
                                        <View style={styles.ongoingButtonsRow}>
                                            {!isReComplaint && (
                                                <>
                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        onPress={handleFollowUpPress}
                                                        style={styles.followUpBtn}>
                                                        <View style={styles.btnContentWithIcon}>
                                                            <View style={[styles.styledIconBox, { backgroundColor: '#7B1FA2' }]}>
                                                                <Ionicons name="call" size={10} color="#FFFFFF" />
                                                            </View>
                                                            <Text
                                                                style={styles.followUpBtnText}>
                                                                {leadStatus?.trim().toLowerCase() === 'follow up' || 
                                                                    leadStatus?.trim().toLowerCase() === 'followup' || 
                                                                    leadStatus?.trim().toLowerCase() === 'follow-up' 
                                                                    ? 'Next Follow Up' 
                                                                    : 'Follow Up'}
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        activeOpacity={0.8}
                                                        onPress={handleDeniedPress}
                                                        style={styles.deniedBtn}>
                                                        <View style={styles.btnContentWithIcon}>
                                                            <View style={[styles.styledIconBox, { backgroundColor: '#D32F2F' }]}>
                                                                <Ionicons name="close" size={10} color="#FFFFFF" />
                                                            </View>
                                                            <Text style={styles.deniedBtnText}>
                                                                Denied
                                                            </Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </>
                                            )}
                                            <TouchableOpacity
                                                activeOpacity={0.8}
                                                onPress={handleCompletedPress}
                                                style={styles.completedBtn}>
                                                <Text
                                                    style={styles.completedBtnText}>
                                                    ✓ Completed
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                        )}
                                    </>
                                )}
                            </>
                        )}
                </View>
            </View>

            {/* Denied Lead Form Modal */}
            <DeniedLeadFormModal
                ref={deniedModalRef}
                onSubmit={handleDeniedSubmit}
                deniedReasons={deniedReasons}
                isLoadingReasons={isLoadingDeniedReasons}
            />

            {/* Completed Lead Form Modal */}
            <CompletedLeadFormModal
                ref={completedModalRef}
                onSubmit={handleCompletedSubmit}
            />

            {/* Follow Up Lead Form Modal */}
            <FollowUpLeadFormModal
                ref={followUpModalRef}
                onSubmit={handleFollowUpSubmit}
                followUpReasons={followUpReasons}
                isLoadingReasons={isLoadingFollowUpReasons}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        marginHorizontal: 16,
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        flexDirection: 'row',
        overflow: 'hidden',
        // shadowColor: '#000',
        elevation: 0,
    },
    accentStrip: {
        width: 4,
        backgroundColor: '#5F60B9',
    },
    cardContent: {
        flex: 1,
        padding: 14,
    },
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerLeft: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    deniedSubStatus: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 4,
        marginLeft: 4,
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        gap: 5,
    },
    statusIcon: {
        fontSize: 12,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    leadNoLabel: {
        fontSize: 11,
        color: '#8F8F8F',
        marginBottom: 1,
    },
    leadNoValue: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1C1F34',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F5',
        marginVertical: 10,
    },
    detailsGrid: {
        gap: 8,
    },
    detailsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    detailItem: {
        flex: 1,
        backgroundColor: '#F7F8FA',
        borderRadius: 8,
        padding: 8,
    },
    detailLabel: {
        fontSize: 11,
        color: '#8F8F8F',
        marginBottom: 3,
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 13,
        color: '#1C1F34',
        fontWeight: '600',
    },
    actionSection: {
        marginTop: 2,
    },
    acceptButtonWrapper: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    acceptButton: {
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    acceptButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    // Ongoing Status Styles
    ongoingButtonsRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    followUpBtn: {
        flex: 1,
        backgroundColor: '#F3E5F5',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    followUpBtnText: {
        color: '#7B1FA2',
        fontSize: 12,
        fontWeight: '600',
    },
    deniedBtn: {
        flex: 1,
        backgroundColor: '#FFEBEE',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    deniedBtnText: {
        color: '#D32F2F',
        fontSize: 12,
        fontWeight: '600',
    },
    completedBtn: {
        flex: 1,
        backgroundColor: '#E8F5E9',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    completedBtnText: {
        color: '#388E3C',
        fontSize: 12,
        fontWeight: '600',
    },
    btnContentWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    styledIconBox: {
        width: 16,
        height: 16,
        borderRadius: 4,
        backgroundColor: '#616161',
        alignItems: 'center',
        justifyContent: 'center',
    },
    customerDetailsToggle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F5F6FA',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    customerDetailsToggleText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#5F60B9',
    },
    customerDetailsArrow: {
        fontSize: 10,
        color: '#5F60B9',
    },
    customerDetailsContainer: {
        marginTop: 10,
        backgroundColor: '#F9FAFB',
        borderRadius: 10,
        padding: 12,
        gap: 10,
    },
    customerDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    customerDetailLabel: {
        fontSize: 12,
        color: '#8F8F8F',
        fontWeight: '500',
        flex: 1,
    },
    customerDetailValue: {
        fontSize: 13,
        color: '#1C1F34',
        fontWeight: '600',
        flex: 1.5,
        textAlign: 'right',
    },
    customerMobileValueContainer: {
        flex: 1.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 6,
    },
    customerMobileValue: {
        fontSize: 13,
        color: '#1C1F34',
        fontWeight: '600',
    },
    callIconButton: {
        backgroundColor: '#5F60B9',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default ServiceCard;
