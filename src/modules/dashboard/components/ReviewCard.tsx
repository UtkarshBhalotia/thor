import React from 'react';
import { View, Text } from 'react-native';
import { dashboardStyles } from '../../../assets/css/dashboardStyles';

interface ReviewCardProps {
    customerName: string;
    timeAgo: string;
    rating: number;
    reviewText: string;
    serviceName: string;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
    customerName,
    timeAgo,
    rating,
    reviewText,
    serviceName,
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
        <View style={dashboardStyles.reviewCard}>
            {/* Review Header */}
            <View style={dashboardStyles.reviewHeader}>
                <View style={dashboardStyles.reviewerInfo}>
                    <View style={dashboardStyles.reviewerAvatar}>
                        <Text style={dashboardStyles.reviewerAvatarText}>
                            {getInitials(customerName)}
                        </Text>
                    </View>
                    <View style={dashboardStyles.reviewerDetails}>
                        <Text style={dashboardStyles.reviewerName}>{customerName}</Text>
                        <Text style={dashboardStyles.reviewTime}>{timeAgo}</Text>
                    </View>
                </View>
                <View style={dashboardStyles.ratingContainer}>
                    <Text style={dashboardStyles.ratingText}>★ {rating.toFixed(1)}</Text>
                </View>
            </View>

            {/* Review Text */}
            <Text style={dashboardStyles.reviewText}>"{reviewText}"</Text>

            {/* Service Name */}
            <Text style={dashboardStyles.reviewServiceName}>
                Service name: <Text style={dashboardStyles.reviewServiceValue}>{serviceName}</Text>
            </Text>
        </View>
    );
};

export default ReviewCard;
