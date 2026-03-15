import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, ActivityIndicator, Modal, Image, StyleSheet, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CalendarPicker from 'react-native-calendar-picker';
import { bookingStyles } from '../../../assets/css/bookingStyles';
import { dashboardStyles } from '../../../assets/css/dashboardStyles';
import ServiceCard from '../../dashboard/components/ServiceCard';
import projectEnv from '../../../services/env';
import { clientPostHandler } from '../../../services/request';

const AdminLeadList = () => {
    const navigation = useNavigation<any>();
    
    // Default to last 30 days
    const [fromDate, setFromDate] = useState<Date>(new Date());
    const [toDate, setToDate] = useState<Date>(new Date());
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);
    
    const [assignedServices, setAssignedServices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const defaultDate = new Date();
            setFromDate(defaultDate);
            setToDate(defaultDate);
            load(defaultDate, defaultDate);
        }, [])
    );

    const formatDateForApi = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const load = async (fDate: Date, tDate: Date) => {
        setIsLoading(true);
        try {
            const response: any = await clientPostHandler({
                url: projectEnv.getAllLeadListUrl,
                data: {
                    FromDate: formatDateForApi(fDate),
                    ToDate: formatDateForApi(tDate),
                }
            });

            if (response && response.body && response.body.d) {
                const parsedData = JSON.parse(response.body.d);
                setAssignedServices(Array.isArray(parsedData) ? parsedData : []);
            } else {
                setAssignedServices([]);
            }
        } catch (error) {
            setAssignedServices([]);
        } finally {
            setIsLoading(false);
        }
    };

    const onDateChange = (date: any) => {
        const selectedDate = new Date(date);
        if (showFromPicker) {
            setShowFromPicker(false);
            setFromDate(selectedDate);
            load(selectedDate, toDate);
        } else if (showToPicker) {
            setShowToPicker(false);
            setToDate(selectedDate);
            load(fromDate, selectedDate);
        }
    };

    const renderServiceCard = ({ item, index }: { item: any; index: number }) => (
        <ServiceCard
            key={index}
            leadId={item.LeadID}
            leadNo={item.LeadNo || item.ComplaintNo || item.No}
            leadType={item.ServiceTypeName || item.ComplaintType || item.ServiceType}
            leadAmt={item.LeadAmount || item.CustomerAmt}
            leadStatus={item.LeadStatus}
            leadDate={item.LeadDate}
            leadCity={item.CityName ? (item.CityName + ', ' + item.StateName) : ''}
            leadDescription={item.Desc || item.Description || item.PartsDesc}
            leadBrand={`${item.BrandName} (${item.ModelName})`}
            deniedReason={item.Reason}
            deniedDate={item.DeniedDate}
            deniedStatus={item.DeniedStatus}
            completedDate={item.CompletedDate}
            completedAmout={item.CustomerAmount || item.CustomerAmt}
            reComplaintId={item.ComplaintID}
            customerName={item.CustomerName}
            customerMobile={item.MobileNo}
            customerAddress={item.Address}
            acceptLeadDate={item.AcceptDate}
            isAdminView={true}
        />
    );

    const renderEmptyList = () => (
        <View style={dashboardStyles.emptyStateContainer}>
            <Image
                source={require('../../../assets/img/OnGoingService.png')}
                style={dashboardStyles.emptyStateImage}
            />
            <Text style={dashboardStyles.emptyStateTitle}>
                No Leads Found
            </Text>
            <Text style={dashboardStyles.emptyStateDescription}>
                There are no leads available for the selected date range.
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={bookingStyles.container} edges={['top']}>
            {/* Full Screen Loader */}
            <Modal
                transparent={true}
                animationType="none"
                visible={isLoading}
                onRequestClose={() => { }}>
                <View style={bookingStyles.loaderOverlay}>
                    <ActivityIndicator size="large" color="#0A8485" />
                </View>
            </Modal>
            <StatusBar backgroundColor="#086364" barStyle="light-content" />

            {/* Header */}
            <View style={[bookingStyles.header, { backgroundColor: '#0A8485' }]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={bookingStyles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={[bookingStyles.headerTitle, { color: '#FFFFFF' }]}>All Leads</Text>
            </View>

            {/* Date Filters */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowFromPicker(true)}>
                    <Text style={styles.dateLabel}>From:</Text>
                    <View style={styles.dateValueContainer}>
                        <Ionicons name="calendar-outline" size={16} color="#0A8485" />
                        <Text style={styles.dateValue}>{fromDate.toLocaleDateString()}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={styles.datePickerBtn} onPress={() => setShowToPicker(true)}>
                    <Text style={styles.dateLabel}>To:</Text>
                    <View style={styles.dateValueContainer}>
                        <Ionicons name="calendar-outline" size={16} color="#0A8485" />
                        <Text style={styles.dateValue}>{toDate.toLocaleDateString()}</Text>
                    </View>
                </TouchableOpacity>
            </View>

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
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <View>
                                <Text style={styles.modalSubtitle}>
                                    Select Date
                                </Text>
                                <Text style={styles.modalTitle}>
                                    {showFromPicker ? 'Start Date' : 'End Date'}
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    setShowFromPicker(false);
                                    setShowToPicker(false);
                                }}
                                style={styles.closeBtn}
                            >
                                <Ionicons name="close" size={24} color="#8F9BB3" />
                            </TouchableOpacity>
                        </View>

                        <CalendarPicker
                            onDateChange={onDateChange}
                            selectedDayColor="#0A8485"
                            selectedDayTextColor="#FFFFFF"
                            todayBackgroundColor="#E4E9F2"
                            todayTextStyle={{ color: '#222B45', fontWeight: 'bold' }}
                            initialDate={showToPicker ? toDate : fromDate}
                            width={Dimensions.get('window').width - 88}
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
                            nextComponent={<Ionicons name="chevron-forward" size={24} color="#0A8485" />}
                            previousComponent={<Ionicons name="chevron-back" size={24} color="#0A8485" />}
                        />
                    </View>
                </View>
            </Modal>

            {/* Booking List */}
            <FlatList
                data={assignedServices}
                renderItem={renderServiceCard}
                keyExtractor={(item, index) => item.LeadID ? item.LeadID.toString() : index.toString()}
                style={{ backgroundColor: '#F5F6FA', paddingTop: 10 }}
                contentContainerStyle={bookingStyles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyList}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    datePickerBtn: {
        width: '48%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    dateLabel: {
        fontSize: 12,
        color: '#8F8F8F',
        marginBottom: 4,
    },
    dateValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1C1F34',
        marginLeft: 6,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },
    modalContent: {
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
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#8F9BB3',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#222B45',
        marginTop: 4
    },
    closeBtn: {
        padding: 8,
        backgroundColor: '#F7F9FC',
        borderRadius: 12
    }
});

export default AdminLeadList;
