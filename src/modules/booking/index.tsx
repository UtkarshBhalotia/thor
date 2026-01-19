import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    InteractionManager,
    StatusBar,
    ActivityIndicator,
    Modal,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { bookingStyles } from '../../assets/css/bookingStyles';
import ServiceCard from '../dashboard/components/ServiceCard';
import AcceptLeadConfirmationModal from '../../components/AcceptLeadConfirmationModal';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppDispatch, RootState } from '../../../store';
import { connect } from 'react-redux';
import { bookingActions_dispatch } from '../../../store/action/mainTypedAction';
import { showToast } from '../../utils/common';
import { RootStackParamList } from '../../navigations/navigation';
import { dashboardStyles } from '../../assets/css/dashboardStyles';

type BookingStatus =
    | 'New'
    | 'Ongoing'
    | 'Follow Up'
    | 'Denied'
    | 'Completed'
    | 'Complaint';
type TabFilter = 'All' | BookingStatus;

const TAB_CONFIG: Record<BookingStatus, { icon: string; style: any; text: string }> = {
    New: { icon: 'flash', style: bookingStyles.tabNew, text: 'New' },
    Ongoing: { icon: 'construct', style: bookingStyles.tabOngoing, text: 'Ongoing' },
    'Follow Up': { icon: 'call', style: bookingStyles.tabFollowUp, text: 'Follow Up' },
    Denied: { icon: 'close-circle', style: bookingStyles.tabDenied, text: 'Denied' },
    Completed: { icon: 'checkmark-circle', style: bookingStyles.tabCompleted, text: 'Completed' },
    Complaint: { icon: 'alert-circle', style: bookingStyles.tabComplaint, text: 'Complaint' },
};

