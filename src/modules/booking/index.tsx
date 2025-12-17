import React, { useState, useMemo } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { bookingStyles } from '../../assets/css/bookingStyles';
import BookingCard, { BookingStatus } from './components/BookingCard';
import { NavigationProp, useNavigation } from '@react-navigation/native';

type TabFilter = 'All' | BookingStatus;

interface Booking {
    id: string;
    bookingId: string;
    serviceName: string;
    price: string;
    discount?: string;
    status: BookingStatus;
    servicemenCount: string;
    dateTime: string;
    location?: string;
    payment: string;
    customerName: string;
}

const Booking = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [activeTab, setActiveTab] = useState<TabFilter>('All');

    // Sample booking data - replace with actual data from API/Redux
    const allBookings: Booking[] = [
        {
            id: '1',
            bookingId: '#58961',
            serviceName: 'Curtain Cleaning',
            price: '$22.00',
            discount: '(10% off)',
            status: 'Pending',
            servicemenCount: '1 servicemen',
            dateTime: '6 Aug, 2024 - 5:20 pm',
            location: 'California - USA',
            payment: '$30.23',
            customerName: 'Stella Milevski',
        },
        {
            id: '2',
            bookingId: '#58962',
            serviceName: 'House Hold Cook',
            price: '$20.00',
            discount: '(10% off)',
            status: 'Accepted',
            servicemenCount: '1 servicemen',
            dateTime: '7 Aug, 2024 - 11:00 am',
            location: 'California - USA',
            payment: '$30.23',
            customerName: 'Kate Tanner',
        },
        {
            id: '3',
            bookingId: '#58964',
            serviceName: 'Hair Cutting & Spa',
            price: '$30.00',
            discount: '(10% off)',
            status: 'Ongoing',
            servicemenCount: '1 servicemen',
            dateTime: '7 Aug, 2024 - 2:00 pm',
            location: 'California - USA',
            payment: '$30.23',
            customerName: 'Jane Cooper',
        },
        {
            id: '4',
            bookingId: '#58966',
            serviceName: 'Furnishing & Carpentry',
            price: '$50.20',
            status: 'Completed',
            servicemenCount: '2 servicemen',
            dateTime: '7 Aug, 2024 - 9:00 am',
            location: 'California - USA',
            payment: '$30.23',
            customerName: 'Zain Dorwart',
        },
        {
            id: '5',
            bookingId: '#58968',
            serviceName: 'Chimney Sweeping',
            price: '$15.50',
            status: 'Cancelled',
            servicemenCount: '1 servicemen',
            dateTime: '8 Aug, 2024 - 10:00 am',
            payment: '$0.00',
            customerName: 'Lynn Tanner',
        },
    ];

    // Tab options
    const tabs: TabFilter[] = [
        'All',
        'Pending',
        'Accepted',
        'Ongoing',
        'Completed',
        'Cancelled',
    ];

    // Filter bookings based on active tab
    const filteredBookings = useMemo(() => {
        if (activeTab === 'All') {
            return allBookings;
        }
        return allBookings.filter(booking => booking.status === activeTab);
    }, [activeTab, allBookings]);

    // Get count for each tab
    const getTabCount = (tab: TabFilter) => {
        if (tab === 'All') {
            return allBookings.length;
        }
        return allBookings.filter(booking => booking.status === tab).length;
    };

    const handleBookingPress = (booking: Booking) => {
        console.log('Booking pressed:', booking.bookingId);
        // Navigate to booking details screen
        // navigation.navigate('BookingDetails', { bookingId: booking.id });
    };

    const renderBookingCard = ({ item }: { item: Booking }) => (
        <BookingCard
            bookingId={item.bookingId}
            serviceName={item.serviceName}
            price={item.price}
            discount={item.discount}
            status={item.status}
            servicemenCount={item.servicemenCount}
            dateTime={item.dateTime}
            location={item.location}
            payment={item.payment}
            customerName={item.customerName}
            onPress={() => handleBookingPress(item)}
        />
    );

    const renderEmptyList = () => (
        <View style={bookingStyles.emptyContainer}>
            <Text style={bookingStyles.emptyText}>
                No {activeTab === 'All' ? '' : activeTab.toLowerCase()} bookings found
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={bookingStyles.container} edges={['top']}>
            {/* Header */}
            <View style={bookingStyles.header}>
                <Text style={bookingStyles.headerTitle}>All Booking</Text>
            </View>

            {/* Tab Filter */}
            <View style={bookingStyles.tabContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={bookingStyles.tabScrollContent}
                    style={bookingStyles.tabScrollView}
                >
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab;
                        const count = getTabCount(tab);

                        return (
                            <TouchableOpacity
                                key={tab}
                                style={[
                                    bookingStyles.tab,
                                    isActive && bookingStyles.tabActive,
                                ]}
                                onPress={() => setActiveTab(tab)}
                            >
                                <Text
                                    style={[
                                        bookingStyles.tabText,
                                        isActive && bookingStyles.tabTextActive,
                                    ]}
                                >
                                    {tab === 'All' ? `${tab} Booking` : `${tab} Booking`} ({count})
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Booking List */}
            <FlatList
                data={filteredBookings}
                renderItem={renderBookingCard}
                keyExtractor={(item) => item.id}
                contentContainerStyle={bookingStyles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmptyList}
            />
        </SafeAreaView>
    );
};

export default Booking;
