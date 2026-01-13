import { View, Text, TouchableOpacity } from 'react-native';
import { dashboardStyles } from '../../../assets/css/dashboardStyles';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface ReportCardProps {
    ongoing: number | string;
    newLeads: number | string;
    revenue: number | string;
    onPress?: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
    ongoing,
    newLeads,
    revenue,
    onPress,
}) => {
    return (
        <View style={dashboardStyles.reportsContainer}>
            <TouchableOpacity
                style={dashboardStyles.reportCard}
                onPress={onPress}
                activeOpacity={0.7}>
                <View
                    style={[
                        dashboardStyles.reportIconContainer,
                        { backgroundColor: '#E8F5E9' },
                    ]}>
                    <Ionicons name="flash-outline" size={20} color="#4CAF50" />
                </View>
                <Text style={dashboardStyles.reportValue}>{newLeads}</Text>
                <Text style={dashboardStyles.reportLabel}>New Leads</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={dashboardStyles.reportCard}
                onPress={onPress}
                activeOpacity={0.7}>
                <View
                    style={[
                        dashboardStyles.reportIconContainer,
                        { backgroundColor: '#E3F2FD' },
                    ]}>
                    <Ionicons name="sync-outline" size={20} color="#2196F3" />
                </View>
                <Text style={dashboardStyles.reportValue}>{ongoing}</Text>
                <Text style={dashboardStyles.reportLabel}>Ongoing Leads</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={dashboardStyles.reportCard}
                onPress={onPress}
                activeOpacity={0.7}>
                <View
                    style={[
                        dashboardStyles.reportIconContainer,
                        { backgroundColor: '#FFF3E0' },
                    ]}>
                    <Ionicons name="cash-outline" size={20} color="#FF9800" />
                </View>
                <Text style={dashboardStyles.reportValue}>₹{revenue}</Text>
                <Text style={dashboardStyles.reportLabel}>Revenue</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ReportCard;
