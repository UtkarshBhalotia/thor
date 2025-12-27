import React from 'react';
import { View, Text } from 'react-native';
import { dashboardStyles } from '../../../assets/css/dashboardStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ReportCardProps {
    ongoing: number | string;
    newLeads: number | string;
    revenue: number | string;
}

const ReportCard: React.FC<ReportCardProps> = ({ ongoing, newLeads, revenue }) => {
    return (
        <View style={dashboardStyles.reportsContainer}>
            <View style={dashboardStyles.reportCard}>
                <View style={[dashboardStyles.reportIconContainer, { backgroundColor: '#E3F2FD' }]}>
                    <Ionicons name="sync-outline" size={20} color="#2196F3" />
                </View>
                <Text style={dashboardStyles.reportValue}>{ongoing}</Text>
                <Text style={dashboardStyles.reportLabel}>Ongoing</Text>
            </View>
            <View style={dashboardStyles.reportCard}>
                <View style={[dashboardStyles.reportIconContainer, { backgroundColor: '#E8F5E9' }]}>
                    <Ionicons name="flash-outline" size={20} color="#4CAF50" />
                </View>
                <Text style={dashboardStyles.reportValue}>{newLeads}</Text>
                <Text style={dashboardStyles.reportLabel}>New Leads</Text>
            </View>
            <View style={dashboardStyles.reportCard}>
                <View style={[dashboardStyles.reportIconContainer, { backgroundColor: '#FFF3E0' }]}>
                    <Ionicons name="cash-outline" size={20} color="#FF9800" />
                </View>
                <Text style={dashboardStyles.reportValue}>₹{revenue}</Text>
                <Text style={dashboardStyles.reportLabel}>Revenue</Text>
            </View>
        </View>
    );
};

export default ReportCard;
