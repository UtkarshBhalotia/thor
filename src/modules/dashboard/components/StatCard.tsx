import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { dashboardStyles } from '../../../assets/css/dashboardStyles';

interface StatCardProps {
    label: string;
    value: string | number;
    onPress?: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, onPress }) => {
    const CardComponent = onPress ? TouchableOpacity : View;

    return (
        <CardComponent
            style={dashboardStyles.statCard}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <Text style={dashboardStyles.statLabel}>{label}</Text>
            <Text style={dashboardStyles.statValue}> ₹ {value}</Text>
        </CardComponent>
    );
};

export default StatCard;