const Booking = (props: any) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<any>();
    const initialTab = route.params?.initialTab as TabFilter;

    const [activeTab, setActiveTab] = useState<TabFilter>(initialTab || 'New');
    const [assignedServices, setAssignedServices] = useState<any[]>([]);
    const [selectedLead, setSelectedLead] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAcceptingLead, setIsAcceptingLead] = useState(false);
    const [isDenyingLead, setIsDenyingLead] = useState(false);
    const acceptModalRef = useRef<BottomSheetModal>(null);

    // Sync activeTab with initialTab from params
    useEffect(() => {
        if (route.params?.initialTab) {
            setActiveTab(route.params.initialTab);
        }
    }, [route.params?.initialTab]);

    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            load(activeTab);
        });
        return () => {
            task.cancel();
        };
    }, [activeTab]);

    const load = (status: TabFilter) => {
        setIsLoading(true);
        props.bookingActions('Get_Leads_List_Api', {
            status: status === 'All' ? '' : status,
            callBack: (data: any[]) => {
                setAssignedServices(data || []);
                setIsLoading(false);
            },
        });
    };

    const tabs: BookingStatus[] = [
        'New',
        'Ongoing',
        'Follow Up',
        'Denied',
        'Completed',
        'Complaint',
    ];

    const handleAcceptService = (serviceId: string) => {
        const lead = assignedServices.find((item) => item.LeadID === serviceId);
        if (lead) {
            setSelectedLead(lead);
            acceptModalRef.current?.present();
        }
    };

    const handleAcceptLeadSubmit = (data: { amount: string }) => {
        if (selectedLead) {
            setIsAcceptingLead(true);
            const amountToSend = data.amount || selectedLead.LeadAmount || '';
            props.bookingActions('Accept_Lead_By_Vendor_Api', {
                leadId: selectedLead.LeadID,
                amount: amountToSend,
                callBack: (success: boolean, message: string) => {
                    setIsAcceptingLead(false);
                    if (success) {
                        acceptModalRef.current?.dismiss();
                        if (activeTab === 'Ongoing') {
                            load('Ongoing');
                        } else {
                            setActiveTab('Ongoing');
                        }
                        showToast({
                            type: 'success',
                            text1: message || 'Lead accepted successfully',
                            visibilityTime: 2000,
                        });
                    } else {
                        showToast({
                            type: 'error',
                            text1: message || 'Failed to accept lead',
                            visibilityTime: 3000,
                        });
                    }
                },
            });
        }
    };

    const handleDeniedLead = (leadId: string, reason: string) => {
        const lead = assignedServices.find((item) => item.LeadID === leadId);
        if (lead) {
            setIsDenyingLead(true);
            props.bookingActions('Deny_Lead_By_Vendor_Api', {
                leadId: leadId,
                reason: reason,
                amount: lead.LeadAmount || '',
                callBack: (success: boolean, message: string) => {
                    setIsDenyingLead(false);
                    if (success) {
                        if (activeTab === 'Ongoing') {
                            load('Ongoing');
                        } else {
                            setActiveTab('Ongoing');
                        }
                        showToast({
                            type: 'success',
                            text1: message || 'Lead denied successfully',
                            visibilityTime: 2000,
                        });
                    } else {
                        showToast({
                            type: 'error',
                            text1: message || 'Failed to deny lead',
                            visibilityTime: 3000,
                        });
                    }
                },
            });
        }
    };

    const handleCompletedLead = (
        leadId: string,
        data: {
            totalBillAmount: string;
            serviceDetails: string;
            otherRemarks: string;
        },
    ) => {
        props.bookingActions('Complete_Lead_By_Vendor_Api', {
            leadId: leadId,
            partsDesc: data.serviceDetails,
            remarks: data.otherRemarks || '',
            customerAmount: data.totalBillAmount,
            callBack: (success: boolean, message: string) => {
                if (success) {
                    if (activeTab === 'Ongoing') {
                        load('Ongoing');
                    } else {
                        setActiveTab('Ongoing');
                    }
                    showToast({
                        type: 'success',
                        text1: message || 'Lead completed successfully',
                        visibilityTime: 2000,
                    });
                } else {
                    showToast({
                        type: 'error',
                        text1: message || 'Failed to complete lead',
                        visibilityTime: 3000,
                    });
                }
            },
        });
    };

    const handleFollowUpLead = (
        leadId: string,
        data: {
            nextFollowUpDate: Date;
            followUpDetails: string;
        },
    ) => {
        const formatDateForApi = (date: Date) => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        };

        props.bookingActions('FollowUp_Lead_By_Vendor_Api', {
            leadId: leadId,
            desc: data.followUpDetails,
            nextDate: formatDateForApi(data.nextFollowUpDate),
            callBack: (success: boolean, message: string) => {
                if (success) {
                    if (activeTab === 'Ongoing') {
                        load('Ongoing');
                    } else {
                        setActiveTab('Ongoing');
                    }
                    showToast({
                        type: 'success',
                        text1: message || 'Follow up added successfully',
                        visibilityTime: 2000,
                    });
                } else {
                    showToast({
                        type: 'error',
                        text1: message || 'Failed to add follow up',
                        visibilityTime: 3000,
                    });
                }
            },
        });
    };

    const handleCustomerDetailsClick = (
        leadId: string,
        callBack: (data: any) => void,
    ) => {
        props.bookingActions('Get_Lead_Detail_By_LeadId_Api', {
            leadId: leadId,
            callBack: callBack,
        });
    };

    const renderServiceCard = ({
        item,
        index,
    }: {
        item: any;
        index: number;
    }) => (
        <ServiceCard
            key={index}
            leadId={item.LeadID}
            leadNo={item.LeadNo || item.ComplaintNo || item.No}
            leadType={item.ServiceTypeName || item.ComplaintType || item.ServiceType}
            leadAmt={item.LeadAmount || item.CustomerAmt}
            leadStatus={item.LeadStatus}
            leadDate={item.LeadDate}
            leadCity={item.CityName + ', ' + item.StateName}
            leadDescription={item.Desc || item.Description || item.PartsDesc}
            leadBrand={`${item.BrandName} (${item.ModelName})`}
            deniedReason={item.Reason}
            deniedDateStatus={`${item.DeniedDate} \ ${item.DeniedStatus}`}
            completedDate={item.CompletedDate}
            completedAmout={item.CustomerAmount}
            customerName={item.CustomerName}
            customerMobile={item.MobileNo}
            customerAddress={item.Address}
            acceptLeadDate={item.AcceptDate}
            onAccept={() => handleAcceptService(item.LeadID)}
            onDenied={handleDeniedLead}
            onCompleted={(data) => handleCompletedLead(item.LeadID, data)}
            onFollowUp={(data: {
                nextFollowUpDate: Date;
                followUpDetails: string;
            }) => handleFollowUpLead(item.LeadID, data)}
            onCustomerDetailsClick={handleCustomerDetailsClick}
        />
    );

    const renderEmptyList = () => (
        <View style={dashboardStyles.emptyStateContainer}>
            <Image
                source={require('../../assets/img/OnGoingService.png')}
                style={dashboardStyles.emptyStateImage}
            />
            <Text style={dashboardStyles.emptyStateTitle}>
                No {activeTab} Leads Found
            </Text>
            <Text style={dashboardStyles.emptyStateDescription}>
                You don't have any {activeTab.toLowerCase()} leads at the
                moment. New requests will appear here once assigned.
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
                    <ActivityIndicator size="large" color="#5F60B9" />
                </View>
            </Modal>
            <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} />

            {/* Header */}
            <View style={bookingStyles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={bookingStyles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#1C1F34" />
                </TouchableOpacity>
                <Text style={bookingStyles.headerTitle}>Leads</Text>
            </View>

            {/* Tab Filter Grid */}
            <View style={bookingStyles.tabContainer}>
                <View style={bookingStyles.tabGrid}>
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab;
                        const config = TAB_CONFIG[tab];

                        return (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    bookingStyles.tab,
                                    isActive && bookingStyles.tabActive,
                                    isActive && config.style,
                                ]}
                                onPress={() => setActiveTab(tab)}>
                                <Ionicons
                                    name={config.icon}
                                    size={15}
                                    color={isActive ? '#FFFFFF' : '#8F8F8F'}
                                    style={bookingStyles.tabIcon}
                                />
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        bookingStyles.tabText,
                                        isActive && bookingStyles.tabTextActive,
                                    ]}>
                                    {config.text}
                                    {isActive ? ` (${assignedServices.length})` : ''}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Booking List */}
            <FlatList
                data={assignedServices}
                renderItem={renderServiceCard}
                keyExtractor={(item, index) => item.LeadID || index.toString()}
                style={{ backgroundColor: '#F5F6FA' }}
                contentContainerStyle={bookingStyles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyList}
            />

            {/* Accept Lead Confirmation Modal */}
            <AcceptLeadConfirmationModal
                ref={acceptModalRef}
                onSubmit={handleAcceptLeadSubmit}
                leadDetails={
                    selectedLead
                        ? {
                            leadNo: selectedLead.LeadNo,
                            leadType: selectedLead.ServiceTypeName,
                            leadAmount: selectedLead.LeadAmount,
                            leadDate: selectedLead.LeadDate,
                        }
                        : undefined
                }
                isLoading={isAcceptingLead}
            />
        </SafeAreaView>
    );
};

const mapStateToProps = (state: RootState) => ({
    globalState: state.globalState,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
    bookingActions: bookingActions_dispatch(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Booking);
