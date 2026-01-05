import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    InteractionManager,
    ActivityIndicator,
    Platform,
    Modal,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { reportStyles } from '../../assets/css/reportStyles';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CalendarPicker from 'react-native-calendar-picker';
import { connect } from 'react-redux';
import { Dimensions } from 'react-native';
import { AppDispatch, RootState } from '../../../store';
import projectEnv from '../../services/env';
import { TReportData } from './type';

// Custom dispatch for report actions
const reportActions_dispatch = (dispatch: AppDispatch) => (actionName: string, actionParam: any) => {
    dispatch({
        type: 'Report_Actions',
        payload: { actionName, actionParam }
    });
};

const Report = (props: any) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [fromDate, setFromDate] = useState(new Date());
    const [toDate, setToDate] = useState(new Date());
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState<TReportData>({
        ongoing: 0,
        denied: 0,
        completed: 0,
        follow: 0,
        reCompleted: 0,
        reComplaint: 0,
        totalRevenue: 0,
    });

    const formatDate = (date: Date) => {
        if (!date) return '';
        const d = new Date(date);
        const day = d.getDate().toString().padStart(2, '0');
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const year = d.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const handleGenerateReport = () => {
        setLoading(true);
        props.reportActions('Get_Work_Report_For_Vendor_Api', {
            fromDate: formatDate(fromDate),
            toDate: formatDate(toDate),
            callBack: (data: TReportData) => {
                setReportData(data);
                setLoading(false);
            },
        });
    };

    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            handleGenerateReport();
        });
        return () => task.cancel();
    }, []);

    const onDateChange = (date: any) => {
        const selectedDate = new Date(date);
        if (showFromPicker) {
            setFromDate(selectedDate);
            setShowFromPicker(false);
        } else if (showToPicker) {
            setToDate(selectedDate);
            setShowToPicker(false);
        }
    };

    const renderReportRow = (label: string, value: number, iconName: string, iconColor: string, bgColor: string) => (
        <View style={reportStyles.tableRow}>
            <View style={[reportStyles.iconContainer, { backgroundColor: bgColor }]}>
                <Ionicons name={iconName} size={18} color={iconColor} />
            </View>
            <Text style={reportStyles.rowLabel}>{label}</Text>
            <Text style={reportStyles.rowValue}>{value}</Text>
        </View>
    );

    return (
        <SafeAreaView style={reportStyles.container} edges={['top']}>
            <StatusBar backgroundColor="#F8F9FA" barStyle="dark-content" />
            {/* Header */}
            <View style={reportStyles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={reportStyles.backButton}
                >
                    <Ionicons name="chevron-back" size={24} color="#1C1F34" />
                </TouchableOpacity>
                <Text style={reportStyles.headerTitle}>Report</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={reportStyles.scrollContent}
            >
                {/* Date Selectors */}
                <TouchableOpacity
                    style={reportStyles.dateCard}
                    onPress={() => setShowFromPicker(true)}
                >
                    <Text style={reportStyles.dateLabel}>Start Date:</Text>
                    <View style={reportStyles.dateValueContainer}>
                        <Text style={reportStyles.dateValue}>{formatDate(fromDate)}</Text>
                        <Ionicons name="chevron-forward" size={18} color="#ADB5BD" />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={reportStyles.dateCard}
                    onPress={() => setShowToPicker(true)}
                >
                    <Text style={reportStyles.dateLabel}>End Date:</Text>
                    <View style={reportStyles.dateValueContainer}>
                        <Text style={reportStyles.dateValue}>{formatDate(toDate)}</Text>
                        <Ionicons name="chevron-forward" size={18} color="#ADB5BD" />
                    </View>
                </TouchableOpacity>

                {/* Date Selection Modal */}
                <Modal
                    visible={showFromPicker || showToPicker}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => {
                        setShowFromPicker(false);
                        setShowToPicker(false);
                    }}
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 20
                    }}>
                        <View style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 24,
                            padding: 24,
                            width: '100%',
                            maxWidth: 360,
                            elevation: 8,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: 24
                            }}>
                                <View>
                                    <Text style={{
                                        fontSize: 14,
                                        color: '#8F9BB3',
                                        fontWeight: '600',
                                        textTransform: 'uppercase',
                                        letterSpacing: 0.5
                                    }}>
                                        Select Date
                                    </Text>
                                    <Text style={{
                                        fontSize: 20,
                                        fontWeight: '700',
                                        color: '#222B45',
                                        marginTop: 4
                                    }}>
                                        {showFromPicker ? 'Start Date' : 'End Date'}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        setShowFromPicker(false);
                                        setShowToPicker(false);
                                    }}
                                    style={{
                                        padding: 8,
                                        backgroundColor: '#F7F9FC',
                                        borderRadius: 12
                                    }}
                                >
                                    <Ionicons name="close" size={24} color="#8F9BB3" />
                                </TouchableOpacity>
                            </View>

                            <CalendarPicker
                                onDateChange={onDateChange}
                                selectedDayColor="#5F60B9"
                                selectedDayTextColor="#FFFFFF"
                                todayBackgroundColor="#E4E9F2"
                                todayTextStyle={{ color: '#222B45', fontWeight: 'bold' }}
                                initialDate={showToPicker ? toDate : fromDate}
                                width={Dimensions.get('window').width - 88} // Adjusted width
                                textStyle={{
                                    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
                                    color: '#222B45',
                                }}
                                headerWrapperStyle={{
                                    paddingHorizontal: 0,
                                }}
                                monthTitleStyle={{
                                    fontSize: 16,
                                    fontWeight: '700',
                                    color: '#222B45',
                                }}
                                yearTitleStyle={{
                                    fontSize: 16,
                                    fontWeight: '700',
                                    color: '#222B45',
                                }}
                                dayLabelsWrapper={{
                                    borderTopWidth: 0,
                                    borderBottomWidth: 0,
                                    paddingTop: 10,
                                    paddingBottom: 10,
                                }}
                                nextComponent={<Ionicons name="chevron-forward" size={24} color="#5F60B9" />}
                                previousComponent={<Ionicons name="chevron-back" size={24} color="#5F60B9" />}
                            />
                        </View>
                    </View>
                </Modal>

                {/* Generate Button */}
                <TouchableOpacity
                    style={reportStyles.generateButton}
                    onPress={handleGenerateReport}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={reportStyles.generateButtonText}>Generate Report</Text>
                    )}
                </TouchableOpacity>

                {/* Report Details */}
                <View style={reportStyles.detailsCard}>
                    <View style={reportStyles.detailsHeader}>
                        <Text style={reportStyles.detailsTitle}>Report Details</Text>
                    </View>

                    <View style={reportStyles.tableHeader}>
                        <Text style={reportStyles.tableHeaderText}>Type Of Lead</Text>
                        <Text style={[reportStyles.tableHeaderText, reportStyles.tableHeaderTextRight]}>Total</Text>
                    </View>

                    {renderReportRow('Ongoing Leads', reportData.ongoing, 'arrow-redo-circle-outline', '#F57C00', '#FFF3E0')}
                    {renderReportRow('Denied Leads', reportData.denied, 'close-circle-outline', '#D32F2F', '#FFEBEE')}
                    {renderReportRow('Completed Leads', reportData.completed, 'checkmark-circle-outline', '#388E3C', '#E8F5E9')}
                    {renderReportRow('Follow Leads', reportData.follow, 'flag-outline', '#7B1FA2', '#F3E5F5')}
                    {renderReportRow('Re-Completed', reportData.reCompleted, 'sync-outline', '#1976D2', '#E3F2FD')}
                    {renderReportRow('Re-Complaint', reportData.reComplaint, 'document-text-outline', '#5F60B9', '#F0F0FF')}

                    <View style={reportStyles.revenueRow}>
                        <Ionicons name="card-outline" size={20} color="#FFFFFF" style={{ marginRight: 12 }} />
                        <Text style={reportStyles.revenueLabel}>Total Revenue</Text>
                        <Text style={reportStyles.revenueValue}>₹ {reportData.totalRevenue}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const mapStateToProps = (state: RootState) => ({
    globalState: state.globalState,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    reportActions: reportActions_dispatch(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Report);
