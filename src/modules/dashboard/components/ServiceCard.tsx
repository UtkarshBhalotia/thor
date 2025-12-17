import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { dashboardStyles } from '../../../assets/css/dashboardStyles';

interface ServiceCardProps {
    serviceId: string;
    serviceName: string;
    price: string;
    discount: string;
    status: 'Pending' | 'Accepted' | 'Completed';
    dateTime: string;
    location: string;
    receivableAmount: string;
    customerName: string;
    isPackage?: boolean;
    onAccept?: () => void;
    onRefuse?: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
    serviceId,
    serviceName,
    price,
    discount,
    status,
    dateTime,
    location,
    receivableAmount,
    customerName,
    isPackage = false,
    onAccept,
    onRefuse,
}) => {
    // Get initials from customer name
    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <View style={dashboardStyles.serviceCard}>
            {/* Service Header */}
            <View style={dashboardStyles.serviceHeader}>
                <View style={dashboardStyles.serviceIdContainer}>
                    <Text style={dashboardStyles.serviceId}>{serviceId}</Text>
                    {isPackage && (
                        <View style={dashboardStyles.packageBadge}>
                            <Text style={dashboardStyles.packageText}>Package</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Service Name */}
            <Text style={dashboardStyles.serviceName}>{serviceName}</Text>

            {/* Price */}
            <View style={dashboardStyles.priceContainer}>
                <Text style={dashboardStyles.servicePrice}>{price}</Text>
                <Text style={dashboardStyles.discountText}>{discount}</Text>
            </View>

            {/* Service Details */}
            <View style={dashboardStyles.serviceDetailsRow}>
                <View style={dashboardStyles.serviceDetailItem}>
                    <Text style={dashboardStyles.detailLabel}>Status</Text>
                    <View style={[dashboardStyles.statusBadge, dashboardStyles.statusPending]}>
                        <Text style={[dashboardStyles.statusText, dashboardStyles.statusTextPending]}>
                            {status}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={dashboardStyles.serviceDetailsRow}>
                <View style={dashboardStyles.serviceDetailItem}>
                    <Text style={dashboardStyles.detailLabel}>Date & Time</Text>
                    <Text style={dashboardStyles.detailValue}>{dateTime}</Text>
                </View>
            </View>

            <View style={dashboardStyles.serviceDetailsRow}>
                <View style={dashboardStyles.serviceDetailItem}>
                    <Text style={dashboardStyles.detailLabel}>Location</Text>
                    <Text style={dashboardStyles.detailValue}>{location}</Text>
                </View>
            </View>

            <View style={dashboardStyles.serviceDetailsRow}>
                <View style={dashboardStyles.serviceDetailItem}>
                    <Text style={dashboardStyles.detailLabel}>Receivable Amount</Text>
                    <Text style={dashboardStyles.detailValue}>{receivableAmount}</Text>
                </View>
            </View>

            {/* Customer Info */}
            <View style={dashboardStyles.customerContainer}>
                <View style={dashboardStyles.customerAvatar}>
                    <Text style={dashboardStyles.customerAvatarText}>
                        {getInitials(customerName)}
                    </Text>
                </View>
                <View style={dashboardStyles.customerInfo}>
                    <Text style={dashboardStyles.customerLabel}>Customer</Text>
                    <Text style={dashboardStyles.customerName}>{customerName}</Text>
                </View>
            </View>

            {/* Action Buttons */}
            {status === 'Pending' && (
                <View style={dashboardStyles.actionButtons}>
                    <TouchableOpacity
                        style={dashboardStyles.refuseButton}
                        onPress={onRefuse}
                    >
                        <Text style={dashboardStyles.refuseButtonText}>Refuse</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={dashboardStyles.acceptButton}
                        onPress={onAccept}
                    >
                        <Text style={dashboardStyles.acceptButtonText}>Accept</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

export default ServiceCard;
