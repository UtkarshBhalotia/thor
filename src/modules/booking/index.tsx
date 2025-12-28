import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
    InteractionManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookingStyles } from '../../assets/css/bookingStyles';
import ServiceCard from '../dashboard/components/ServiceCard';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppDispatch, RootState } from '../../../store';
import { connect } from 'react-redux';
import { bookingActions_dispatch } from '../../../store/action/mainTypedAction';

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
    const [activeTab, setActiveTab] = useState<TabFilter>('New');
    const [assignedServices, setAssignedServices] = useState<any[]>([]);

    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            load(activeTab);
        });
        return () => {
            task.cancel();
        };
    }, [activeTab]);

    const load = (status: string) => {
        props.bookingActions('Get_Leads_List_Api', {
            status: status,
            callBack: (data: any) => {
                setAssignedServices(data);
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
        console.log('Accept service:', serviceId);
    };

    const handleRefuseService = (serviceId: string) => {
        console.log('Refuse service:', serviceId);
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
            onRefuse={() => handleRefuseService(item.LeadID)}
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
            {/* Header */}
            <View
                style={[
                    bookingStyles.header,
                    { flexDirection: 'row', alignItems: 'center' },
                ]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{
                        padding: 8,
                        marginRight: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
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
