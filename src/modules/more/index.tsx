import React from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, StatusBar, Switch, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moreStyles } from '../../assets/css/moreStyles';
import ProfileMenuItem from '../profile/components/ProfileMenuItem';
import { CommonActions, NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem, STORAGE_KEYS } from '../../utils/storage';
import { RootState } from '../../../store';
import LogoutModal from '../../components/LogoutModal';
import BSModal from '../../components/BSModal';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { RootStackParamList } from '../../navigations/navigation';
import DeviceInfo from 'react-native-device-info';

const More = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const globalState = useSelector((state: RootState) => state.globalState);
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);
    const helpSupportModalRef = React.useRef<BottomSheetModal>(null);

    const handleAction = async (title: string) => {
        if (title === 'Change password') {
            navigation.navigate('ChangePassword');
            return;
        }
        if (title === 'Report') {
            navigation.navigate('Report');
            return;
        }
        if (title === 'Tax invoice') {
            navigation.navigate('Invoice');
            return;
        }
        if (title === 'Document verification') {
            navigation.navigate('IdVerification');
            return;
        }
        if (title === 'Share') {
            try {
                const result = await Share.share({
                    message:
                        'Check out this app: https://play.google.com/store/apps/details?id=com.roservice.partner',
                });
                if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                        // shared with activity type of result.activityType
                    } else {
                        // shared
                    }
                } else if (result.action === Share.dismissedAction) {
                    // dismissed
                }
            } catch (error: any) {
                Alert.alert(error.message);
            }
            return;
        }
        if (title === 'Help and support') {
            helpSupportModalRef.current?.present();
            return;
        }
        Alert.alert(title, `Functionality for ${title} coming soon.`);
    };

    const confirmLogout = async () => {
        setShowLogoutModal(false);
        await removeItem(STORAGE_KEYS.USER_INFO);
        await removeItem(STORAGE_KEYS.AUTH_TOKEN);
        dispatch({ type: 'GLOBAL_RESET' });
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            })
        );
    };

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const toggleAvailability = () => {
        const newValue = !globalState.isOnline;
        dispatch({
            type: 'GLOBAL_STATE_MUTATE',
            value: { ...globalState, isOnline: newValue },
        });
    };

    const businessMenu = [
        { title: 'Tax invoice', ionicon: 'receipt-outline' },
        { title: 'Report', ionicon: 'bar-chart-outline' },
    ];

    const accountMenu = [
        { title: 'Change password', ionicon: 'lock-closed-outline' },
        { title: 'Document verification', ionicon: 'id-card-outline' },
    ];

    const supportMenu = [
        { title: 'Help and support', ionicon: 'help-circle-outline' },
        { title: 'Share', ionicon: 'share-social-outline' },
    ];

    const renderMenuSection = (title: string, items: any[]) => (
        <View style={moreStyles.sectionContainer}>
            <View style={moreStyles.sectionHeader}>
                <Text style={moreStyles.sectionTitle}>{title}</Text>
            </View>
            <View style={moreStyles.menuCard}>
                {items.map((item, index) => (
                    <ProfileMenuItem
                        key={index}
                        ionicon={item.ionicon}
                        title={item.title}
                        onPress={() => item.title === 'Logout' ? handleLogout() : handleAction(item.title)}
                    />
                ))}
            </View>
        </View>
    );

    const userInitial = globalState.name ? globalState.name.charAt(0).toUpperCase() : 'U';

    return (
        <SafeAreaView style={moreStyles.container} edges={['top']}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
            
            {/* ... Existing JSX ... */}
            
            <View style={moreStyles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={moreStyles.backButton}
                >
                    <Ionicons name="chevron-back" size={24} color="#1C1F34" />
                </TouchableOpacity>
                <Text style={moreStyles.headerTitle}>More</Text>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={moreStyles.scrollContent}
            >
                {/* ... ProfileCard, Availability, Menu Sections ... */}
                
                {/* Profile Header */}
                <TouchableOpacity
                    style={moreStyles.profileCard}
                    onPress={() => navigation.navigate('Profile')}
                >
                    <View style={moreStyles.avatarContainer}>
                        <Text style={moreStyles.avatarText}>{userInitial}</Text>
                    </View>
                    <View style={moreStyles.profileInfo}>
                        <Text style={moreStyles.userName}>{globalState.name || 'User Name'}</Text>
                        <Text style={moreStyles.userEmail}>{globalState.email || 'user@example.com'}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#ADB5BD" style={moreStyles.editProfileIcon} />
                </TouchableOpacity>

                {/* Availability Section */}
                <View style={moreStyles.availabilityCard}>
                    <View style={moreStyles.availabilityHeader}>
                        <Text style={moreStyles.availabilityTitle}>Availability</Text>
                        <Switch
                            value={globalState.isOnline}
                            onValueChange={toggleAvailability}
                            trackColor={{ false: '#E9ECEF', true: '#4CAF50' }}
                            thumbColor="#FFFFFF"
                            ios_backgroundColor="#E9ECEF"
                        />
                    </View>
                    <Text style={moreStyles.availabilitySubtext}>
                        When Offline, admin can't assign leads
                    </Text>
                </View>

                {/* Menu Sections */}
                {renderMenuSection('Business & Reports', businessMenu)}
                {renderMenuSection('Account Settings', accountMenu)}
                {renderMenuSection('Support', supportMenu)}

                {/* Logout Button */}
                <View style={moreStyles.logoutContainer}>
                    <TouchableOpacity
                        style={moreStyles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={20} color="#FF4D4D" style={moreStyles.logoutIcon} />
                        <Text style={moreStyles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={moreStyles.footer}>
                    <Text style={moreStyles.versionText}>Version {DeviceInfo.getVersion()}</Text>
                </View>
            </ScrollView>

            <LogoutModal
                visible={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onLogout={confirmLogout}
            />

            <BSModal
                bsModalRef={helpSupportModalRef}
                headerTitle="Help & Support"
                snapPoints={['70%']}>
                <View style={moreStyles.helpModalContent}>
                    <View style={moreStyles.helpModalIcon}>
                        <Ionicons name="headset" size={40} color="#5F60B9" />
                    </View>
                    <Text style={moreStyles.helpModalTitle}>Contact Support</Text>
                    <Text style={moreStyles.helpModalDescription}>
                        Need assistance? Our support team is here to help you with any issues or queries.
                    </Text>

                    <View style={moreStyles.contactRow}>
                        <View style={moreStyles.contactIcon}>
                            <Ionicons name="mail-outline" size={24} color="#5F60B9" />
                        </View>
                        <View>
                            <Text style={moreStyles.contactLabel}>Email Us</Text>
                            <Text style={moreStyles.contactValue}>info@serviceondoors.com</Text>
                        </View>
                    </View>
                </View>
            </BSModal>
        </SafeAreaView>
    );
};

export default More;
