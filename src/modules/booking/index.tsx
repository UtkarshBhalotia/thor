import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
    InteractionManager,
    StatusBar,
    ActivityIndicator,
    Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { bookingStyles } from '../../assets/css/bookingStyles';
import ServiceCard from '../dashboard/components/ServiceCard';
import AcceptLeadConfirmationModal from '../../components/AcceptLeadConfirmationModal';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppDispatch, RootState } from '../../../store';
import { connect } from 'react-redux';
import { bookingActions_dispatch } from '../../../store/action/mainTypedAction';
import { showToast } from '../../utils/common';
import { RootStackParamList } from '../../navigations/navigation';

type BookingStatus =
    | 'New'
    | 'Ongoing'
    | 'Follow Up'
    | 'Denied'
    | 'Completed'
    | 'Complaint';
type TabFilter = 'All' | BookingStatus;

const Booking = (props: any) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<any>();
    const initialTab = route.params?.initialTab as TabFilter;

    const [activeTab, setActiveTab] = useState<TabFilter>(initialTab || 'New');
    const [assignedServices, setAssignedServices] = useState<any[]>([]);
    const [selectedLead, setSelectedLead] = useState<any | null>(null);
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

    const load = (status: string) => {
        setIsLoading(true);
        const startTime = Date.now();

        props.bookingActions('Get_Leads_List_Api', {
            status: status,
            callBack: (data: any) => {
                const endTime = Date.now();
                const duration = endTime - startTime;
                const minDuration = 500; // 500ms minimum loading time

                if (duration < minDuration) {
                    setTimeout(() => {
                        setAssignedServices(data);
                        setIsLoading(false);
                    }, minDuration - duration);
                } else {
                    setAssignedServices(data);
                    setIsLoading(false);
                }
            },
        });
    };

    // Tab options
    const tabs: TabFilter[] = [
        'New',
        'Ongoing',
        'Follow Up',
        'Denied',
        'Completed',
        'Complaint',
    ];

    // Get count for each tab (Note: This will only show count for loaded data,
    // maybe we need a separate count API or just match current list)
    const getTabCount = (tab: TabFilter) => {
        if (tab === activeTab) {
            return assignedServices.length;
        }
        // Since we are fetching per tab, we might not have counts for other tabs
        // unless we fetch them or have a separate summary API.
        // For now, staying consistent with the request but noting this behavior.
        return 0;
    };

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
                        setSelectedLead(null);
                        setActiveTab('Ongoing');
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
                        load(activeTab);
                        if (activeTab !== 'Ongoing') {
                            load('Ongoing');
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
        const lead = assignedServices.find((item) => item.LeadID === leadId);
        if (lead) {
            props.bookingActions('Complete_Lead_By_Vendor_Api', {
                leadId: leadId,
                partsDesc: data.serviceDetails,
                remarks: data.otherRemarks || '',
                customerAmount: data.totalBillAmount,
                callBack: (success: boolean, message: string) => {
                    if (success) {
                        load(activeTab);
                        if (activeTab !== 'Ongoing') {
                            load('Ongoing');
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
        }
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
                    setActiveTab('Ongoing');
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
            leadNo={item.LeadNo}
            leadType={item.ServiceTypeName}
            leadAmt={item.LeadAmount}
            leadStatus={item.LeadStatus}
            leadDate={item.LeadDate}
            leadCity={item.CityName + ', ' + item.StateName}
            leadDescription={item.Desc}
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
            onDenied={(leadId: string, reason: string) =>
                handleDeniedLead(leadId, reason)
            }
            onCompleted={(data: {
                totalBillAmount: string;
                serviceDetails: string;
                otherRemarks: string;
            }) => handleCompletedLead(item.LeadID, data)}
            onFollowUp={(data: {
                nextFollowUpDate: Date;
                followUpDetails: string;
            }) => handleFollowUpLead(item.LeadID, data)}
            onCustomerDetailsClick={handleCustomerDetailsClick}
        />
    );

    // Get tab styles based on status
    const getTabStyles = (tab: TabFilter) => {
        const isActive = activeTab === tab;
        if (!isActive) return { tab: {}, text: {} };

        switch (tab) {
            case 'New':
                return {
                    tab: { backgroundColor: '#E3F2FD' },
                    text: { color: '#1976D2' },
                };
            case 'Ongoing':
                return {
                    tab: { backgroundColor: '#FFF3E0' },
                    text: { color: '#F57C00' },
                };
            case 'Complaint':
                return {
                    tab: { backgroundColor: '#FFEBEE' },
                    text: { color: '#D32F2F' },
                };
            case 'Completed':
                return {
                    tab: { backgroundColor: '#E8F5E9' },
                    text: { color: '#388E3C' },
                };
            case 'Denied':
                return {
                    tab: { backgroundColor: '#F5F5F5' },
                    text: { color: '#616161' },
                };
            case 'Follow Up':
                return {
                    tab: { backgroundColor: '#F3E5F5' },
                    text: { color: '#7B1FA2' },
                };
            case 'All':
            default:
                return {
                    tab: bookingStyles.tabActive,
                    text: bookingStyles.tabTextActive,
                };
        }
    };

    const renderEmptyList = () => (
        <View style={bookingStyles.emptyContainer}>
            <Text style={bookingStyles.emptyText}>
                No {activeTab === 'All' ? '' : activeTab.toLowerCase()} leads
                found
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={bookingStyles.container} edges={['top']}>
            <StatusBar backgroundColor="#F5F6FA" barStyle="dark-content" />

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
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            {/* Header */}
            <View style={bookingStyles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={bookingStyles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#1C1F34" />
                </TouchableOpacity>
                <Text style={bookingStyles.headerTitle}>Leads</Text>
            </View>

            {/* Tab Filter */}
            <View style={bookingStyles.tabContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={bookingStyles.tabScrollContent}
                    style={bookingStyles.tabScrollView}>
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab;
                        const tabStyles = getTabStyles(tab);

                        return (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    bookingStyles.tab,
                                    isActive && tabStyles.tab,
                                ]}
                                onPress={() => setActiveTab(tab)}>
                                <Text
                                    style={[
                                        bookingStyles.tabText,
                                        isActive && tabStyles.text,
                                    ]}>
                                    {tab === 'All'
                                        ? `${tab} Leads`
                                        : `${tab} Leads`}{' '}
                                    {isActive
                                        ? `(${assignedServices.length})`
                                        : ''}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Booking List */}
            <FlatList
                data={assignedServices}
                renderItem={renderServiceCard}
                keyExtractor={(item, index) => item.LeadID || index.toString()}
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
