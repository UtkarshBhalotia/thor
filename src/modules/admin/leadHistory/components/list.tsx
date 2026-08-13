import React from 'react';
import { View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import ServiceCard from '../../../dashboard/components/ServiceCard';
import { bookingStyles } from '../../../../assets/css/bookingStyles';
import { dashboardStyles } from '../../../../assets/css/dashboardStyles';

interface IProps {
    data: any[];
    loading: boolean;
    hasSearched: boolean;
}

const LeadHistoryList: React.FC<IProps> = ({ data, loading, hasSearched }) => {
    console.log('LeadHistoryList');

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
            leadType={
                item.ServiceTypeName || item.ComplaintType || item.ServiceType
            }
            leadAmt={item.LeadAmount || item.CustomerAmt}
            leadStatus={item.LeadStatus}
            leadDate={item.LeadDate}
            leadCity={
                item.CityName ? item.CityName + ', ' + item.StateName : ''
            }
            leadDescription={
                item.ShortDesc ||
                item.Desc ||
                item.Description ||
                item.PartsDesc
            }
            leadBrand={`${item.BrandName} (${item.ModelName})`}
            deniedReason={item.DeniedReason || item.Reason}
            deniedDate={item.DeniedDate}
            deniedStatus={item.DeniedStatus}
            completedDate={item.CompletedDate}
            completedAmout={
                item.CompletedAmount || item.CustomerAmount || item.CustomerAmt
            }
            reComplaintId={item.ComplaintID || item.LeadID}
            reComplaintDate={item.ReComplaintDate || item.reComplaintDate}
            customerName={item.customerName}
            customerMobile={item.mobileNo}
            customerAddress={item.address}
            acceptLeadDate={item.acceptDate}
            partnerName={item.patnerName}
            partnerMobile={item.patnerMobileNo}
            isAdminView={true}
            isHistoryView={true}
        />
    );

    const renderEmptyList = () => (
        <View style={dashboardStyles.emptyStateContainer}>
            <Image
                source={require('../../../../assets/img/OnGoingService.png')}
                style={dashboardStyles.emptyStateImage}
            />
            <Text style={dashboardStyles.emptyStateTitle}>
                {hasSearched ? 'No History Found' : 'Search Lead History'}
            </Text>
            <Text style={dashboardStyles.emptyStateDescription}>
                {hasSearched
                    ? "We couldn't find any records matching your search criteria."
                    : 'Enter a Lead Number or Mobile Number to search for history.'}
            </Text>
        </View>
    );

    if (loading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#F5F6FA',
                }}>
                <ActivityIndicator size="large" color="#0A8485" />
                <Text
                    style={{
                        marginTop: 12,
                        fontSize: 14,
                        color: '#0A8485',
                        fontWeight: '500',
                    }}>
                    Fetching history...
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={data}
            renderItem={renderServiceCard}
            keyExtractor={(item, index) =>
                item.LeadID ? item.LeadID.toString() : index.toString()
            }
            style={{ backgroundColor: '#F5F6FA' }}
            contentContainerStyle={bookingStyles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyList}
        />
    );
};

export default LeadHistoryList;
