import React from 'react';
import { View, Text, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { profileStyles } from '../../assets/css/profileStyles';
import ProfileMenuItem from './components/ProfileMenuItem';
import {
    CommonActions,
    NavigationProp,
    useNavigation,
} from '@react-navigation/native';
import { removeItem, STORAGE_KEYS } from '../../utils/storage';
import { useDispatch } from 'react-redux';

const Profile = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();

    // Sample data - replace with actual data from API/Redux
    const userProfile = {
        name: 'John Williams',
        email: 'john.williams@example.com',
        rating: 3.5,
        memberSince: '2022',
        location: 'New Jersey, USA',
        servicesDelivered: 250,
        serviceType: 'Freelancer',
        experience: '5 years of exp.',
    };

    // Get initials from name
    const getInitials = (name: string) => {
        const names = name.split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout from this application?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await removeItem(STORAGE_KEYS.USER_INFO);
                        await removeItem(STORAGE_KEYS.AUTH_TOKEN);
                        dispatch({ type: 'GLOBAL_RESET' });
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            }),
                        );
                    },
                },
            ],
        );
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Delete Account',
            'Your account will be permanently erased if you choose to delete it. There is no way to get your info back.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        // Implement delete account logic
                        console.log('Deleting account...');
                    },
                },
            ],
        );
    };

    return (
        <SafeAreaView style={profileStyles.container} edges={['top']}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={profileStyles.scrollContent}>
                {/* Profile Header */}
                <View style={profileStyles.profileHeader}>
                    {/* Avatar */}
                    <View style={profileStyles.avatarContainer}>
                        <Text style={profileStyles.avatarText}>
                            {getInitials(userProfile.name)}
                        </Text>
                    </View>

                    {/* User Name */}
                    <Text style={profileStyles.userName}>
                        {userProfile.name}
                    </Text>

                    {/* Rating */}
                    <View style={profileStyles.ratingContainer}>
                        <Text style={{ fontSize: 16 }}>⭐</Text>
                        <Text style={profileStyles.ratingText}>
                            {userProfile.rating}
                        </Text>
                    </View>

                    {/* Member Since */}
                    <Text style={profileStyles.memberSince}>
                        Member since {userProfile.memberSince}
                    </Text>

                    {/* Location */}
                    <View style={profileStyles.locationContainer}>
                        <Text style={{ fontSize: 14 }}>📍</Text>
                        <Text style={profileStyles.locationText}>
                            {userProfile.location}
                        </Text>
                    </View>

                    {/* Stats Row */}
                    <View style={profileStyles.statsRow}>
                        <View style={profileStyles.statItem}>
                            <Text style={profileStyles.statLabel}>
                                Services Delivered
                            </Text>
                            <Text style={profileStyles.statValue}>
                                {userProfile.servicesDelivered} service
                            </Text>
                        </View>
                        <View style={profileStyles.statItem}>
                            <Text style={profileStyles.statLabel}>
                                Type of Servicemen
                            </Text>
                            <Text style={profileStyles.statValue}>
                                {userProfile.serviceType}
                            </Text>
                        </View>
                        <View style={profileStyles.statItem}>
                            <Text style={profileStyles.statLabel}>
                                No. of Experience
                            </Text>
                            <Text style={profileStyles.statValue}>
                                {userProfile.experience}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Company Info Section */}
                <View style={profileStyles.section}>
                    <Text style={profileStyles.sectionTitle}>Company Info</Text>
                    <ProfileMenuItem
                        icon="⚙️"
                        title="Profile Setting"
                        onPress={() => console.log('Profile Setting')}
                    />
                    <ProfileMenuItem
                        icon="🏦"
                        title="Bank Details"
                        onPress={() => console.log('Bank Details')}
                    />
                    <ProfileMenuItem
                        icon="🆔"
                        title="ID Verification"
                        onPress={() => console.log('ID Verification')}
                    />
                </View>

                {/* Other Details Section */}
                <View style={profileStyles.section}>
                    <Text style={profileStyles.sectionTitle}>
                        Other Details
                    </Text>
                    <ProfileMenuItem
                        icon="📱"
                        title="App Setting"
                        onPress={() => console.log('App Setting')}
                    />
                    <ProfileMenuItem
                        icon="🕐"
                        title="Time Slots"
                        onPress={() => console.log('Time Slots')}
                    />
                    <ProfileMenuItem
                        icon="💰"
                        title="Commission Details"
                        onPress={() => console.log('Commission Details')}
                    />
                    <ProfileMenuItem
                        icon="⭐"
                        title="My Review"
                        onPress={() => console.log('My Review')}
                    />
                </View>

                {/* Alert Zone Section */}
                <View style={profileStyles.section}>
                    <Text style={profileStyles.sectionTitle}>Alert Zone</Text>
                    <ProfileMenuItem
                        icon="🗑️"
                        title="Delete Account"
                        onPress={handleDeleteAccount}
                        isAlert={true}
                    />
                    <ProfileMenuItem
                        icon="🚪"
                        title="Logout"
                        onPress={handleLogout}
                        isLogout={true}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
