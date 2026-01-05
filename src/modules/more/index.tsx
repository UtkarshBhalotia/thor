import React from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moreStyles } from '../../assets/css/moreStyles';
import ProfileMenuItem from '../profile/components/ProfileMenuItem';
import { CommonActions, NavigationProp, useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem, STORAGE_KEYS } from '../../utils/storage';
import { RootState } from '../../../store';
import LogoutModal from '../../components/LogoutModal';

const More = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const dispatch = useDispatch();
    const globalState = useSelector((state: RootState) => state.globalState);
    const [showLogoutModal, setShowLogoutModal] = React.useState(false);

    const handleAction = (title: string) => {
        if (title === 'Change password') {
            navigation.navigate('ChangePassword');
            return;
        }
        if (title === 'Report') {
            navigation.navigate('Report');
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

    const businessMenu = [
        { title: 'Tax invoice', ionicon: 'receipt-outline' },
        { title: 'Report', ionicon: 'bar-chart-outline' },
    ];

    const accountMenu = [
        { title: 'Change password', ionicon: 'lock-closed-outline' },
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
                    <Text style={moreStyles.versionText}>Version 1.0.0 (Build 01)</Text>
                </View>
            </ScrollView>

            <LogoutModal
                visible={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onLogout={confirmLogout}
            />
        </SafeAreaView>
    );
};

export default More;
