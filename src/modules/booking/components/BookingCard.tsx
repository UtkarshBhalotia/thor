import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { bookingStyles } from '../../../assets/css/bookingStyles';

export type BookingStatus = 'Pending' | 'Accepted' | 'Ongoing' | 'Completed' | 'Cancelled';

interface BookingCardProps {
    bookingId: string;
    serviceName: string;
    price: string;
    discount?: string;
    status: BookingStatus;
    servicemenCount: string;
    dateTime: string;
    location?: string;
    payment: string;
    customerName: string;
    onPress?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
    bookingId,
    serviceName,
    price,
    discount,
    status,
    servicemenCount,
    dateTime,
    location,
    payment,
    customerName,
    onPress,
}) => {
    // Get initials from customer name
    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Get status badge styles
    const getStatusStyles = () => {
        switch (status) {
            case 'Pending':
                return {
                    badge: bookingStyles.statusPending,
                    text: bookingStyles.statusTextPending,
                };
            case 'Accepted':
                return {
                    badge: bookingStyles.statusAccepted,
                    text: bookingStyles.statusTextAccepted,
                };
            case 'Ongoing':
                return {
                    badge: bookingStyles.statusOngoing,
                    text: bookingStyles.statusTextOngoing,
                };
            case 'Completed':
                return {
                    badge: bookingStyles.statusCompleted,
                    text: bookingStyles.statusTextCompleted,
                };
            case 'Cancelled':
                return {
                    badge: bookingStyles.statusCancelled,
                    text: bookingStyles.statusTextCancelled,
                };
            default:
                return {
                    badge: bookingStyles.statusPending,
                    text: bookingStyles.statusTextPending,
                };
        }
    };

    const statusStyles = getStatusStyles();

    const CardWrapper = onPress ? TouchableOpacity : View;

    return (
        <CardWrapper
            style={bookingStyles.bookingCard}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            {/* Booking Header */}
            <View style={bookingStyles.bookingHeader}>
                <View style={{ flex: 1 }}>
                    <Text style={bookingStyles.bookingId}>{bookingId}</Text>
                    <Text style={bookingStyles.bookingName}>{serviceName}</Text>
                </View>
            </View>

            {/* Price */}
            <View style={bookingStyles.priceContainer}>
                <Text style={bookingStyles.bookingPrice}>{price}</Text>
                {discount && (
                    <Text style={bookingStyles.discountText}>{discount}</Text>
                )}
            </View>

            {/* Booking Details */}
            <View style={bookingStyles.detailsGrid}>
                {/* Status */}
                <View style={bookingStyles.detailRow}>
                    <View style={bookingStyles.detailItem}>
                        <Text style={bookingStyles.detailLabel}>Status</Text>
                        <View style={[bookingStyles.statusBadge, statusStyles.badge]}>
                            <Text style={[bookingStyles.statusText, statusStyles.text]}>
                                {status}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Servicemen Count */}
                {status !== 'Cancelled' && (
                    <View style={bookingStyles.detailRow}>
                        <View style={bookingStyles.detailItem}>
                            <Text style={bookingStyles.detailLabel}>Selected servicemen</Text>
                            <Text style={bookingStyles.detailValue}>{servicemenCount}</Text>
                        </View>
                    </View>
                )}

                {/* Date & Time */}
                <View style={bookingStyles.detailRow}>
                    <View style={bookingStyles.detailItem}>
                        <Text style={bookingStyles.detailLabel}>Date & Time</Text>
                        <Text style={bookingStyles.detailValue}>{dateTime}</Text>
                    </View>
                </View>

                {/* Location (if provided) */}
                {location && status !== 'Cancelled' && (
                    <View style={bookingStyles.detailRow}>
                        <View style={bookingStyles.detailItem}>
                            <Text style={bookingStyles.detailLabel}>Location</Text>
                            <Text style={bookingStyles.detailValue}>{location}</Text>
                        </View>
                    </View>
                )}

                {/* Payment */}
                {status !== 'Cancelled' && (
                    <View style={bookingStyles.detailRow}>
                        <View style={bookingStyles.detailItem}>
                            <Text style={bookingStyles.detailLabel}>Payment</Text>
                            <Text style={bookingStyles.detailValue}>{payment}</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Customer Info */}
            <View style={bookingStyles.customerContainer}>
                <View style={bookingStyles.customerAvatar}>
                    <Text style={bookingStyles.customerAvatarText}>
                        {getInitials(customerName)}
                    </Text>
                </View>
                <View style={bookingStyles.customerInfo}>
                    <Text style={bookingStyles.customerLabel}>Customer</Text>
                    <Text style={bookingStyles.customerName}>{customerName}</Text>
                </View>
            </View>
        </CardWrapper>
    );
};

export default BookingCard;
