import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { dashboardStyles } from '../../../assets/css/dashboardStyles';

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
}) => {
    // Get status badge styles
    const getStatusStyles = () => {
        const status = leadStatus?.trim();
        switch (status) {
            case 'NEW':
            case 'New':
                return {
                    badge: { backgroundColor: '#E3F2FD' },
                    text: { color: '#1976D2' },
                };
            case 'Ongoing':
                return {
                    badge: { backgroundColor: '#FFF3E0' },
                    text: { color: '#F57C00' },
                };
            case 'Complaint':
                return {
                    badge: { backgroundColor: '#FFEBEE' },
                    text: { color: '#D32F2F' },
                };
            case 'Completed':
                return {
                    badge: { backgroundColor: '#E8F5E9' },
                    text: { color: '#388E3C' },
                };
            case 'Denied':
                return {
                    badge: { backgroundColor: '#F5F5F5' },
                    text: { color: '#616161' },
                };
            case 'FollowUp':
            case 'Follow Up':
            case 'Follow-Up':
                return {
                    badge: { backgroundColor: '#F3E5F5' },
                    text: { color: '#7B1FA2' },
                };
            default:
                return {
                    badge: { backgroundColor: '#F7F7FB' },
                    text: { color: '#1C1F34' },
                };
        }
    };

    const statusStyles = getStatusStyles();

    return (
        <View style={dashboardStyles.serviceCard}>
            {/* Status and Lead Number - Two columns in one row */}
            <View style={dashboardStyles.serviceDetailsRow}>
                <View style={dashboardStyles.serviceDetailItem}>
                    <Text style={dashboardStyles.detailLabel}>Status</Text>
                    <View style={[dashboardStyles.statusBadge, statusStyles.badge]}>
                        <Text style={[dashboardStyles.statusText, statusStyles.text]}>
                            {leadStatus}
                        </Text>
                    </View>
                </View>
                <View style={dashboardStyles.serviceDetailItem}>
                    <Text style={dashboardStyles.detailLabel}>Lead No</Text>
                    <Text style={dashboardStyles.detailValue}>{leadNo}</Text>
                </View>
            </View>

            {/* Service Type and Lead Amount - Two columns in one row */}
            <View style={dashboardStyles.serviceDetailsRow}>
                <View style={dashboardStyles.serviceDetailItem}>
                    <Text style={dashboardStyles.detailLabel}>Service Type</Text>
                    <Text style={dashboardStyles.detailValue}>{leadType}</Text>
                </View>
                <View style={dashboardStyles.serviceDetailItem}>
                    <Text style={dashboardStyles.detailLabel}>Lead Amount</Text>
                    <Text style={dashboardStyles.detailValue}>₹ {leadAmt}</Text>
                </View>
            </View>

            {/* Brand and Lead Date - Two columns in one row */}
            <View style={dashboardStyles.serviceDetailsRow}>
                <View style={dashboardStyles.serviceDetailItem}>
                    <Text style={dashboardStyles.detailLabel}>Brand</Text>
                    <Text style={dashboardStyles.detailValue}>{leadBrand}</Text>
                </View>
                <View style={dashboardStyles.serviceDetailItem}>
                    <Text style={dashboardStyles.detailLabel}>Lead Date</Text>
                    <Text style={dashboardStyles.detailValue}>{leadDate}</Text>
                </View>
            </View>

            {/* Denied Reason and Date - Two columns in one row */}
            {leadStatus === 'Denied' && <View style={dashboardStyles.serviceDetailsRow}>
                <View style={dashboardStyles.serviceDetailItem}>
                    <Text style={dashboardStyles.detailLabel}>Denied Reason</Text>
                    <Text style={dashboardStyles.detailValue}>{deniedReason}</Text>
                </View>
                <View style={dashboardStyles.serviceDetailItem}>
                    <Text style={dashboardStyles.detailLabel}>Denied Date</Text>
                    <Text style={dashboardStyles.detailValue}>{deniedDateStatus}</Text>
                </View>
            </View>}

            {/* Completed Date and Amount - Two columns in one row */}
            {leadStatus === 'Completed' && <View style={dashboardStyles.serviceDetailsRow}>
                <View style={dashboardStyles.serviceDetailItem}>
                    <Text style={dashboardStyles.detailLabel}>Completed Date</Text>
                    <Text style={dashboardStyles.detailValue}>{completedDate}</Text>
                </View>
                <View style={dashboardStyles.serviceDetailItem}>
                    <Text style={dashboardStyles.detailLabel}>Completed Amount</Text>
                    <Text style={dashboardStyles.detailValue}>{completedAmout}</Text>
                </View>
            </View>}

            {/* City and Description - Two columns in one row */}
            <View style={dashboardStyles.serviceDetailsRow}>
                <View style={dashboardStyles.serviceDetailItem}>
                    <Text style={dashboardStyles.detailLabel}>City</Text>
                    <Text style={dashboardStyles.detailValue}>{leadCity}</Text>
                </View>
                <View style={dashboardStyles.serviceDetailItem}>
                    <Text style={dashboardStyles.detailLabel}>Description</Text>
                    <Text style={dashboardStyles.detailValue}>{leadDescription}</Text>
                </View>
            </View>

            {/* Action Buttons - Only shown for Pending status */}
            {leadStatus === 'New' && (
                <View style={dashboardStyles.actionButtons}>

                    <TouchableOpacity
                        style={dashboardStyles.followUpButton}
                        onPress={onAccept}>
                        <Text style={dashboardStyles.followUpButtonText}>Accept</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={dashboardStyles.refuseButton}
                        onPress={onRefuse}>
                        <Text style={dashboardStyles.refuseButtonText}>Refuse</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                        style={dashboardStyles.acceptButton}
                        onPress={onAccept}>
                        <Text style={dashboardStyles.acceptButtonText}>Completed</Text>
                    </TouchableOpacity> */}
                </View>
            )}
        </View>
    );
};

export default ServiceCard;
